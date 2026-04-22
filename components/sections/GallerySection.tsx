'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { galleryImages } from '@/data/gallery'
import { PBIcon } from '@/components/ui/PBIcon'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { INSTAGRAM_URL } from '@/lib/constants'
import { useI18n } from '@/lib/i18n'

export default function GallerySection() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(null)

  const idx = open ? galleryImages.findIndex((g) => g.id === open) : 0

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => {
    setOpen((cur) => {
      if (!cur) return cur
      const i = galleryImages.findIndex((g) => g.id === cur)
      const ni = (i - 1 + galleryImages.length) % galleryImages.length
      return galleryImages[ni]!.id
    })
  }, [])
  const next = useCallback(() => {
    setOpen((cur) => {
      if (!cur) return cur
      const i = galleryImages.findIndex((g) => g.id === cur)
      const ni = (i + 1) % galleryImages.length
      return galleryImages[ni]!.id
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, prev, next])

  const current = galleryImages[idx]

  return (
    <section id="gallery" className="section">
      <div className="container-pb">
        <SectionTitle label={t('gallery.label')} title={t('gallery.title')} />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:gap-4">
          {galleryImages.map((img, i) => (
            <motion.button
              type="button"
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setOpen(img.id)}
              className="group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] text-left"
              style={{ aspectRatio: img.portrait ? '4 / 5' : '16 / 10' }}
            >
              <Image
                src={img.src}
                alt={`${t('gallery.title')} ${img.id}`}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 33vw"
              />
              <motion.div
                className="absolute inset-0 bg-[rgba(232,0,28,0.1)]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </motion.button>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-6 font-body text-[14px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
          >
            📸 {t('gallery.insta')}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && current ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
              onClick={(e) => {
                e.stopPropagation()
                close()
              }}
              aria-label="Fermer"
            >
              <PBIcon name="close" className="text-xl" />
            </button>
            <button
              type="button"
              className="absolute bottom-6 left-1/2 flex h-12 w-12 -translate-x-[120%] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] md:left-8 md:top-1/2 md:bottom-auto md:translate-x-0 md:-translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Précédent"
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute bottom-6 left-1/2 flex h-12 w-12 translate-x-[20%] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] md:right-8 md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Suivant"
            >
              ›
            </button>
            <motion.div
              className="relative max-h-[85vh] w-full max-w-[90vw]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[min(85vh,80vw)] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
                <Image
                  src={current.src}
                  alt={t('gallery.title')}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
