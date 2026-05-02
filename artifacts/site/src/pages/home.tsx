import { useState, useEffect, useMemo } from "react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitContact } from "@workspace/api-client-react";
import { SubmitContactBody } from "@workspace/api-zod";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projects, ProjectType, ProjectLocation, Project } from "@/data/projects";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

// --- Types & static config ---

type SectionId =
  | "hero"
  | "estudio"
  | "proyectos-ubicacion"
  | "proyectos-tipo"
  | "contacto";

type NavLink = { id: Exclude<SectionId, "hero">; label: string };

const NAV_LINKS: readonly NavLink[] = [
  { id: "estudio", label: "Estudio" },
  { id: "proyectos-ubicacion", label: "Ubicación" },
  { id: "proyectos-tipo", label: "Tipo" },
  { id: "contacto", label: "Contacto" },
] as const;

const SECTION_IDS: readonly SectionId[] = [
  "hero",
  "estudio",
  "proyectos-ubicacion",
  "proyectos-tipo",
  "contacto",
] as const;

type LocationFilter = ProjectLocation | "all";
type TypeFilter = ProjectType | "all";

const LOCATION_FILTERS: readonly { id: LocationFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "quinta-region", label: "Quinta Región" },
  { id: "region-metropolitana", label: "Región Metropolitana" },
  { id: "argentina", label: "Argentina" },
] as const;

const TYPE_FILTERS: readonly { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "residencial-casa", label: "Residencial Casa" },
  { id: "residencial-departamento", label: "Residencial Departamento" },
  { id: "oficinas", label: "Oficinas" },
] as const;

// --- Hooks ---

function useActiveSection(sectionIds: readonly SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(sectionIds[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<SectionId, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
          let bestId: SectionId = sectionIds[0];
          let bestRatio = -1;
          for (const candidate of sectionIds) {
            const ratio = visible.get(candidate) ?? 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = candidate;
            }
          }
          if (bestRatio > 0) {
            setActive(bestId);
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-30% 0px -50% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

// --- Components ---

function Navbar() {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 50;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  const scrollTo = (id: SectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        isScrolled ? "bg-background/90 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => scrollTo("hero")}
          className="text-xl md:text-2xl font-display font-medium tracking-tight text-foreground"
        >
          2M <span className="text-muted-foreground font-light">Arquitectos</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-6 md:hidden flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "text-left text-lg font-medium py-2 border-b border-border/50 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="/images/hero.png"
          alt="2M Arquitectos Arquitectura"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-6 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white mb-6 tracking-tighter"
        >
          2M Arquitectos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl lg:text-2xl text-white/80 font-light max-w-2xl mx-auto tracking-wide"
        >
          Forma, materia y luz en el Pacífico Sur.
        </motion.p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-[1px] h-16 bg-white/30" />
      </div>
    </section>
  );
}

function Studio() {
  return (
    <section id="estudio" className="py-32 px-6 md:px-12 bg-background">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-light mb-16 border-b border-border pb-8">
            Estudio
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <h3 className="text-xl font-display text-foreground">Carlos Mena Manía</h3>
              <p>
                Carlos Mena Manía (nacido c. 1930) es arquitecto y urbanista chileno formado en la Escuela de Arquitectura de la Pontificia Universidad Católica de Chile. Su trayectoria más documentada corresponde al ámbito del urbanismo público: fue el jefe técnico del Plan Intercomunal de Valparaíso de 1965, el tercero y último de los grandes planes intercomunales metropolitanos elaborados por el Estado chileno —junto al de Santiago (1960) y Concepción (1963)—. En ese rol, condujo un equipo de especialistas nacionales e internacionales y trabajó bajo las directrices generales del arquitecto Juan Honold desde el nivel central del Ministerio de Obras Públicas.
              </p>
              <p>
                En 1968, publicó en la Revista AUCA el artículo "Valparaíso Metropolitano", donde entregó su diagnóstico técnico de la ciudad metropolitana y de los desafíos del plan. Este texto es considerado un documento de referencia para la historia del urbanismo regional chileno.
              </p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <h3 className="text-xl font-display text-foreground">Gonzalo Mena Améstiga</h3>
              <p>
                Gonzalo Mena Améstiga es arquitecto radicado en Viña del Mar, Región de Valparaíso. Es co-fundador y socio de Asesorías 2M Arquitectos y Asociados Limitada, el estudio de arquitectura y consultoría con domicilio en Viña del Mar que lleva décadas desarrollando proyectos residenciales e inmobiliarios en las comunas de Viña del Mar, Concón y otras de la región. A lo largo de su carrera ha reunido en torno al estudio un equipo de profesionales del área de la arquitectura y construcción.
              </p>
              <p>
                En el ámbito gremial, es socio activo de la Cámara Chilena de la Construcción (CChC), sede Valparaíso. Su actividad profesional abarca desde la etapa de proyectos hasta la gestoría de permisos de edificación ante las direcciones de obras de los municipios locales, con expedientes registrados en Viña del Mar y Concón.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
        <img
          src={project.cover}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-[50%]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      </div>
      <div>
        <h4 className="text-lg font-display tracking-tight text-foreground">{project.title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{project.year}</p>
      </div>
    </motion.div>
  );
}

function Lightbox({ project, onClose }: { project: Project, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = project.gallery;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-foreground/70 hover:text-foreground z-50 p-2" aria-label="Cerrar">
        <X size={32} strokeWidth={1} />
      </button>

      <button onClick={prevImage} className="absolute left-6 text-foreground/50 hover:text-foreground z-50 p-4" aria-label="Imagen anterior">
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      <button onClick={nextImage} className="absolute right-6 text-foreground/50 hover:text-foreground z-50 p-4" aria-label="Imagen siguiente">
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      <div className="relative w-full max-w-5xl max-h-[85vh] px-20 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[currentIndex]}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl"
          />
        </AnimatePresence>

        <div className="absolute bottom-[-40px] left-20 right-20 flex justify-between items-center text-sm font-light text-muted-foreground">
          <span className="font-display text-foreground">{project.title}</span>
          <span>{currentIndex + 1} / {images.length}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsLocation() {
  const [filter, setFilter] = useState<LocationFilter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.location === filter)),
    [filter],
  );

  return (
    <section id="proyectos-ubicacion" className="py-24 px-6 md:px-12 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <h2 className="text-3xl md:text-5xl font-display font-light">
            Proyectos <span className="text-muted-foreground">· Por Ubicación</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {LOCATION_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-colors border",
                  filter === f.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No hay proyectos para esta ubicación.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectsType() {
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.type === filter)),
    [filter],
  );

  return (
    <section id="proyectos-tipo" className="py-24 px-6 md:px-12 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <h2 className="text-3xl md:text-5xl font-display font-light">
            Proyectos <span className="text-muted-foreground">· Por Tipo</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-colors border",
                  filter === f.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={`type-${project.id}`} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No hay proyectos para este tipo.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Lightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// Validation schema is reused from the generated API contract so the form,
// the network layer, and the server share a single source of truth.
type ContactFormValues = z.infer<typeof SubmitContactBody>;

function Contact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(SubmitContactBody),
    defaultValues: { nombre: "", email: "", telefono: "", mensaje: "" },
  });

  const [success, setSuccess] = useState(false);

  const contactMutation = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate({ data });
  };

  return (
    <section id="contacto" className="py-32 px-6 md:px-12 bg-card border-t border-border">
      <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-display font-light mb-8">Contacto</h2>
          <p className="text-muted-foreground mb-12 max-w-sm">
            Escríbanos para discutir su próximo proyecto. Nuestro equipo en Viña del Mar está preparado para materializar su visión.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Email</p>
              <a href="mailto:contacto@2marquitectos.cl" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                contacto@2marquitectos.cl
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">WhatsApp</p>
              <a href="https://wa.me/17874287058" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors font-light">
                +1 787 428 7058
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Sede</p>
              <p className="text-muted-foreground font-light">
                Viña del Mar,<br />
                Región de Valparaíso,<br />
                Chile
              </p>
            </div>
          </div>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Su nombre completo" className="bg-background border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="su@email.com" className="bg-background border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono <span className="text-muted-foreground font-normal">(Opcional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="+56 9 1234 5678" className="bg-background border-border" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mensaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cuéntenos sobre su proyecto..." className="min-h-[120px] bg-background border-border" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full md:w-auto px-8 bg-foreground text-background hover:bg-foreground/90 font-medium"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Enviando..." : "Enviar Mensaje"}
              </Button>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded"
                >
                  Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto a la brevedad.
                </motion.div>
              )}

              {contactMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded"
                >
                  Hubo un error al enviar su mensaje. Por favor, intente nuevamente o utilice nuestro correo.
                </motion.div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-8 px-6 border-t border-border bg-background text-center md:text-left">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-light">
        <p>2M Arquitectos · Viña del Mar, Chile</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="mailto:contacto@2marquitectos.cl" className="hover:text-foreground transition-colors">contacto@2marquitectos.cl</a>
          <span>·</span>
          <span>&copy; {year}</span>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-foreground selection:text-background">
      <Navbar />
      <main>
        <Hero />
        <Studio />
        <ProjectsLocation />
        <ProjectsType />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
