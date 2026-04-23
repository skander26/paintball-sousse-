'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { PHONE_DISPLAY, whatsappHref } from '@/lib/constants'
import { useI18n } from '@/lib/i18n'

export default function HeroSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const chevronOpacity = useTransform(scrollY, [0, 150], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100dvh] overflow-hidden pt-20 md:pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 75% 60%, rgba(232,0,28,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container-pb relative grid min-h-[calc(100dvh-5rem)] grid-cols-1 items-center gap-10 pb-24 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <div className="order-1 flex flex-col items-center text-center lg:order-none lg:items-start lg:text-left">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex max-w-xl flex-col items-center gap-5 lg:items-start"
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="inline-flex items-center rounded-full border border-[var(--border-red)] bg-[var(--red-subtle)] px-4 py-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]"
            >
              {t('hero.badge')}
            </motion.span>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="font-display uppercase leading-[0.9] tracking-[0.02em] text-[var(--text-primary)]"
              style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}
            >
              {t('hero.l1')}
            </motion.h1>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="font-display uppercase leading-[0.9] tracking-[0.02em]"
              style={{ fontSize: 'clamp(64px, 12vw, 140px)' }}
            >
              <motion.span
                className="text-[var(--red)]"
                animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 5.88, ease: 'easeInOut' }}
              >
                {t('hero.l2')}
              </motion.span>
            </motion.div>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="max-w-xl font-body text-[clamp(16px,2.2vw,18px)] text-[var(--text-secondary)]"
            >
              {t('hero.sub')}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="relative z-[1] mt-8 flex w-full max-w-xl flex-col items-center gap-4 sm:flex-row sm:flex-wrap lg:items-start"
          >
            <RedButton href="/reserve">
              {t('hero.cta')} →
            </RedButton>
            <Link
              href={whatsappHref(`Bonjour — ${t('hero.cta')}`)}
              className="inline-flex min-h-[48px] items-center gap-2 font-body text-[15px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <PBIcon name="whatsapp" className="text-xl text-[#25D366]" />
              <span>
                {t('hero.cta2')} {PHONE_DISPLAY}
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55, ease: 'easeOut' }}
          className="order-2 flex justify-center lg:order-none"
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full max-w-[340px] sm:max-w-lg md:max-w-xl lg:max-w-none"
            style={{ filter: 'drop-shadow(0 0 60px rgba(232,0,28,0.4))' }}
          >
            <Image
              src="/hero-character.webp"
              alt="Personnage paintball"
              width={720}
              height={900}
              className="mx-auto h-auto max-h-[min(48dvh,420px)] w-full object-contain sm:max-h-[min(52dvh,480px)] lg:max-h-[min(92vh,920px)]"
              priority
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 576px, 52vw"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: chevronOpacity }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-center md:flex"
      >
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
          {t('hero.scroll')}
        </span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <PBIcon name="chevronDown" className="text-xl text-[var(--text-muted)]" />
        </motion.span>
      </motion.div>
    </section>
  )
}
