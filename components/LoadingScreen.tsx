'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const DURATION_MS = 2200
const BURST_MS = 0.62

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const [progress, setProgress] = useState(0)
  const [burst, setBurst] = useState(false)
  const rafRef = useRef(0)
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (burst) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        completeTimerRef.current = setTimeout(() => setBurst(true), 200)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    }
  }, [burst])

  const skip = () => {
    cancelAnimationFrame(rafRef.current)
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    setProgress(1)
    setBurst(true)
  }

  const pct = progress * 100
  const crossStroke = `hsl(0, ${pct}%, 50%)`

  return (
    <div className="fixed inset-0 z-[100]">
      {!burst ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0F0E11] px-6">
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
                stroke={crossStroke}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="6" fill={crossStroke} />
            </svg>
          </motion.div>

          <div
            style={{
              position: 'relative',
              width: 'clamp(280px, 40vw, 480px)',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/loading-gun.webp"
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                filter: 'grayscale(100%) brightness(0.7)',
                position: 'absolute',
                top: 0,
                left: 0,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
            <img
              src="/loading-gun.webp"
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                position: 'relative',
                clipPath: `inset(0 ${100 - pct}% 0 0)`,
                transition: 'clip-path 0.1s linear',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
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
        </div>
      ) : (
        <motion.div
          className="flex h-full w-full items-center justify-center bg-[#0F0E11]"
          initial={{ opacity: 1 }}
          aria-hidden
        >
          <motion.div
            className="rounded-full bg-[#E8001C] shadow-[0_0_80px_rgba(232,0,28,0.55)]"
            style={{
              width: 'min(280vmax, 400vw)',
              height: 'min(280vmax, 400vw)',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: BURST_MS, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => onDone()}
          />
        </motion.div>
      )}
    </div>
  )
}
