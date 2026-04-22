'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const DURATION_MS = 2200

const GUN_PATH =
  'M40 120 L40 95 Q40 80 55 75 L120 68 L125 40 Q128 22 150 20 L280 18 Q310 18 330 35 L345 55 L350 85 L360 88 Q372 92 372 105 L372 118 Q372 132 358 138 L330 142 L310 165 Q300 182 280 182 L210 188 Q190 190 175 178 L160 155 L140 150 L95 155 Q70 158 55 145 L40 130 Z'

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS)
      setProgress(p)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setVisible(false), 200)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!visible) {
      const tmr = setTimeout(onDone, 400)
      return () => clearTimeout(tmr)
    }
  }, [visible, onDone])

  const skip = () => {
    setProgress(1)
    setVisible(false)
  }

  const w = 400 * progress

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F0E11] px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          >
            <svg width="60" height="60" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <path
                d="M32 8 L32 56 M8 32 L56 32"
                stroke="#E8001C"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="6" fill="#E8001C" />
            </svg>
          </motion.div>

          <div className="relative w-full max-w-md">
            <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden>
              <defs>
                <clipPath id="gunClip" clipPathUnits="userSpaceOnUse">
                  <path d={GUN_PATH} />
                </clipPath>
              </defs>
              <path d={GUN_PATH} fill="rgba(255,255,255,0.06)" stroke="var(--border)" strokeWidth="2" />
              <g clipPath="url(#gunClip)">
                <rect x="0" y="0" width={w} height="220" fill="#E8001C" />
              </g>
              <path d={GUN_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
              {progress >= 1 ? (
                <motion.circle
                  cx="360"
                  cy="105"
                  r="6"
                  fill="#E8001C"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                />
              ) : null}
            </svg>
          </div>

          <p className="mt-6 font-data text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--red)]">
            {t('loading.text')}
          </p>
          <p className="mt-2 font-display text-[clamp(26px,6vw,32px)] uppercase tracking-[0.08em] text-[var(--text-primary)]">
            {t('loading.brand')}
          </p>

          <button
            type="button"
            onClick={skip}
            className="absolute bottom-8 right-8 min-h-[44px] font-body text-[12px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            {t('loading.skip')} →
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
