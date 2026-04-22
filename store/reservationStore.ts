'use client'

import { create } from 'zustand'
import type { ClassId } from '@/data/classes'
import { paintballClasses } from '@/data/classes'
import type { ClassOption } from '@/data/classes'

export type ReserveStep = 'calendar' | 'squad' | 'briefing' | 'success'

export type SquadPhase = 'size' | 'mode' | 'character'

export type GameModeId = 'ctf' | 'deathmatch' | 'aliens' | 'ludo'

export type PlayerSlot = {
  id: string
  team: 'red' | 'blue'
  name: string
  classId: ClassId | null
  optionIndex: number
}

type Preset = { tier: ClassId; balls: number } | null

type State = {
  step: ReserveStep
  direction: 1 | -1
  squadPhase: SquadPhase
  date: string | null
  timeSlot: string | null
  squadSize: number
  gameMode: GameModeId | null
  surpriseMode: boolean
  players: PlayerSlot[]
  currentPlayerIndex: number
  preset: Preset
  setPreset: (p: Preset) => void
  setStep: (s: ReserveStep, dir?: 1 | -1) => void
  setSquadPhase: (p: SquadPhase) => void
  setDate: (d: string | null) => void
  setTimeSlot: (t: string | null) => void
  setSquadSize: (n: number) => void
  setGameMode: (m: GameModeId | null) => void
  setSurpriseMode: (v: boolean) => void
  initPlayers: () => void
  setPlayerClass: (index: number, classId: ClassId, optionIndex: number) => void
  setPlayerName: (index: number, name: string) => void
  nextPlayer: () => void
  reset: () => void
}

const stepOrder: ReserveStep[] = ['calendar', 'squad', 'briefing', 'success']

function buildPlayers(size: number): PlayerSlot[] {
  const red = Math.ceil(size / 2)
  return Array.from({ length: size }, (_, i) => ({
    id: `p-${i}`,
    team: i < red ? 'red' : 'blue',
    name: '',
    classId: null,
    optionIndex: 0,
  }))
}

const initial: Omit<
  State,
  | 'setPreset'
  | 'setStep'
  | 'setSquadPhase'
  | 'setDate'
  | 'setTimeSlot'
  | 'setSquadSize'
  | 'setGameMode'
  | 'setSurpriseMode'
  | 'initPlayers'
  | 'setPlayerClass'
  | 'setPlayerName'
  | 'nextPlayer'
  | 'reset'
> = {
  step: 'calendar',
  direction: 1,
  squadPhase: 'size',
  date: null,
  timeSlot: null,
  squadSize: 4,
  gameMode: null,
  surpriseMode: false,
  players: buildPlayers(4),
  currentPlayerIndex: 0,
  preset: null,
}

export const useReservationStore = create<State>((set, get) => ({
  ...initial,
  setPreset: (preset) => set({ preset }),
  setStep: (step, dir = 1) => set({ step, direction: dir }),
  setSquadPhase: (squadPhase) => set({ squadPhase }),
  setDate: (date) => set({ date }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setSquadSize: (n) => {
    const size = Math.min(20, Math.max(4, n))
    set({ squadSize: size, players: buildPlayers(size), currentPlayerIndex: 0 })
  },
  setGameMode: (gameMode) => set({ gameMode, surpriseMode: false }),
  setSurpriseMode: (surpriseMode) =>
    set({
      surpriseMode,
      gameMode: surpriseMode
        ? (['ctf', 'deathmatch', 'aliens', 'ludo'] as const)[
            Math.floor(Math.random() * 4)
          ]
        : get().gameMode,
    }),
  initPlayers: () => {
    const { squadSize } = get()
    set({ players: buildPlayers(squadSize), currentPlayerIndex: 0 })
  },
  setPlayerClass: (index, classId, optionIndex) => {
    const players = [...get().players]
    const p = players[index]
    if (!p) return
    players[index] = { ...p, classId, optionIndex }
    set({ players })
  },
  setPlayerName: (index, name) => {
    const players = [...get().players]
    const p = players[index]
    if (!p) return
    players[index] = { ...p, name }
    set({ players })
  },
  nextPlayer: () => {
    const { currentPlayerIndex, players } = get()
    if (currentPlayerIndex < players.length - 1) {
      set({ currentPlayerIndex: currentPlayerIndex + 1 })
    } else {
      set({ step: 'briefing', direction: 1 })
    }
  },
  reset: () => set({ ...initial, players: buildPlayers(4) }),
}))

export function stepIndex(step: ReserveStep): number {
  return stepOrder.indexOf(step) + 1
}

export function getClassOption(classId: ClassId, optionIndex: number): ClassOption | null {
  const c = paintballClasses.find((x) => x.id === classId)
  if (!c) return null
  return c.options[optionIndex] ?? c.options[0] ?? null
}
