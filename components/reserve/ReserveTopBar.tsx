'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { useReservationStore, stepIndex, type ReserveStep } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'
import logo from '@/components/media/logo.png'

const widths: Record<ReserveStep, string> = {
  calendar: '25%',
  squad: '50%',
  briefing: '75%',
  success: '100%',
}

const stickyStackStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
}

const topbarRowStyle: CSSProperties = {
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  background: 'rgba(15, 14, 17, 0.97)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(232, 0, 28, 0.3)',
}

const quitBaseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'var(--font-body), Rajdhani, system-ui, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textDecoration: 'none',
  opacity: 1,
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.05)',
  transition: 'all 0.2s',
}

const stepLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-data), Orbitron, system-ui, sans-serif',
  fontSize: '13px',
  fontWeight: 700,
  color: '#E8001C',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

const progressTrackStyle: CSSProperties = {
  width: '100%',
  height: '3px',
  background: 'rgba(255,255,255,0.08)',
  position: 'relative',
}

const progressFillStyle = (width: string): CSSProperties => ({
  height: '100%',
  width,
  background: '#E8001C',
  boxShadow: '2px 0 10px rgba(232,0,28,0.8)',
  transition: 'width 0.5s ease',
})

export function ReserveTopBar() {
  const { t } = useI18n()
  const step = useReservationStore((s) => s.step)
  const previousStep = useReservationStore((s) => s.previousStep)
  const idx = stepIndex(step)
  const [quitHover, setQuitHover] = useState(false)
  const [prevHover, setPrevHover] = useState(false)
  const canGoBack = step !== 'calendar'

  const quitStyle: CSSProperties = {
    ...quitBaseStyle,
    color: quitHover ? '#E8001C' : '#F2F0F5',
    borderColor: quitHover ? 'rgba(232,0,28,0.5)' : 'rgba(255,255,255,0.12)',
  }

  const prevStyle: CSSProperties = {
    ...quitBaseStyle,
    fontSize: 'clamp(11px, 2.8vw, 14px)',
    color: !canGoBack ? '#6B6578' : prevHover ? '#E8001C' : '#F2F0F5',
    borderColor: !canGoBack
      ? 'rgba(255,255,255,0.06)'
      : prevHover
        ? 'rgba(232,0,28,0.5)'
        : 'rgba(255,255,255,0.12)',
    opacity: canGoBack ? 1 : 0.45,
    cursor: canGoBack ? 'pointer' : 'not-allowed',
  }

  return (
    <div style={stickyStackStyle}>
      <div style={topbarRowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={quitStyle}
            onMouseEnter={() => setQuitHover(true)}
            onMouseLeave={() => setQuitHover(false)}
          >
            ← {t('reserve.quit')}
          </Link>
          <button
            type="button"
            disabled={!canGoBack}
            style={prevStyle}
            onMouseEnter={() => canGoBack && setPrevHover(true)}
            onMouseLeave={() => setPrevHover(false)}
            onClick={() => {
              if (!canGoBack) return
              sounds.click()
              previousStep()
            }}
          >
            ← {t('reserve.prevStep')}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            src={logo}
            alt="Paintball Sousse"
            width={28}
            height={28}
            style={{ height: 28, width: 28, objectFit: 'contain', borderRadius: '50%' }}
          />
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: '16px',
              color: '#F2F0F5',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Paintball Sousse
          </span>
        </div>
        <div style={stepLabelStyle}>
          {t('reserve.step')} {idx}/4
        </div>
      </div>
      <div style={progressTrackStyle}>
        <div style={progressFillStyle(widths[step])} />
      </div>
    </div>
  )
}
