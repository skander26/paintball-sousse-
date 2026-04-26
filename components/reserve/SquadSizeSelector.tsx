'use client'

import { motion } from 'framer-motion'
import { PBIcon } from '@/components/ui/PBIcon'
import { useReservationStore } from '@/store/reservationStore'
import { getGameModeRules, isFreeForAll } from '@/lib/gameModeConfig'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

const RED = '#E8001C'
const BLUE = '#4D8EFF'
const EMPTY = '#252530'
const FFA_COLORS = [RED, '#f97316', '#eab308']

function SoldierIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden
      style={{
        width: 'clamp(14px, 3.5vw, 16px)',
        height: 'clamp(18px, 4vw, 20px)',
        display: 'block',
      }}
    >
      <polygon points="8,0 16,20 0,20" fill={color} opacity={0.9} />
    </svg>
  )
}

export function SquadSizeSelector() {
  const { t } = useI18n()
  const squadSize = useReservationStore((s) => s.squadSize)
  const gameMode = useReservationStore((s) => s.gameMode)
  const setSquadSize = useReservationStore((s) => s.setSquadSize)
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase)

  const rules = getGameModeRules(gameMode)
  const ffa = isFreeForAll(gameMode)
  const MIN = rules.minPlayers
  const MAX = rules.maxPlayers

  const redCount = Math.ceil(squadSize / 2)
  const blueCount = Math.floor(squadSize / 2)

  const dec = () => {
    if (squadSize <= MIN) return
    sounds.click()
    setSquadSize(squadSize - 1)
  }

  const inc = () => {
    if (squadSize >= MAX) return
    sounds.click()
    setSquadSize(squadSize + 1)
  }

  const lockIn = () => {
    sounds.confirm()
    setSquadPhase('character')
  }

  const sizeSub = ffa
    ? t('reserve.squad.ffaSizeSub')
        .replace('{{min}}', String(MIN))
        .replace('{{max}}', String(MAX))
    : t('reserve.squad.sizeSubTeam').replace('{{min}}', String(MIN)).replace('{{max}}', String(MAX))

  return (
    <div
      className="w-full min-w-0 max-w-full overflow-x-hidden"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 56px)',
        padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        gap: '32px',
        textAlign: 'center',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      <div>
        <h1
          className="uppercase"
          style={{
            fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
            fontSize: 'clamp(48px, 8vw, 88px)',
            color: '#F2F0F5',
            letterSpacing: '0.04em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          {ffa ? t('reserve.squad.ffaSizeTitle') : t('reserve.squad.sizeTitle')}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body), Rajdhani, sans-serif',
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: '#A09AAD',
            marginTop: '8px',
            letterSpacing: '0.05em',
          }}
        >
          {sizeSub}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 28px)',
        }}
      >
        <button
          type="button"
          onClick={dec}
          disabled={squadSize <= MIN}
          className="touch-manipulation transition-all hover:border-[rgba(232,0,28,0.5)] hover:bg-[rgba(232,0,28,0.1)] disabled:pointer-events-none"
          style={{
            width: 'clamp(44px, 10vw, 64px)',
            height: 'clamp(44px, 10vw, 64px)',
            borderRadius: '12px',
            border: '1.5px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: squadSize <= MIN ? '#3a3a4a' : '#F2F0F5',
            fontFamily: 'var(--font-body), Rajdhani, sans-serif',
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: 700,
            cursor: squadSize <= MIN ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          −
        </button>

        <motion.div
          key={squadSize}
          initial={{ scale: 0.75, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{
            fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
            fontSize: 'clamp(60px, 15vw, 120px)',
            color: RED,
            lineHeight: 1,
            minWidth: 'clamp(70px, 10vw, 110px)',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          {squadSize}
        </motion.div>

        <button
          type="button"
          onClick={inc}
          disabled={squadSize >= MAX}
          className="touch-manipulation transition-all hover:border-[rgba(232,0,28,0.5)] hover:bg-[rgba(232,0,28,0.1)] disabled:pointer-events-none"
          style={{
            width: 'clamp(44px, 10vw, 64px)',
            height: 'clamp(44px, 10vw, 64px)',
            borderRadius: '12px',
            border: '1.5px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: squadSize >= MAX ? '#3a3a4a' : '#F2F0F5',
            fontFamily: 'var(--font-body), Rajdhani, sans-serif',
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: 700,
            cursor: squadSize >= MAX ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {!ffa ? (
        <>
          <div
            style={{
              fontFamily: 'var(--font-body), Rajdhani, sans-serif',
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 600,
              color: '#A09AAD',
              letterSpacing: '0.08em',
            }}
          >
            ={' '}
            <span style={{ color: RED }}>
              {redCount} {t('reserve.squad.teamRedName')}
            </span>
            {' + '}
            <span style={{ color: BLUE }}>
              {blueCount} {t('reserve.squad.teamBlueName')}
            </span>
          </div>

          <div
            className="max-[380px]:gap-1"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '6px',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            {Array.from({ length: 20 }, (_, i) => {
              const color = i < redCount ? RED : i < squadSize ? BLUE : EMPTY
              return (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i < squadSize ? 1 : 0.3,
                    scale: i < squadSize ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                >
                  <SoldierIcon color={color} />
                </motion.div>
              )
            })}
          </div>

          <div className="grid w-full max-w-[620px] grid-cols-1 gap-[clamp(12px,2vw,20px)] min-[381px]:grid-cols-2">
            <div
              style={{
                background: 'rgba(18, 17, 22, 0.90)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `3px solid ${RED}`,
                borderRadius: '12px',
                padding: 'clamp(16px, 2.5vw, 24px)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: RED,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {t('reserve.squad.teamRedName')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  color: '#F2F0F5',
                  letterSpacing: '0.04em',
                }}
              >
                {t('reserve.squad.playersFmt').replace('{{n}}', String(redCount))}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(18, 17, 22, 0.90)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `3px solid ${BLUE}`,
                borderRadius: '12px',
                padding: 'clamp(16px, 2.5vw, 24px)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: BLUE,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {t('reserve.squad.teamBlueName')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  color: '#F2F0F5',
                  letterSpacing: '0.04em',
                }}
              >
                {t('reserve.squad.playersFmt').replace('{{n}}', String(blueCount))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="max-[380px]:gap-1"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '6px',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            {Array.from({ length: 20 }, (_, i) => {
              const color = i < squadSize ? FFA_COLORS[i % FFA_COLORS.length]! : EMPTY
              return (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i < squadSize ? 1 : 0.3,
                    scale: i < squadSize ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                >
                  <SoldierIcon color={color} />
                </motion.div>
              )
            })}
          </div>

          <div
            className="w-full max-w-[620px] rounded-xl border p-6 text-left"
            style={{
              borderColor: 'rgba(232,0,28,0.45)',
              background: 'rgba(18, 17, 22, 0.92)',
            }}
          >
            <div className="flex items-start gap-3">
              <PBIcon name="swords" className="mt-0.5 shrink-0 text-[40px] text-[#E8001C]" />
              <div>
                <div
                  className="font-display text-[clamp(22px,4vw,28px)] uppercase leading-tight tracking-[0.04em] text-white"
                >
                  {t('reserve.squad.ffaArenaTitle')}
                </div>
                <div className="mt-2 font-display text-[clamp(18px,3.5vw,22px)] uppercase tracking-[0.06em] text-[#E8001C]">
                  {t('reserve.squad.ffaArenaLine1').replace('{{n}}', String(squadSize))}
                </div>
                <div className="mt-1 font-display text-[clamp(16px,3vw,20px)] uppercase tracking-[0.08em] text-[#A09AAD]">
                  {t('reserve.squad.ffaArenaLine2')}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <motion.button
        type="button"
        onClick={lockIn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-[620px] touch-manipulation"
        style={{
          height: 'clamp(52px, 7vh, 62px)',
          background: RED,
          border: 'none',
          borderRadius: '12px',
          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
          fontSize: 'clamp(18px, 2.5vw, 22px)',
          letterSpacing: '0.12em',
          color: '#FFFFFF',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(232,0,28,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {ffa ? t('reserve.squad.enterArena') : t('reserve.squad.lockSize')}
      </motion.button>
    </div>
  )
}
