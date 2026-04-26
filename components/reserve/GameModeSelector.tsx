'use client'

import { gameModes as modeCards } from '@/data/packages'
import type { GameModeId } from '@/data/packages'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { useReservationStore } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

const CLASSIC_MODES = modeCards.filter((m) => m.id !== 'free-for-all')
const FFA_MODE = modeCards.find((m) => m.id === 'free-for-all')!

function splitModeDescription(desc: string): { line1: string; line2: string | null } {
  const trimmed = desc.trim()
  const slash = trimmed.split(' / ').map((x) => x.trim())
  if (slash.length >= 2) {
    return { line1: slash[0]!, line2: slash.slice(1).join(' / ') }
  }
  const comma = trimmed.indexOf(', ')
  if (comma > 0 && comma < trimmed.length - 3) {
    return { line1: trimmed.slice(0, comma), line2: trimmed.slice(comma + 2) }
  }
  const dotSpace = trimmed.indexOf('. ')
  if (dotSpace > 0) {
    return { line1: trimmed.slice(0, dotSpace + 1), line2: trimmed.slice(dotSpace + 2) || null }
  }
  return { line1: trimmed, line2: null }
}

export function GameModeSelector() {
  const { t } = useI18n()
  const gameMode = useReservationStore((s) => s.gameMode)
  const setGameMode = useReservationStore((s) => s.setGameMode)
  const setSurpriseMode = useReservationStore((s) => s.setSurpriseMode)
  const surpriseMode = useReservationStore((s) => s.surpriseMode)
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase)

  return (
    <div
      className="w-full min-w-0 overflow-x-hidden px-4 py-10 sm:px-6"
      style={{ textAlign: 'center' }}
    >
      <h1
        className="uppercase"
        style={{
          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
          fontSize: 'clamp(40px, 6vw, 72px)',
          color: '#FFFFFF',
          letterSpacing: '0.04em',
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        {t('reserve.squad.modeTitle')}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body), Rajdhani, sans-serif',
          fontSize: '16px',
          color: '#A09AAD',
          marginTop: '10px',
          letterSpacing: '0.04em',
        }}
      >
        {t('reserve.squad.modeSub')}
      </p>

      <div className="mx-auto mt-10 grid w-full max-w-[680px] grid-cols-2 gap-4 max-[639px]:grid-cols-1">
        {CLASSIC_MODES.map((m) => {
          const active = gameMode === m.id && !surpriseMode
          const desc = t(m.descKey)
          const { line1, line2 } = splitModeDescription(desc)
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                sounds.click()
                setSurpriseMode(false)
                setGameMode(m.id)
              }}
              className={`relative text-left transition-transform hover:-translate-y-[3px] ${
                active ? '' : 'border border-white/10 hover:border-[rgba(232,0,28,0.4)]'
              }`}
              style={{
                minHeight: '140px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRadius: '12px',
                background: active ? 'rgba(232,0,28,0.08)' : 'rgba(18, 17, 22, 0.75)',
                cursor: 'pointer',
                border: active ? '1.5px solid #E8001C' : undefined,
              }}
            >
              {active ? (
                <span className="absolute right-3 top-3 text-[#E8001C]">
                  <PBIcon name="check" className="text-xl" />
                </span>
              ) : null}
              <PBIcon name={m.icon} className="text-[36px] text-[#E8001C]" />
              <div
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: '22px',
                  color: '#F2F0F5',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                }}
              >
                {t(m.nameKey)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                    fontSize: '15px',
                    color: '#A09AAD',
                    lineHeight: 1.35,
                  }}
                >
                  {line1}
                </p>
                {line2 ? (
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                      fontSize: '14px',
                      color: '#635D72',
                      lineHeight: 1.35,
                    }}
                  >
                    {line2}
                  </p>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-4 w-full max-w-[680px]">
        {(() => {
          const m = FFA_MODE
          const active = gameMode === (m.id as GameModeId) && !surpriseMode
          const desc = t(m.descKey)
          const line2 = m.subdescKey ? t(m.subdescKey) : splitModeDescription(desc).line2
          return (
            <button
              type="button"
              onClick={() => {
                sounds.click()
                setSurpriseMode(false)
                setGameMode(m.id as GameModeId)
              }}
              className="relative w-full overflow-hidden text-left transition-transform hover:-translate-y-[2px]"
              style={{
                minHeight: '148px',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '12px',
                background: active ? 'rgba(232,0,28,0.09)' : 'rgba(12, 11, 16, 0.92)',
                cursor: 'pointer',
                border: active ? '1.5px solid #E8001C' : '1px solid rgba(232,0,28,0.35)',
                boxShadow: active ? 'inset 0 0 60px rgba(232,0,28,0.06)' : undefined,
              }}
            >
              <span
                className="pointer-events-none absolute -right-6 -top-6 text-[120px] text-[rgba(232,0,28,0.07)]"
                aria-hidden
              >
                <PBIcon name="skull" className="text-[120px]" />
              </span>
              {m.isNew ? (
                <span className="absolute right-3 top-3 rounded-full bg-[#E8001C] px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-white">
                  {t('reserve.squad.modeNewBadge')}
                </span>
              ) : null}
              {active ? (
                <span className="absolute right-3 top-12 text-[#E8001C] sm:right-16 sm:top-3">
                  <PBIcon name="check" className="text-xl" />
                </span>
              ) : null}
              <div className="relative flex items-center gap-3">
                <PBIcon name={m.icon} className="text-[40px] text-[#E8001C]" />
                <div
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(22px, 4vw, 28px)',
                    color: '#F2F0F5',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                  }}
                >
                  {t(m.nameKey)}
                </div>
              </div>
              <p
                className="relative max-w-[520px] font-body text-[15px] leading-snug text-[#A09AAD]"
                style={{ margin: 0 }}
              >
                {desc}
              </p>
              {line2 ? (
                <p className="relative font-display text-[18px] uppercase tracking-[0.06em] text-[#E8001C]">
                  {line2}
                </p>
              ) : null}
            </button>
          )
        })()}
      </div>

      <button
        type="button"
        onClick={() => {
          sounds.click()
          setSurpriseMode(true)
        }}
        className="mx-auto mt-6 w-full max-w-[680px] rounded-xl border border-dashed border-white/[0.22] bg-white/[0.03] px-4 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.12em] text-[#A09AAD] transition-colors hover:border-[rgba(232,0,28,0.35)] hover:text-[#F2F0F5] sm:text-[15px]"
      >
        {t('reserve.squad.surpriseBanner')}
      </button>

      <div className="mx-auto mt-10 w-full max-w-[680px]">
        <RedButton
          disabled={!gameMode && !surpriseMode}
          onClick={() => {
            if (!gameMode && !surpriseMode) return
            sounds.confirm()
            setSquadPhase('size')
          }}
          className="w-full rounded-xl"
        >
          {t('reserve.squad.validateMode')}
        </RedButton>
      </div>
    </div>
  )
}
