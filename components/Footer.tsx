'use client'

import Link from 'next/link'
import { PBIcon } from '@/components/ui/PBIcon'
import {
  ADDRESS_LINES,
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  whatsappHref,
} from '@/lib/constants'
import { useI18n } from '@/lib/i18n'

const quick = ['/#top', '/#experiences', '/#arsenal', '/#tournament', '/#gallery', '/#contact'] as const
const quickKeys = ['nav.home', 'nav.exp', 'nav.arsenal', 'nav.tournament', 'nav.gallery', 'nav.contact'] as const

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-14">
      <div className="container-pb grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-[20px] uppercase tracking-[0.08em] text-[var(--text-primary)]">
            Paintball Sousse
          </div>
          <p className="mt-3 max-w-xs font-body text-[14px] italic text-[var(--text-muted)]">{t('footer.tagline')}</p>
          <div className="mt-5 flex gap-3">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-red)] hover:text-[var(--red)]"
              aria-label="Instagram"
            >
              <PBIcon name="instagram" className="text-xl" />
            </Link>
            <Link
              href={FACEBOOK_URL}
              target="_blank"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-red)] hover:text-[var(--red)]"
              aria-label="Facebook"
            >
              <PBIcon name="facebook" className="text-xl" />
            </Link>
            <Link
              href={whatsappHref('Bonjour Paintball Sousse')}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-red)] hover:text-[var(--red)]"
              aria-label="WhatsApp"
            >
              <PBIcon name="whatsapp" className="text-xl" />
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-[18px] uppercase text-[var(--text-primary)]">{t('footer.links')}</h4>
          <ul className="mt-4 space-y-2">
            {quick.map((href, i) => (
              <li key={href}>
                <Link href={href} className="font-body text-[14px] text-[var(--text-muted)] hover:text-[var(--red)]">
                  {t(quickKeys[i]!)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-[18px] uppercase text-[var(--text-primary)]">{t('footer.services')}</h4>
          <ul className="mt-4 space-y-2">
            {(['footer.s1', 'footer.s2', 'footer.s3', 'footer.s4', 'footer.s5'] as const).map((k) => (
              <li key={k}>
                <span className="font-body text-[14px] text-[var(--text-muted)]">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-[18px] uppercase text-[var(--text-primary)]">{t('footer.contact')}</h4>
          <p className="mt-4 font-body text-[14px] leading-relaxed text-[var(--text-muted)]">
            {ADDRESS_LINES.join(', ')}
          </p>
          <p className="mt-2 font-body text-[14px] text-[var(--text-muted)]">{PHONE_DISPLAY}</p>
          <p className="mt-2 font-body text-[14px] text-[var(--text-muted)]">{EMAIL}</p>
        </div>
      </div>
      <div className="container-pb mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-6 text-[var(--text-muted)] sm:flex-row sm:items-center">
        <p className="font-body text-[13px]">
          © {year} Paintball Sousse. {t('footer.rights')}
        </p>
        <p className="font-body text-[13px]">
          {t('footer.made')} ❤️ {t('footer.made2')}
        </p>
      </div>
    </footer>
  )
}
