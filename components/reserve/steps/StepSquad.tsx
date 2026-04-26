'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tierColors, tierHex } from '@/data/packages'
import { paintballClasses, type ClassId } from '@/data/classes'
import { CharacterCarousel } from '@/components/reserve/CharacterCarousel'
import { ClassStatsPanel } from '@/components/reserve/ClassStatsPanel'
import { GameModeSelector } from '@/components/reserve/GameModeSelector'
import { SquadSizeSelector } from '@/components/reserve/SquadSizeSelector'
import { StepCharacterLoadout } from '@/components/reserve/StepCharacterLoadout'
import { useReservationStore } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'
import { isFreeForAll } from '@/lib/gameModeConfig'

export function StepSquad() {
  const { t } = useI18n()
  const squadPhase = useReservationStore((s) => s.squadPhase)
  const players = useReservationStore((s) => s.players)
  const currentPlayerIndex = useReservationStore((s) => s.currentPlayerIndex)
  const setPlayerClass = useReservationStore((s) => s.setPlayerClass)
  const setPlayerName = useReservationStore((s) => s.setPlayerName)
  const nextPlayer = useReservationStore((s) => s.nextPlayer)
  const preset = useReservationStore((s) => s.preset)
  const gameMode = useReservationStore((s) => s.gameMode)
  const customizePerPlayer = useReservationStore((s) => s.customizePerPlayer)
  const backToDefaultLoadout = useReservationStore((s) => s.backToDefaultLoadout)
  const redTeamDefaultClass = useReservationStore((s) => s.redTeamDefaultClass)
  const blueTeamDefaultClass = useReservationStore((s) => s.blueTeamDefaultClass)
  const soloDefaultClass = useReservationStore((s) => s.soloDefaultClass)

  const [classIndex, setClassIndex] = useState(0)
  const [optionIndex, setOptionIndex] = useState(0)

  const ffa = isFreeForAll(gameMode)

  useEffect(() => {
    setOptionIndex(0)
  }, [classIndex])

  useEffect(() => {
    setClassIndex(0)
    setOptionIndex(0)
  }, [currentPlayerIndex])

  useEffect(() => {
    if (squadPhase !== 'character' || !customizePerPlayer) return
    const p = players[currentPlayerIndex]
    if (!p) return
    const fallback =
      ffa ? soloDefaultClass : p.team === 'blue' ? blueTeamDefaultClass : redTeamDefaultClass
    const cid = p.classId ?? fallback
    const idx = paintballClasses.findIndex((c) => c.id === cid)
    if (idx >= 0) setClassIndex(idx)
    setOptionIndex(p.optionIndex ?? 0)
  }, [
    squadPhase,
    customizePerPlayer,
    currentPlayerIndex,
    players,
    ffa,
    soloDefaultClass,
    blueTeamDefaultClass,
    redTeamDefaultClass,
  ])

  useEffect(() => {
    if (squadPhase !== 'character' || customizePerPlayer) return
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
  }, [squadPhase, customizePerPlayer, currentPlayerIndex, preset])

  if (squadPhase === 'mode') {
    return <GameModeSelector />
  }

  if (squadPhase === 'size') {
    return <SquadSizeSelector />
  }

  if (!customizePerPlayer) {
    return <StepCharacterLoadout />
  }

  const cls = paintballClasses[classIndex]!

  const tierColor = tierColors[cls.tier]
  const tierH = tierHex[cls.tier]

  const stats = [
    { k: 'reserve.stat.power' as const, v: cls.stats.power, icon: 'firepower' as const },
    { k: 'reserve.stat.speed' as const, v: cls.stats.speed, icon: 'speed' as const },
    { k: 'reserve.stat.endurance' as const, v: cls.stats.endurance, icon: 'endurance' as const },
    { k: 'reserve.stat.accuracy' as const, v: cls.stats.accuracy, icon: 'accuracy' as const },
  ]

  const p = players[currentPlayerIndex]
  const currentTeam =
    p?.team === 'blue' ? 'blue' : p?.team === 'red' ? 'red' : ('red' as const)

  const headerLine = ffa
    ? `${t('reserve.squad.charTitle')} ${currentPlayerIndex + 1} ${t('reserve.squad.of')} ${players.length}`
    : `${t('reserve.squad.charTitle')} ${currentPlayerIndex + 1} ${t('reserve.squad.of')} ${players.length} — ${
        p?.team === 'blue'
          ? t('reserve.squad.blue')
          : p?.team === 'red'
            ? t('reserve.squad.red')
            : ''
      }`

  return (
    <div className="container-pb flex max-w-5xl min-h-0 w-full min-w-0 flex-1 flex-col justify-center overflow-x-visible overflow-y-visible px-3 py-2 sm:px-4 lg:px-6">
      <div className="shrink-0 text-center">
        <button
          type="button"
          className="mb-2 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] underline-offset-4 hover:text-[var(--red)] hover:underline"
          onClick={() => backToDefaultLoadout()}
        >
          ← {t('reserve.loadout.backDefault')}
        </button>
        <p className="font-body text-[15px] text-[var(--text-muted)] lg:text-[14px]">{headerLine}</p>
        <div className="mt-2 flex items-center justify-center gap-2.5">
          {players.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === currentPlayerIndex ? 'bg-[var(--red)]' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-5 overflow-x-visible overflow-y-visible sm:gap-6 lg:mt-2 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:gap-x-10">
        <div className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-visible max-lg:mb-3 lg:min-w-0">
          <CharacterCarousel
            classIndex={classIndex}
            setClassIndex={setClassIndex}
            currentTeam={currentTeam}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="relative z-30 min-h-0 w-full min-w-0 shrink-0 lg:w-auto"
          >
            <ClassStatsPanel
              cls={cls}
              tierColor={tierColor}
              tierH={tierH}
              stats={stats}
              optionIndex={optionIndex}
              setOptionIndex={setOptionIndex}
              callsignValue={players[currentPlayerIndex]?.name ?? ''}
              onCallsignChange={(value) => setPlayerName(currentPlayerIndex, value)}
              onSelectClass={() => {
                setPlayerClass(currentPlayerIndex, cls.id as ClassId, optionIndex)
                nextPlayer()
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
