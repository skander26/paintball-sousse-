'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { gameModes as arsenalModes, tierColors, tierHex } from '@/data/packages'
import { paintballClasses, type ClassId } from '@/data/classes'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import {
  useReservationStore,
  type GameModeId,
} from '@/store/reservationStore'
import { reserveCharacterImage } from '@/lib/reserveCharacterAssets'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

function useMinWidthLg() {
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mq = window.matchMedia('(min-width: 1024px)')
    mq.addEventListener('change', onStoreChange)
    return () => mq.removeEventListener('change', onStoreChange)
  }
  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  const getServerSnapshot = () => false
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function StepSquad() {
  const { t } = useI18n()
  const squadPhase = useReservationStore((s) => s.squadPhase)
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase)
  const squadSize = useReservationStore((s) => s.squadSize)
  const setSquadSize = useReservationStore((s) => s.setSquadSize)
  const gameMode = useReservationStore((s) => s.gameMode)
  const setGameMode = useReservationStore((s) => s.setGameMode)
  const setSurpriseMode = useReservationStore((s) => s.setSurpriseMode)
  const surpriseMode = useReservationStore((s) => s.surpriseMode)
  const players = useReservationStore((s) => s.players)
  const currentPlayerIndex = useReservationStore((s) => s.currentPlayerIndex)
  const setPlayerClass = useReservationStore((s) => s.setPlayerClass)
  const setPlayerName = useReservationStore((s) => s.setPlayerName)
  const nextPlayer = useReservationStore((s) => s.nextPlayer)
  const preset = useReservationStore((s) => s.preset)

  const [classIndex, setClassIndex] = useState(0)
  const [optionIndex, setOptionIndex] = useState(0)
  const isDesktopLayout = useMinWidthLg()

  const cls = paintballClasses[classIndex]!

  useEffect(() => {
    setOptionIndex(0)
  }, [classIndex])

  useEffect(() => {
    setClassIndex(0)
    setOptionIndex(0)
  }, [currentPlayerIndex])

  useEffect(() => {
    if (squadPhase !== 'character') return
    if (currentPlayerIndex !== 0) return
    if (!preset) return
    const idx = paintballClasses.findIndex((c) => c.id === preset.tier)
    if (idx >= 0) {
      setClassIndex(idx)
      const options = paintballClasses[idx]!.options
      const oi =
        preset.balls > 0 ? options.findIndex((o) => o.balls === preset.balls) : 0
      setOptionIndex(oi >= 0 ? oi : 0)
    }
  }, [squadPhase, currentPlayerIndex, preset])

  const reds = Math.ceil(squadSize / 2)
  const blues = squadSize - reds

  const modeCards = arsenalModes

  if (squadPhase === 'size') {
    return (
      <div className="container-pb max-w-3xl py-10">
        <h2 className="text-display-sm text-[var(--text-primary)]">{t('reserve.squad.sizeTitle')}</h2>
        <p className="text-body-md mt-3 text-[var(--text-secondary)]">{t('reserve.squad.sizeSub')}</p>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-red)]"
            onClick={() => {
              sounds.click()
              setSquadSize(squadSize - 1)
            }}
          >
            −
          </button>
          <motion.div
            key={squadSize}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="font-data text-[clamp(64px,14vw,96px)] text-[var(--red)]"
          >
            {squadSize}
          </motion.div>
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-red)]"
            onClick={() => {
              sounds.click()
              setSquadSize(squadSize + 1)
            }}
          >
            +
          </button>
        </div>
        <p className="mt-6 text-center font-body text-[18px] text-[var(--text-muted)]">
          = {reds} rouges + {blues} bleus
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-l-[3px] border-[var(--red)] pb-card p-5">
            <div className="font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('reserve.squad.red')}
            </div>
            <div className="mt-2 font-display text-[22px] uppercase text-[var(--text-primary)]">{reds} joueurs</div>
          </div>
          <div className="border-l-[3px] border-[#0066FF] pb-card p-5">
            <div className="font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('reserve.squad.blue')}
            </div>
            <div className="mt-2 font-display text-[22px] uppercase text-[var(--text-primary)]">{blues} joueurs</div>
          </div>
        </div>
        <div className="mt-10">
          <RedButton
            onClick={() => {
              sounds.confirm()
              setSquadPhase('mode')
            }}
            className="w-full"
          >
            {t('reserve.squad.validateTeam')} →
          </RedButton>
        </div>
      </div>
    )
  }

  if (squadPhase === 'mode') {
    return (
      <div className="container-pb max-w-5xl py-10">
        <h2 className="text-display-sm text-[var(--text-primary)]">{t('reserve.squad.modeTitle')}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modeCards.map((m) => {
            const active = gameMode === (m.id as GameModeId)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  sounds.click()
                  setSurpriseMode(false)
                  setGameMode(m.id as GameModeId)
                }}
                className={`relative pb-card p-7 text-left transition-transform hover:-translate-y-1 ${
                  active ? 'border-[var(--border-red)] bg-[var(--red-subtle)]' : ''
                }`}
              >
                {active ? (
                  <span className="absolute right-3 top-3 text-[var(--red)]">
                    <PBIcon name="check" className="text-xl" />
                  </span>
                ) : null}
                <PBIcon name={m.icon} className="text-[48px] text-[var(--red)]" />
                <div className="mt-3 font-display text-[24px] uppercase text-[var(--text-primary)]">{t(m.nameKey)}</div>
                <p className="mt-2 font-body text-[14px] text-[var(--text-muted)]">{t(m.descKey)}</p>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="mt-6 font-body text-[14px] font-semibold text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)]"
          onClick={() => {
            sounds.click()
            setSurpriseMode(true)
          }}
        >
          🎲 {t('reserve.squad.surprise')}
        </button>
        <div className="mt-10">
          <RedButton
            disabled={!gameMode && !surpriseMode}
            onClick={() => {
              if (!gameMode && !surpriseMode) return
              sounds.confirm()
              setSquadPhase('character')
            }}
            className="w-full"
          >
            {t('reserve.squad.validateMode')} →
          </RedButton>
        </div>
      </div>
    )
  }

  const tierColor = tierColors[cls.tier]
  const tierH = tierHex[cls.tier]

  const stats = [
    { k: 'reserve.stat.power' as const, v: cls.stats.power, icon: 'firepower' as const },
    { k: 'reserve.stat.speed' as const, v: cls.stats.speed, icon: 'speed' as const },
    { k: 'reserve.stat.endurance' as const, v: cls.stats.endurance, icon: 'endurance' as const },
    { k: 'reserve.stat.accuracy' as const, v: cls.stats.accuracy, icon: 'accuracy' as const },
  ]

  const opt = cls.options[optionIndex] ?? cls.options[0]!

  const currentTeam = (players[currentPlayerIndex]?.team as 'red' | 'blue' | undefined) ?? 'red'

  /** Horizontal 3D-style carousel: active center, neighbors on X only (no vertical drift). */
  const slideMotion = (i: number) => {
    const offset = i - classIndex
    const dist = Math.abs(offset)
    const active = offset === 0

    const rankMul =
      (1 + i * 0.05) *
      (currentTeam === 'red' && paintballClasses[i]?.id === 'warrior' ? 1.25 : 1)

    const base = active
      ? isDesktopLayout
        ? 1.1
        : 1.06
      : isDesktopLayout
        ? 0.68
        : 0.64
    const scale = base * rankMul
    const opacity = active ? 1 : 0.46
    const step = isDesktopLayout ? 158 : 96
    const x = offset * step
    const zIndex = active ? 20 : 10 - dist
    const filter = active
      ? 'blur(0px) saturate(1)'
      : 'blur(12px) saturate(0.4) brightness(0.88)'

    return { x, y: 0, scale, opacity, zIndex, filter }
  }

  return (
    <div className="container-pb max-w-5xl py-10">
      <p className="text-center font-body text-[16px] text-[var(--text-muted)]">
        {t('reserve.squad.charTitle')} {currentPlayerIndex + 1} {t('reserve.squad.of')} {players.length}
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        {players.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === currentPlayerIndex ? 'bg-[var(--red)]' : 'bg-[var(--border)]'}`}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 lg:gap-x-12">
        <div className="flex w-full min-h-[480px] justify-center lg:min-h-0 lg:flex-1 lg:min-w-0">
          <div className="relative w-full max-w-xl lg:max-w-3xl">
            <div
              className={[
                'relative mx-auto h-[480px] w-full overflow-x-hidden overflow-y-visible pt-14',
                'px-11 sm:px-12',
                'lg:h-[min(640px,calc(100dvh-12rem))] lg:max-h-[calc(100dvh-12rem)] lg:px-14 lg:pt-0',
              ].join(' ')}
            >
              <button
                type="button"
                className="absolute left-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-xl text-[var(--text-primary)] shadow-sm sm:left-2 lg:left-3"
                onClick={() => {
                  sounds.click()
                  setClassIndex((v) => (v - 1 + paintballClasses.length) % paintballClasses.length)
                }}
                aria-label="Classe précédente"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-xl text-[var(--text-primary)] shadow-sm sm:right-2 lg:right-3"
                onClick={() => {
                  sounds.click()
                  setClassIndex((v) => (v + 1) % paintballClasses.length)
                }}
                aria-label="Classe suivante"
              >
                ›
              </button>

              {paintballClasses.map((c, i) => {
                const st = slideMotion(i)
                return (
                  <motion.div
                    key={c.id}
                    className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
                    initial={false}
                    animate={st}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    style={{
                      zIndex: st.zIndex,
                      pointerEvents: i === classIndex ? 'auto' : 'none',
                      transformOrigin: '50% 92%',
                    }}
                  >
                    <motion.div
                      animate={
                        i === classIndex ? { y: [0, -10, 0] } : { y: 0 }
                      }
                      transition={
                        i === classIndex
                          ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                          : { duration: 0.2 }
                      }
                      className={`relative flex w-[280px] max-w-full flex-col items-center lg:w-[400px] ${
                        i === classIndex ? 'overflow-hidden rounded-3xl' : ''
                      }`}
                      style={{
                        background: `radial-gradient(ellipse 80% 32% at 50% 100%, ${c.platformColor} 0%, transparent 72%)`,
                      }}
                    >
                      <div className="relative h-[300px] w-full lg:h-[520px]">
                        <Image
                          src={reserveCharacterImage(currentTeam, c.id)}
                          alt=""
                          fill
                          className="object-contain object-bottom"
                          sizes="(max-width: 1023px) 280px, 400px"
                          priority
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-0 w-full max-w-xl pb-card p-6 lg:mx-0 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0 lg:px-6 lg:pb-6 lg:pt-0"
          >
          <h3 className="font-display text-[36px] uppercase" style={{ color: tierColor }}>
            {t(cls.nameKey)}
          </h3>
          <p className="text-body-md mt-2 italic text-[var(--text-muted)]">{t(cls.taglineKey)}</p>
          <div className="mt-6 space-y-4">
            {stats.map((s, idx) => (
              <div key={s.k} className="flex items-center gap-3">
                <PBIcon name={s.icon} className="text-lg text-[var(--text-muted)]" />
                <div className="flex-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {t(s.k)}
                </div>
                <div className="font-data text-[13px]" style={{ color: tierColor }}>
                  {s.v}
                </div>
                <div className="h-1.5 w-[45%] max-w-[200px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tierH }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.v}%` }}
                    transition={{ delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 font-data text-[16px]" style={{ color: tierColor }}>
            <span>
              🎯 {opt.balls} balles
            </span>
            <span>·</span>
            <span>⏱ {opt.duration}</span>
            <span>·</span>
            <span>💰 {opt.price} DT</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {cls.options.map((o, i) => (
              <button
                key={`${o.balls}-${o.price}`}
                type="button"
                onClick={() => setOptionIndex(i)}
                className={`rounded-full border px-3 py-2 font-body text-[13px] font-semibold ${
                  optionIndex === i ? 'text-[var(--bg-base)]' : 'border-[var(--border)] text-[var(--text-secondary)]'
                }`}
                style={{
                  background: optionIndex === i ? tierH : 'transparent',
                  borderColor: optionIndex === i ? tierH : undefined,
                }}
              >
                {o.balls} balles · {o.price} DT
              </button>
            ))}
          </div>
          <input
            className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 font-body text-[15px] text-[var(--text-primary)] outline-none focus:border-[var(--border-red)]"
            placeholder="Pseudo (optionnel) — ex: VIPER, GHOST..."
            value={players[currentPlayerIndex]?.name ?? ''}
            onChange={(e) => setPlayerName(currentPlayerIndex, e.target.value)}
          />
          <div className="mt-6">
            <motion.button
              type="button"
              className="w-full rounded-md py-4 font-display text-[20px] uppercase tracking-[0.08em] text-[var(--bg-base)]"
              style={{ background: tierH }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sounds.select()
                setPlayerClass(currentPlayerIndex, cls.id as ClassId, optionIndex)
                nextPlayer()
              }}
            >
              {t('reserve.squad.selectClass')} ▶
            </motion.button>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
