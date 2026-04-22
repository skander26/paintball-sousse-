'use client'

import { useI18n, type Locale } from '@/lib/i18n'

const locales: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
  { id: 'ar', label: 'عر' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/60 p-1">
      {locales.map((l) => {
        const active = locale === l.id
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id)}
            className={`min-h-[44px] min-w-[44px] rounded-full px-3 font-body text-[13px] font-semibold transition-colors ${
              active
                ? 'bg-[var(--red)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
