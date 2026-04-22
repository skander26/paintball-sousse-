'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const people = [
  { initials: 'MK', color: '#E8001C', name: 'Mehdi K.', quoteKey: 'testimonials.quote1' as const },
  { initials: 'SB', color: '#22C55E', name: 'Sarra B.', quoteKey: 'testimonials.quote2' as const },
  { initials: 'YL', color: '#F97316', name: 'Youssef L.', quoteKey: 'testimonials.quote3' as const },
]

function Stars() {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#E8001C">
          <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 5 2-7L5 9h7z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const { t } = useI18n()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      if (window.matchMedia('(max-width: 1023px)').matches) return
      setActive((a) => (a + 1) % people.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const w = el.clientWidth
    el.scrollTo({ left: active * w, behavior: 'smooth' })
  }, [active])

  return (
    <section className="section">
      <div className="container-pb">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {people.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="min-w-[85%] shrink-0 snap-center pb-card p-8 sm:min-w-[70%] lg:min-w-0"
            >
              <Stars />
              <p className="mt-4 font-body text-[17px] italic leading-relaxed text-[var(--text-secondary)]">
                “{t(p.quoteKey)}”
              </p>
              <div className="my-6 h-px w-full bg-[var(--border)]" />
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full font-body text-[14px] font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="font-body text-[16px] font-bold text-[var(--text-primary)]">{p.name}</div>
                  <div className="font-body text-[13px] text-[var(--text-muted)]">{t('testimonials.role')}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2 lg:hidden">
          {people.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`h-2.5 w-2.5 rounded-full ${active === i ? 'bg-[var(--red)]' : 'bg-[var(--border)]'}`}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
