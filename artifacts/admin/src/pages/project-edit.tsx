import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  useAdminCreateProject, 
  useAdminUpdateProject, 
  useAdminGetProject,
  useAdminDeleteProject,
  useAdminReplaceProjectImages,
  getAdminGetProjectQueryKey,
  getAdminListProjectsQueryKey,
  getListProjectsQueryKey,
  getGetProjectBySlugQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Save, X, ArrowLeft, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProjectGallery } from "@/components/admin/ProjectGallery";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título es muy largo"),
  slug: z.string().min(1, "El slug es requerido").max(120, "El slug es muy largo").regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  year: z.coerce.number().min(1900, "Año inválido").max(2100, "Año inválido"),
  location: z.enum(["quinta-region", "region-metropolitana", "argentina"], {
    required_error: "Selecciona una ubicación",
  }),
  type: z.enum(["residencial-casa", "residencial-departamento", "oficinas"], {
    required_error: "Selecciona un tipo",
  }),
  description: z.string().max(4000, "La descripción es muy larga").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectEditPageProps {
  mode: "create" | "edit";
  projectId?: string;
}

export default function ProjectEditPage({
  mode,
  projectId,
}: ProjectEditPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: project, isLoading: isLoadingProject } = useAdminGetProject(projectId || "", {
    query: {
      enabled: mode === "edit" && !!projectId,
      queryKey: getAdminGetProjectQueryKey(projectId || "")
    }
  });

  const createProject = useAdminCreateProject();
  const updateProject = useAdminUpdateProject();
  const deleteProject = useAdminDeleteProject();
  const replaceImages = useAdminReplaceProjectImages();

  // Local state for gallery
  const [localImages, setLocalImages] = useState<{ imagePath: string; sortOrder: number }[]>([]);
  const [localCover, setLocalCover] = useState<string>("/placeholder");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      year: new Date().getFullYear(),
      location: undefined,
      type: undefined,
      description: "",
    }
  });

  const watchTitle = form.watch("title");
  
  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
        
      const currentSlug = form.getValues("slug");
      
      // If user hasn't manually edited slug, or slug is empty, auto-update it
      if (!currentSlug || form.formState.dirtyFields.slug !== true) {
        form.setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: false });
      }
    }
  }, [watchTitle, mode, form]);

  const initRef = useRef(false);
  useEffect(() => {
    if (project && mode === "edit" && !initRef.current) {
      initRef.current = true;
      form.reset({
        title: project.title,
        slug: project.slug,
        year: project.year,
        location: project.location as any,
        type: project.type as any,
        description: project.description || "",
      });
      setLocalCover(project.coverImagePath);
      setLocalImages(project.images?.map(img => ({ imagePath: img.imagePath, sortOrder: img.sortOrder })) || []);
    }
  }, [project, mode, form]);

  const onSubmit = (data: FormValues) => {
    if (mode === "create") {
      createProject.mutate({
        data: {
          ...data,
          coverImagePath: localCover || "/placeholder",
        }
      }, {
        onSuccess: (newProject) => {
          toast({ title: "Proyecto creado", description: "El proyecto se guardó correctamente." });
          qc.invalidateQueries({ queryKey: getAdminListProjectsQueryKey() });
          qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setLocation(`/projects/${newProject.id}`);
        },
        onError: (err) => {
          toast({ title: "Error al crear", description: err.data?.error || err.message || "Error desconocido", variant: "destructive" });
        }
      });
    } else if (projectId) {
      updateProject.mutate({
        id: projectId,
        data: {
          ...data,
          coverImagePath: localCover || "/placeholder",
        }
      }, {
        onSuccess: (updatedProject) => {
          // Save gallery
          replaceImages.mutate({
            id: projectId,
            data: { images: localImages }
          }, {
            onSuccess: () => {
              toast({ title: "Proyecto guardado", description: "Los cambios y la galería se guardaron correctamente." });
              qc.invalidateQueries({ queryKey: getAdminGetProjectQueryKey(projectId) });
              qc.invalidateQueries({ queryKey: getGetProjectBySlugQueryKey(updatedProject.slug) });
              qc.invalidateQueries({ queryKey: getAdminListProjectsQueryKey() });
              qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
            },
            onError: () => {
              toast({ title: "Proyecto guardado", description: "Pero hubo un error al guardar la galería.", variant: "destructive" });
            }
          });
        },
        onError: (err) => {
          toast({ title: "Error al guardar", description: err.data?.error || err.message || "Error desconocido", variant: "destructive" });
        }
      });
    }
  };

  const handleDelete = () => {
    if (!projectId) return;
    deleteProject.mutate({ id: projectId }, {
      onSuccess: () => {
        toast({ title: "Proyecto eliminado", description: "El proyecto ha sido eliminado." });
        qc.invalidateQueries({ queryKey: getAdminListProjectsQueryKey() });
        qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setLocation("/projects");
      },
      onError: () => {
        toast({ title: "Error al eliminar", description: "No se pudo eliminar el proyecto.", variant: "destructive" });
      }
    });
  };

  // Dirty form warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  const isPending = createProject.isPending || updateProject.isPending || replaceImages.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header breadcrumb={
        <span className="truncate max-w-[200px] text-foreground">
          {mode === "create" ? "Nuevo proyecto" : (project?.title || "Cargando...")}
        </span>
      } />
      
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="rounded-none">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display tracking-tight text-foreground">
              {mode === "create" ? "Nuevo proyecto" : "Editar proyecto"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === "create" ? "Ingresa la información básica del proyecto." : "Modifica la información y gestiona la galería."}
            </p>
          </div>
          
          {mode === "edit" && (
            <div className="ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-none gap-2">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar {project?.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará el proyecto permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {isLoadingProject && mode === "edit" ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded-none w-full" />
            <div className="grid grid-cols-2 gap-6">
              <div className="h-12 bg-muted rounded-none" />
              <div className="h-12 bg-muted rounded-none" />
            </div>
            <div className="h-32 bg-muted rounded-none w-full" />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-card border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Título del proyecto</Label>
                  <Input 
                    id="title" 
                    placeholder="Ej: Edificio Los Cerezos" 
                    className="rounded-none border-border"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input 
                    id="slug" 
                    placeholder="edificio-los-cerezos" 
                    className="rounded-none border-border font-mono text-sm"
                    {...form.register("slug")}
                  />
                  {form.formState.errors.slug && <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input 
                    id="year" 
                    type="number"
                    className="rounded-none border-border"
                    {...form.register("year")}
                  />
                  {form.formState.errors.year && <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="type" className="rounded-none border-border w-full">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="residencial-casa">Residencial · Casa</SelectItem>
                          <SelectItem value="residencial-departamento">Residencial · Departamento</SelectItem>
                          <SelectItem value="oficinas">Oficinas</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.type && <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Controller
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="location" className="rounded-none border-border w-full">
                          <SelectValue placeholder="Selecciona una ubicación" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="quinta-region">V Región</SelectItem>
                          <SelectItem value="region-metropolitana">Región Metropolitana</SelectItem>
                          <SelectItem value="argentina">Argentina</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Detalles sobre el proyecto, materiales, concepto..." 
                    className="rounded-none border-border min-h-[120px]"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
              </div>
            </div>

            {mode === "edit" && project && (
              <div className="bg-card border border-border p-6">
                <ProjectGallery 
                  initialImages={project.images || []}
                  initialCover={project.coverImagePath}
                  onImagesChange={setLocalImages}
                  onCoverChange={setLocalCover}
                />
              </div>
            )}
            
            {mode === "create" && (
              <div className="bg-muted/30 border border-border p-6 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground text-sm">Podrás agregar imágenes una vez que crees el proyecto.</p>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-border mt-8">
              <Button type="submit" disabled={isPending} className="rounded-none min-w-[120px] gap-2">
                <Save className="w-4 h-4" />
                {isPending ? "Guardando..." : "Guardar proyecto"}
              </Button>
              <Link href="/projects">
                <Button type="button" variant="outline" className="rounded-none gap-2">
                  <X className="w-4 h-4" /> Cancelar
                </Button>
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
