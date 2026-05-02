import { useState } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProjectBySlug } from "@workspace/api-client-react";
import { ArrowLeft } from "lucide-react";
import { getCoverUrl, getGalleryUrls } from "@/lib/projects";
import { locationLabel, typeLabel } from "@/lib/project-labels";
import { Lightbox } from "@/components/lightbox";

function DetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-6 md:px-12 py-24 md:py-32 animate-pulse">
      <div className="h-4 w-24 bg-muted mb-8" />
      <div className="h-10 md:h-14 w-2/3 bg-muted mb-6" />
      <div className="h-4 w-1/3 bg-muted mb-12" />
      <div className="aspect-[16/9] bg-muted mb-12" />
      <div className="space-y-3 max-w-3xl">
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-5/6 bg-muted" />
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: project, isLoading, isError, error } = useGetProjectBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !project) {
    const notFound =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status === 404
        : false;
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-display font-light mb-4">
          {notFound ? "Proyecto no encontrado" : "No fue posible cargar el proyecto"}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {notFound
            ? "El proyecto que busca no existe o ha sido removido."
            : "Por favor, intente nuevamente más tarde."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    );
  }

  const cover = getCoverUrl(project);
  const gallery = getGalleryUrls(project);
  const description = project.description?.trim() ?? "";

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-foreground selection:text-background">
      <main className="pb-20 md:pb-32">
        {cover && (
          <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-muted">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background z-10" />
            <img
              src={cover}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-6 md:pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Volver
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-10 md:pb-16">
              <div className="container mx-auto max-w-6xl">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-light text-white tracking-tight"
                >
                  {project.title}
                </motion.h1>
              </div>
            </div>
          </section>
        )}

        {!cover && (
          <div className="container mx-auto max-w-6xl px-6 md:px-12 pt-24 md:pt-32">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Volver
            </Link>
            <h1 className="text-4xl md:text-6xl font-display font-light tracking-tight">
              {project.title}
            </h1>
          </div>
        )}

        <section className="container mx-auto max-w-6xl px-6 md:px-12 pt-12 md:pt-20">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 border-b border-border pb-12 md:pb-16">
            <dl className="md:col-span-1 space-y-6 text-sm">
              <div>
                <dt className="text-muted-foreground uppercase tracking-wider text-xs mb-1">Año</dt>
                <dd className="text-foreground font-medium tabular-nums">{project.year}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground uppercase tracking-wider text-xs mb-1">Ubicación</dt>
                <dd className="text-foreground font-medium">{locationLabel(project.location)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground uppercase tracking-wider text-xs mb-1">Tipo</dt>
                <dd className="text-foreground font-medium">{typeLabel(project.type)}</dd>
              </div>
            </dl>

            <div className="md:col-span-2">
              {description ? (
                <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed font-light whitespace-pre-line">
                  {description}
                </div>
              ) : (
                <p className="text-muted-foreground italic font-light">
                  Sin descripción disponible.
                </p>
              )}
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="container mx-auto max-w-6xl px-6 md:px-12 pt-12 md:pt-20">
            <h2 className="text-2xl md:text-3xl font-display font-light mb-8 md:mb-12">
              Galería
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {gallery.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Abrir imagen ${idx + 1} de ${gallery.length}`}
                  className="group relative aspect-[4/3] overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={src}
                    alt={`${project.title} — imagen ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={gallery}
            title={project.title}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
