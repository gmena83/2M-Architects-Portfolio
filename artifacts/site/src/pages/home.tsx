import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitContact, useListProjects } from "@workspace/api-client-react";
import { ContactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type Project,
  type ProjectLocation,
  type ProjectType,
  getCoverUrl,
} from "@/lib/projects";
import { mediaGroups } from "@/data/media";

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
import { Menu, X, ExternalLink, Instagram, Linkedin } from "lucide-react";

// --- Types & static config ---

type SectionId =
  | "hero"
  | "estudio"
  | "proyectos-ubicacion"
  | "proyectos-tipo"
  | "media"
  | "contacto";

type NavLink = { id: Exclude<SectionId, "hero">; label: string };

const NAV_LINKS: readonly NavLink[] = [
  { id: "estudio", label: "Estudio" },
  { id: "proyectos-ubicacion", label: "Ubicación" },
  { id: "proyectos-tipo", label: "Tipo" },
  { id: "media", label: "Media" },
  { id: "contacto", label: "Contacto" },
] as const;

const SECTION_IDS: readonly SectionId[] = [
  "hero",
  "estudio",
  "proyectos-ubicacion",
  "proyectos-tipo",
  "media",
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
    // Defer the scroll so React commits the menu-close state first; without
    // this, the smooth-scroll on the same tick can race with the menu's
    // exit animation and leave the menu visibly stuck open.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    });
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
          className="md:hidden text-foreground p-2 -mr-2"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
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
                    "text-left text-lg font-medium py-3 border-b border-border/50 transition-colors",
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
          className="hero-fallback absolute inset-0 w-full h-full object-cover"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero.png"
          aria-hidden="true"
          tabIndex={-1}
          className="hero-video absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 text-center px-6 mt-20 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-white mb-4 md:mb-6 tracking-tighter"
        >
          2M Arquitectos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light max-w-2xl mx-auto tracking-wide"
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
    <section id="estudio" className="py-20 md:py-32 px-6 md:px-12 bg-background">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-light mb-10 md:mb-16 border-b border-border pb-6 md:pb-8">
            Estudio
          </h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/proyectos/${project.slug}`}
        aria-label={`Ver el proyecto ${project.title}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
          <img
            src={getCoverUrl(project)}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-[50%]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        </div>
        <div>
          <h4 className="text-lg font-display tracking-tight text-foreground">{project.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{project.year}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectsLocation() {
  const [filter, setFilter] = useState<LocationFilter>("all");
  const { data: projectsData, isLoading } = useListProjects({
    query: { queryKey: ["public-projects"] },
  });
  const projects = useMemo(() => projectsData ?? [], [projectsData]);

  const filteredProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.location === filter)),
    [filter, projects],
  );

  return (
    <section id="proyectos-ubicacion" className="py-16 md:py-24 px-6 md:px-12 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <h2 className="text-3xl md:text-5xl font-display font-light">
            Proyectos <span className="text-muted-foreground">· Por Ubicación</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {LOCATION_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex items-center min-h-10 px-4 text-sm font-medium rounded-full transition-colors border",
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={`skel-loc-${i}`} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-4" />
                  <div className="h-5 w-2/3 bg-muted mb-2" />
                  <div className="h-3 w-12 bg-muted" />
                </div>
              ))
            : (
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            )}
        </motion.div>

        {!isLoading && filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No hay proyectos para esta ubicación.
          </div>
        )}
      </div>

    </section>
  );
}

function ProjectsType() {
  const [filter, setFilter] = useState<TypeFilter>("all");
  const { data: projectsData, isLoading } = useListProjects({
    query: { queryKey: ["public-projects"] },
  });
  const projects = useMemo(() => projectsData ?? [], [projectsData]);

  const filteredProjects = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.type === filter)),
    [filter, projects],
  );

  return (
    <section id="proyectos-tipo" className="py-16 md:py-24 px-6 md:px-12 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <h2 className="text-3xl md:text-5xl font-display font-light">
            Proyectos <span className="text-muted-foreground">· Por Tipo</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex items-center min-h-10 px-4 text-sm font-medium rounded-full transition-colors border",
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={`skel-type-${i}`} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-4" />
                  <div className="h-5 w-2/3 bg-muted mb-2" />
                  <div className="h-3 w-12 bg-muted" />
                </div>
              ))
            : (
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <ProjectCard key={`type-${project.id}`} project={project} />
                ))}
              </AnimatePresence>
            )}
        </motion.div>

        {!isLoading && filteredProjects.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No hay proyectos para este tipo.
          </div>
        )}
      </div>

    </section>
  );
}

function MediaThumbnail({ src, alt }: { src?: string; alt: string }) {
  const baseClass =
    "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-sm overflow-hidden border border-border/60 bg-card";
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(baseClass, "object-cover")}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        baseClass,
        "flex items-center justify-center text-muted-foreground/60 font-display text-xs tracking-[0.2em]",
      )}
    >
      —
    </div>
  );
}

function Media() {
  return (
    <section id="media" className="py-20 md:py-32 px-6 md:px-12 bg-background border-t border-border">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-light mb-6 border-b border-border pb-6 md:pb-8">
            Media
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-12 md:mb-16 leading-relaxed">
            Publicaciones académicas, prensa gremial, registros oficiales y directorios profesionales que respaldan la trayectoria del estudio y de sus socios fundadores.
          </p>

          <div className="space-y-14 md:space-y-20">
            {mediaGroups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6 md:mb-8 border-b border-border/60 pb-3">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {group.items.map((item, idx) => (
                    <div key={`${group.id}-${idx}`} className="flex gap-4">
                      <MediaThumbnail src={item.thumbnail} alt={item.source} />
                      <div className="flex-1 min-w-0 flex flex-col">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group inline-flex items-start gap-2 text-foreground hover:text-muted-foreground transition-colors"
                          >
                            <h4 className="text-base md:text-lg font-display leading-snug">
                              {item.title}
                            </h4>
                            <ExternalLink
                              size={14}
                              strokeWidth={1.5}
                              className="mt-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        ) : (
                          <h4 className="text-base md:text-lg font-display leading-snug text-foreground">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-3 font-light">
                          {item.source}
                          {item.year ? ` · ${item.year}` : ""}
                        </p>
                        {item.links && item.links.length > 0 && (
                          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                            {item.links.map((link) => (
                              <li key={link.url}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="group inline-flex items-center gap-1.5 text-xs text-foreground hover:text-muted-foreground transition-colors border-b border-border/60 hover:border-muted-foreground pb-0.5"
                                >
                                  {link.label}
                                  <ExternalLink
                                    size={11}
                                    strokeWidth={1.5}
                                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                                  />
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-14 md:mt-20 text-xs text-muted-foreground font-light leading-relaxed border-t border-border pt-8">
            Repositorio compilado en mayo de 2026. Fuentes verificadas mediante búsqueda web multifuente.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
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
    <section id="contacto" className="py-20 md:py-32 px-6 md:px-12 bg-card border-t border-border">
      <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-display font-light mb-6 md:mb-8">Contacto</h2>
          <p className="text-muted-foreground mb-10 md:mb-12 max-w-sm">
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
              <p className="text-sm font-medium text-foreground mb-1">Oficina</p>
              <address className="not-italic text-muted-foreground font-light">
                Avenida Libertad 1348, oficina 502<br />
                Viña del Mar, Región de Valparaíso<br />
                Chile
              </address>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Redes</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/2marquitectos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de 2M Arquitectos"
                  className="inline-flex items-center justify-center w-10 h-10 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.linkedin.com/company/2m-arquitectos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de 2M Arquitectos"
                  className="inline-flex items-center justify-center w-10 h-10 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12 border border-border overflow-hidden">
            <iframe
              title="Mapa de la oficina de 2M Arquitectos en Viña del Mar"
              src="https://maps.google.com/maps?q=Avenida%20Libertad%201348%2C%20Vi%C3%B1a%20del%20Mar%2C%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 md:h-72 grayscale contrast-95 block"
              style={{ border: 0 }}
            />
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
                size="lg"
                className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 font-medium"
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
        <Media />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
