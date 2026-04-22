"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import { useCallback, useEffect, useState } from "react";
import {
  GALLERY_IMAGE_FALLBACK,
  galleryImages,
} from "@/data/galleryImages";
import { INSTAGRAM_URL } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export function GallerySection() {
  const { t } = useI18n();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % galleryImages.length,
    );
  }, []);
  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null
        ? null
        : (i - 1 + galleryImages.length) % galleryImages.length,
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, next, prev]);

  const srcAt = (i: number) =>
    broken[i] ? GALLERY_IMAGE_FALLBACK : galleryImages[i].src;

  return (
    <section
      id="gallery"
      className="section-padding bg-transparent"
      style={{ paddingTop: "clamp(60px, 10vw, 100px)", paddingBottom: "clamp(60px, 10vw, 100px)" }}
    >
      <div className="section-title-block mx-auto max-w-7xl px-4">
        <span className="font-body text-sm uppercase tracking-[0.3em] text-brand-red">
          {t("gallery_kicker")}
        </span>
        <h2 className="mt-2 font-display text-[clamp(48px,8vw,96px)] tracking-[0.12em] text-white">
          {t("gallery_title")}
        </h2>
      </div>

      <div className="gallery-grid mx-auto max-w-[1400px] px-4 md:px-[clamp(16px,5vw,80px)]">
        {galleryImages.map((img, i) => (
          <motion.div
            key={img.src}
            role="button"
            tabIndex={0}
            onClick={() => setLightboxIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setLightboxIndex(i);
              }
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.06]"
            style={{
              aspectRatio: i % 3 === 0 ? "4 / 5" : "16 / 10",
            }}
          >
            <Image
              src={srcAt(i)}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
              unoptimized={broken[i]}
              onError={() =>
                setBroken((b) => ({ ...b, [i]: true }))
              }
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[rgba(232,0,28,0)] transition-colors duration-300 group-hover:bg-[rgba(232,0,28,0.15)]"
            />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/15 px-8 py-3.5 font-body text-base text-white transition hover:border-brand-red/50 hover:bg-white/[0.04]"
        >
          📸 {t("gallery_follow")}
        </a>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/95 p-4"
            role="dialog"
            aria-modal
            onClick={close}
          >
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-brand-red/80 text-white transition hover:bg-brand-red md:right-6 md:top-6"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Fermer"
            >
              <PBIcon icon={ICONS.close} size={24} />
            </button>

            {lightboxIndex > 0 && (
              <button
                type="button"
                className="fixed bottom-6 left-6 z-[1] inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-white/10 text-white md:absolute md:bottom-auto md:left-10 md:top-1/2 md:-translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Précédent"
              >
                <PBIcon icon={ICONS.chevronLeft} size={28} />
              </button>
            )}

            {lightboxIndex < galleryImages.length - 1 && (
              <button
                type="button"
                className="fixed bottom-6 right-6 z-[1] inline-flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-white/10 text-white md:absolute md:bottom-auto md:right-10 md:top-1/2 md:-translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Suivant"
              >
                <PBIcon icon={ICONS.chevronRight} size={28} />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-h-[75vh] max-w-[95vw] md:max-h-[85vh] md:max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={srcAt(lightboxIndex)}
                alt={galleryImages[lightboxIndex].alt}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
                unoptimized={broken[lightboxIndex]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
