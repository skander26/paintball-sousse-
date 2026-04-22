'use client'

import { motion } from 'framer-motion'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { RedButton } from '@/components/ui/RedButton'
import { useI18n } from '@/lib/i18n'

export default function TournamentSection() {
  const { t } = useI18n()

  return (
    <section
      id="tournament"
      className="section"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,0,28,0.08) 0%, transparent 70%)',
      }}
    >
      <div className="container-pb">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="order-2 lg:order-none">
            <p className="pb-label mb-3">{t('tournament.label')}</p>
            <h2 className="font-display uppercase leading-[0.95] text-[var(--text-primary)]" style={{ fontSize: 'clamp(40px,7vw,72px)' }}>
              {t('tournament.l1')}
            </h2>
            <motion.h3
              className="font-display uppercase text-[var(--red)]"
              style={{ fontSize: 'clamp(44px,8vw,88px)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('tournament.l2')}
            </motion.h3>
            <p className="mt-4 font-body text-[16px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              {t('tournament.sub')}
            </p>
            <div className="mt-8 inline-flex rounded-[var(--radius-md)] border border-[var(--border-red)] px-8 py-4 shadow-[0_0_20px_var(--red-glow)]">
              <div>
                <div className="text-data-md text-[var(--red)]">{t('tournament.price')}</div>
                <div className="font-body text-[13px] text-[var(--text-muted)]">{t('tournament.per')}</div>
              </div>
            </div>
            <div className="mt-8">
              <RedButton href="/reserve">{t('tournament.signup')} →</RedButton>
            </div>
          </div>
          <div className="order-1 lg:order-none">
            <CountdownTimer />
          </div>
        </div>
      </div>
    </section>
  )
}
