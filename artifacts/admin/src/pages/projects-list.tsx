import { useState } from "react";
import { useAdminListProjects, useAdminDeleteProject, getAdminListProjectsQueryKey, getListProjectsQueryKey, Project } from "@workspace/api-client-react";
import { Header } from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { resolveImageUrl } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MapPin, Building, Edit2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const LOCATION_LABELS: Record<string, string> = {
  "quinta-region": "V Región",
  "region-metropolitana": "Región Metropolitana",
  "argentina": "Argentina"
};

const TYPE_LABELS: Record<string, string> = {
  "residencial-casa": "Residencial · Casa",
  "residencial-departamento": "Residencial · Departamento",
  "oficinas": "Oficinas"
};

export default function ProjectsListPage() {
  const { data: projects, isLoading } = useAdminListProjects();
  const deleteProject = useAdminDeleteProject();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  const filteredProjects = projects?.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (filterLocation !== "all" && p.location !== filterLocation) return false;
    return true;
  }) || [];

  const handleDelete = (id: string) => {
    deleteProject.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Proyecto eliminado", description: "El proyecto ha sido eliminado correctamente." });
        qc.invalidateQueries({ queryKey: getAdminListProjectsQueryKey() });
        qc.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error al eliminar", description: "No se pudo eliminar el proyecto.", variant: "destructive" });
      }
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display tracking-tight text-foreground">Archivo de Proyectos</h1>
            <p className="text-muted-foreground mt-1">Gestiona el catálogo de obra del estudio.</p>
          </div>
          <Link href="/projects/new">
            <Button className="rounded-none gap-2">
              <Plus className="w-4 h-4" /> Nuevo proyecto
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por título..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-none border-border focus-visible:ring-primary"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px] rounded-none">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-full md:w-[200px] rounded-none">
              <SelectValue placeholder="Ubicación" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">Todas las ubicaciones</SelectItem>
              {Object.entries(LOCATION_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <Skeleton className="h-5 w-2/3 rounded-none" />
                <Skeleton className="h-4 w-1/3 rounded-none" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Building className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display mb-2">Ningún proyecto encontrado</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No hay proyectos que coincidan con tu búsqueda, o el archivo está vacío.
            </p>
            {search || filterType !== "all" || filterLocation !== "all" ? (
              <Button variant="outline" onClick={() => { setSearch(""); setFilterType("all"); setFilterLocation("all"); }} className="rounded-none">
                Limpiar filtros
              </Button>
            ) : (
              <Link href="/projects/new">
                <Button className="rounded-none">Crear primer proyecto</Button>
              </Link>
            )}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project: Project) => (
                <motion.div key={project.id} variants={item} layout className="group relative flex flex-col bg-card border border-border transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.coverImagePath ? (
                      <img 
                        src={resolveImageUrl(project.coverImagePath)} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Building className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <Link href={`/projects/${project.id}`}>
                        <Button size="icon" variant="secondary" className="rounded-none h-10 w-10 shadow-sm" title="Editar">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive" className="rounded-none h-10 w-10 shadow-sm" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-none border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar {project.title}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará el proyecto permanentemente de la base de datos. Las imágenes asociadas no se eliminarán del storage.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)} className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Sí, eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-display font-medium text-lg leading-tight line-clamp-2">{project.title}</h3>
                      <span className="text-sm text-muted-foreground tabular-nums">{project.year}</span>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <Badge variant="outline" className="rounded-none font-normal text-xs text-muted-foreground border-border bg-muted/50">
                        {TYPE_LABELS[project.type] || project.type}
                      </Badge>
                      <Badge variant="outline" className="rounded-none font-normal text-xs text-muted-foreground border-border bg-muted/50">
                        <MapPin className="w-3 h-3 mr-1 inline" />
                        {LOCATION_LABELS[project.location] || project.location}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
