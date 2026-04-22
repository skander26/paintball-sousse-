'use client'

import { useEffect } from 'react'
import { I18nProvider } from '@/lib/i18n'
import { unlockSounds } from '@/lib/sounds'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const onFirst = () => {
      void unlockSounds()
      window.removeEventListener('pointerdown', onFirst)
    }
    window.addEventListener('pointerdown', onFirst, { passive: true })
    return () => window.removeEventListener('pointerdown', onFirst)
  }, [])

  return <I18nProvider>{children}</I18nProvider>
}
