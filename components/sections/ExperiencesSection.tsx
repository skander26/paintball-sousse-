'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { experiences } from '@/data/experiences'
import { PBIcon } from '@/components/ui/PBIcon'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useI18n } from '@/lib/i18n'

export default function ExperiencesSection() {
  const { t } = useI18n()

  return (
    <section id="experiences" className="section">
      <div className="container-pb">
        <SectionTitle
          label={t('exp.label')}
          title={t('exp.title')}
          subtitle={t('exp.sub')}
        />
        <div
          className="grid gap-[var(--gap-md)]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
          }}
        >
          {experiences.map((e, i) => (
            <motion.article
              key={e.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="pb-card flex flex-col gap-4 p-7"
            >
              <PBIcon name={e.icon} className="text-[48px] text-[var(--red)]" />
              <h3 className="font-display text-[26px] uppercase tracking-[0.06em] text-[var(--text-primary)]">
                {t(e.titleKey)}
              </h3>
              <p className="flex-1 font-body text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {t(e.descKey)}
              </p>
              <Link href="/reserve" className="font-body text-[13px] font-semibold text-[var(--red)]">
                {t('exp.more')} →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
