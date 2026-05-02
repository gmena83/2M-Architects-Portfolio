import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxProps {
  images: string[];
  title: string;
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, title, initialIndex = 0, onClose }: LightboxProps) {
  const safeStart = images.length > 0 ? Math.min(initialIndex, images.length - 1) : 0;
  const [currentIndex, setCurrentIndex] = useState(safeStart);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `lightbox-title`;

  useEffect(() => {
    const FOCUSABLE_SELECTOR =
      'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        return;
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          dialogRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        const activeInside = !!(active && dialog && dialog.contains(active));

        if (e.shiftKey) {
          if (!activeInside || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!activeInside || active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  if (images.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-foreground/70 hover:text-foreground z-50 p-2"
        aria-label="Cerrar"
      >
        <X size={28} strokeWidth={1} className="md:hidden" />
        <X size={32} strokeWidth={1} className="hidden md:block" />
      </button>

      <button
        onClick={prevImage}
        className="hidden md:flex items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground z-50 p-4"
        aria-label="Imagen anterior"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      <button
        onClick={nextImage}
        className="hidden md:flex items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground z-50 p-4"
        aria-label="Imagen siguiente"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pt-16 pb-4 md:px-24 md:pt-20 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[currentIndex] ?? ""}
            alt={title}
            className="max-w-full max-h-full object-contain shadow-2xl"
          />
        </AnimatePresence>
      </div>

      <div className="shrink-0 px-4 md:px-12 pb-6 md:pb-8 pt-2 flex items-center gap-4 text-sm font-light text-muted-foreground">
        <button
          onClick={prevImage}
          className="md:hidden flex items-center justify-center p-2 -ml-2 text-foreground/70 hover:text-foreground"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={28} strokeWidth={1} />
        </button>
        <span id={titleId} className="font-display text-foreground truncate flex-1 text-center md:text-left">
          {title}
        </span>
        <span className="tabular-nums shrink-0">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={nextImage}
          className="md:hidden flex items-center justify-center p-2 -mr-2 text-foreground/70 hover:text-foreground"
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={28} strokeWidth={1} />
        </button>
      </div>
    </motion.div>
  );
}
