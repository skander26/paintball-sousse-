'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { PBIcon } from '@/components/ui/PBIcon'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useI18n } from '@/lib/i18n'

const items = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  q: `faq.q${n}` as const,
  a: `faq.a${n}` as const,
}))

export default function FAQSection() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section">
      <div className="container-pb max-w-3xl">
        <SectionTitle label={t('faq.label')} title={t('faq.title')} />
        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={it.q} className={`${isOpen ? 'border-l-[3px] border-l-[var(--red)] pl-3' : 'pl-0'}`}>
                <button
                  type="button"
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span
                    className={`font-body text-[16px] font-semibold ${
                      isOpen ? 'text-[var(--red)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {t(it.q)}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <PBIcon name="chevronDown" className="text-xl text-[var(--text-muted)]" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 font-body text-[15px] leading-relaxed text-[var(--text-secondary)]">
                        {t(it.a)}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
