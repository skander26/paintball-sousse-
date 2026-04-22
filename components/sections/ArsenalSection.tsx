'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  gameModes,
  packages,
  recharges,
  tierColors,
  tierHex,
  type Tier,
} from '@/data/packages'
import { RedButton } from '@/components/ui/RedButton'
import { PBIcon } from '@/components/ui/PBIcon'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { useI18n } from '@/lib/i18n'

function tierLabel(t: (k: string) => string, tier: Tier) {
  return t(`tier.${tier}`)
}

export default function ArsenalSection() {
  const { t } = useI18n()
  const router = useRouter()

  const pills = [
    { emoji: '👥', text: t('arsenal.pill.players') },
    { emoji: '🎯', text: t('arsenal.pill.age') },
    { emoji: '🛡️', text: t('arsenal.pill.safe') },
  ]

  return (
    <section id="arsenal" className="section">
      <div className="container-pb">
        <SectionTitle
          label={t('arsenal.label')}
          title={t('arsenal.title')}
          subtitle={t('arsenal.sub')}
        />
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {pills.map((p) => (
            <span
              key={p.text}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3.5 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
            >
              <span aria-hidden>{p.emoji}</span>
              {p.text}
            </span>
          ))}
        </div>

        <h3 className="mb-6 font-display text-[clamp(28px,5vw,40px)] uppercase tracking-[0.06em] text-[var(--text-primary)]">
          {t('arsenal.modesTitle')}
        </h3>
        <div className="mb-16 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {gameModes.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -3, borderColor: 'var(--border-red)' }}
              className="min-w-[240px] shrink-0 snap-start pb-card p-6 transition-colors sm:min-w-0"
            >
              <PBIcon name={m.icon} className="mb-3 text-[40px] text-[var(--red)]" />
              <h4 className="font-display text-[22px] uppercase text-[var(--text-primary)]">{t(m.nameKey)}</h4>
              <p className="mt-2 line-clamp-2 font-body text-[13px] text-[var(--text-muted)]">{t(m.descKey)}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="mb-8 font-display text-[clamp(32px,6vw,48px)] uppercase tracking-[0.06em] text-[var(--text-primary)]">
          {t('arsenal.pkgTitle')}
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg, i) => {
            const color = tierColors[pkg.tier]
            const commander = pkg.tier === 'commander'
            return (
              <motion.div
                key={pkg.balls}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`pb-card flex flex-col gap-4 p-6 ${
                  commander ? 'border-[rgba(255,215,0,0.45)] bg-[#17150A]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--bg-base)]"
                    style={{ background: color }}
                  >
                    {tierLabel(t, pkg.tier)}
                  </span>
                  {pkg.popular ? (
                    <span className="rounded-full bg-[var(--red)] px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                      {t('arsenal.popular')}
                    </span>
                  ) : (
                    <span />
                  )}
                </div>
                <div className="font-display uppercase tracking-[0.04em] text-[var(--text-primary)]" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>
                  {pkg.balls} {t('arsenal.balls').toUpperCase()}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      <span>{t('arsenal.ammo')}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(pkg.balls / 250) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      <span>{t('arsenal.duration')}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(pkg.minutes / 120) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-data-md" style={{ color }}>
                      {pkg.price}
                    </div>
                    <div className="font-body text-[12px] text-[var(--text-muted)]">{t('arsenal.perPerson')}</div>
                  </div>
                  <div className="flex items-center gap-2 font-body text-[14px] text-[var(--text-secondary)]">
                    <PBIcon name="timer" className="text-lg text-[var(--red)]" />
                    {pkg.duration}
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={() => router.push(`/reserve?package=${pkg.tier}&balls=${pkg.balls}`)}
                  className="mt-1 w-full rounded-md border bg-transparent py-3 font-body text-[14px] font-semibold"
                  style={{ borderColor: color, color }}
                  whileHover={{ backgroundColor: tierHex[pkg.tier], color: '#ffffff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('arsenal.select')} →
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        <h3 className="mb-6 mt-16 font-display text-[clamp(26px,5vw,36px)] uppercase tracking-[0.06em] text-[var(--text-primary)]">
          {t('arsenal.rechargeTitle')}
        </h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {recharges.map((r) => (
            <div key={r.balls} className="pb-card p-5 text-center">
              <div className="text-data-md" style={{ color: r.color }}>
                +{r.balls}
              </div>
              <div className="mt-2 font-body text-[13px] text-[var(--text-muted)]">DT</div>
              <div className="font-data text-[20px]" style={{ color: r.color }}>
                {r.price}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-body text-[13px] italic text-[var(--text-muted)]">
          {t('arsenal.rechargeNote')}
        </p>

        <div
          className="mt-20 border-y border-[var(--border-red)] px-6 py-[clamp(60px,8vw,100px)] text-center"
          style={{
            background:
              'linear-gradient(135deg, var(--bg-surface) 0%, rgba(26,0,5,0.8) 50%, var(--bg-surface) 100%)',
          }}
        >
          <h3 className="font-display uppercase leading-tight text-[var(--text-primary)]" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
            {t('arsenal.ctaTitle')}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl font-body text-[18px] text-[var(--text-secondary)]">{t('arsenal.ctaSub')}</p>
          <div className="mt-8 flex justify-center">
            <RedButton href="/reserve" size="lg">
              🎯 {t('arsenal.ctaBtn')} →
            </RedButton>
          </div>
          <p className="mt-6 font-body text-[14px] text-[var(--text-muted)]">
            {t('arsenal.ctaPhone')} +216 46 209 091
          </p>
        </div>
      </div>
    </section>
  )
}
