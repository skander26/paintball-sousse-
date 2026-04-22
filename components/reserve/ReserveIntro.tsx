'use client'

import { motion } from 'framer-motion'
import { RedButton } from '@/components/ui/RedButton'
import { useI18n } from '@/lib/i18n'

export function ReserveIntro({ onStart }: { onStart: () => void }) {
  const { t } = useI18n()

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-xl"
      >
        <p className="pb-label mb-3">{t('reserve.step')} 0/4</p>
        <h1 className="text-display-md text-[var(--text-primary)]">{t('reserve.intro.title')}</h1>
        <p className="text-body-md mt-4 text-[var(--text-secondary)]">{t('reserve.intro.sub')}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mt-10"
      >
        <RedButton onClick={onStart}>{t('reserve.intro.start')} →</RedButton>
      </motion.div>
    </div>
  )
}
