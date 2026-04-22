'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { dictionaries, type Locale } from './i18n-messages'

const STORAGE = 'pbs-locale'

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function pick(dict: Record<string, string> | undefined, key: string) {
  return dict?.[key]
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE) as Locale | null
    if (stored && (stored === 'en' || stored === 'fr' || stored === 'ar')) {
      setLocaleState(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = locale === 'ar' ? 'ar' : locale === 'en' ? 'en' : 'fr'
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE, l)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string) => {
      const cur = pick(dictionaries[locale], key)
      if (cur) return cur
      const en = pick(dictionaries.en, key)
      if (en) return en
      return key
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export type { Locale }
