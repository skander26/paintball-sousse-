'use client'

import { motion } from 'framer-motion'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'

const benefits = [
  'Custom programs for any team size',
  'Expert facilitators included',
  'All equipment provided',
]

const stats = [
  { n: '500+', l: 'TEAMS' },
  { n: '8', l: 'PROGRAMS' },
  { n: '50+', l: 'COMPANIES' },
  { n: '100%', l: 'CUSTOM' },
]

export default function TeamBuildingTeaser() {
  return (
    <section className="section overflow-x-hidden" aria-labelledby="teambuild-teaser-title">
      <div className="container-pb">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="mb-3 inline-block rounded-md border border-[var(--border-red)] bg-[var(--red-subtle)] px-3 py-1.5 font-body text-[12px] font-semibold tracking-[0.2em] text-[var(--red)]"
            >
              FOR COMPANIES &amp; ORGANIZATIONS
            </p>
            <h2
              id="teambuild-teaser-title"
              className="font-display text-[clamp(40px,8vw,64px)] uppercase leading-[0.95] tracking-[0.04em] text-[var(--text-primary)]"
            >
              BUILD YOUR TEAM
            </h2>
            <p
              className="mt-2 font-display text-[clamp(32px,6vw,48px)] uppercase leading-none tracking-[0.04em] text-[var(--red)]"
            >
              BEYOND THE OFFICE
            </p>
            <p className="mt-5 max-w-lg font-body text-[17px] leading-[1.7] text-[var(--text-secondary)]">
              Transform your workplace dynamics through adrenaline-powered team challenges. Strategy, communication, leadership
              — all learned through the excitement of paintball.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <PBIcon name="check" className="mt-0.5 shrink-0 text-2xl text-[#22c55e]" />
                  <span className="font-body text-[16px] text-[var(--text-primary)]">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-sm">
              <RedButton href="/team-building" className="w-full" size="lg">
                EXPLORE TEAM BUILDING →
              </RedButton>
            </div>
          </motion.div>

          <motion.div
            className="grid max-w-md grid-cols-2 gap-3 sm:ml-auto sm:max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((s) => (
              <div
                key={s.l}
                className="pb-card flex flex-col items-center justify-center gap-1 p-5 text-center"
              >
                <span className="font-data text-[40px] font-bold leading-none text-[var(--red)]">{s.n}</span>
                <span className="font-body text-[13px] font-semibold tracking-[0.2em] text-[var(--text-secondary)]">
                  {s.l}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
