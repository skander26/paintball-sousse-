'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  ADDRESS_LINES,
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  whatsappHref,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n'

const Map = dynamic(() => import('@/components/ContactMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] md:h-[400px]">
      …
    </div>
  ),
})

export default function ContactSection() {
  const { t } = useI18n()

  return (
    <section id="contact" className="section">
      <div className="container-pb">
        <SectionTitle label={t('contact.label')} title={t('contact.title')} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.45fr_0.55fr]">
          <div>
            <div className="flex gap-3">
              <PBIcon name="location" className="mt-1 shrink-0 text-2xl text-[var(--red)]" />
              <p className="font-body text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {ADDRESS_LINES.join(', ')}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PBIcon name="phone" className="text-2xl text-[var(--red)]" />
              <span className="font-body text-[15px] text-[var(--text-primary)]">{PHONE_DISPLAY}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 font-body text-[13px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--border-red)]"
              >
                {t('contact.call')}
              </a>
              <a
                href={whatsappHref('Bonjour Paintball Sousse')}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 font-body text-[13px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--border-red)]"
              >
                {t('contact.whatsapp')}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <PBIcon name="email" className="text-2xl text-[var(--red)]" />
              <a href={`mailto:${EMAIL}`} className="font-body text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {EMAIL}
              </a>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <PBIcon name="instagram" className="text-2xl text-[var(--red)]" />
              <Link href={INSTAGRAM_URL} className="font-body text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                {INSTAGRAM_HANDLE}
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <PBIcon name="facebook" className="text-2xl text-[var(--red)]" />
              <Link href={FACEBOOK_URL} className="font-body text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                Paintball Sousse
              </Link>
            </div>

            <div className="pb-card-red mt-8 p-6">
              <h3 className="font-display text-[clamp(22px,4vw,28px)] uppercase text-[var(--text-primary)]">
                🎯 {t('contact.reserveTitle')}
              </h3>
              <p className="mt-2 font-body text-[15px] text-[var(--text-muted)]">{t('contact.reserveSub')}</p>
              <div className="mt-5">
                <RedButton href="/reserve" className="w-full">
                  {t('contact.reserveCta')} →
                </RedButton>
              </div>
            </div>
          </div>
          <div className="h-[280px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] md:h-[400px]">
            <Map />
          </div>
        </div>
      </div>
    </section>
  )
}
