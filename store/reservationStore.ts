'use client'

import { create } from 'zustand'
import type { ClassId } from '@/data/classes'
import { paintballClasses } from '@/data/classes'
import type { ClassOption } from '@/data/classes'
import type { GameModeId } from '@/data/packages'
import { getGameModeRules, isFreeForAll } from '@/lib/gameModeConfig'

export type { GameModeId }

export type ReserveStep = 'calendar' | 'squad' | 'briefing' | 'success'

export type SquadPhase = 'mode' | 'size' | 'character'

export type PlayerTeam = 'red' | 'blue' | 'solo'

export type PlayerSlot = {
  id: string
  team: PlayerTeam
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
  customizePerPlayer: boolean
  redTeamDefaultClass: ClassId
  blueTeamDefaultClass: ClassId
  soloDefaultClass: ClassId
  setPreset: (p: Preset) => void
  setStep: (s: ReserveStep, dir?: 1 | -1) => void
  previousStep: () => void
  setSquadPhase: (p: SquadPhase) => void
  setDate: (d: string | null) => void
  setTimeSlot: (t: string | null) => void
  setSquadSize: (n: number) => void
  setGameMode: (m: GameModeId | null) => void
  setSurpriseMode: (v: boolean) => void
  setRedTeamDefaultClass: (c: ClassId) => void
  setBlueTeamDefaultClass: (c: ClassId) => void
  setSoloDefaultClass: (c: ClassId) => void
  setCustomizePerPlayer: (v: boolean) => void
  enterCustomizePerPlayer: () => void
  backToDefaultLoadout: () => void
  confirmTeamLoadout: () => void
  initPlayers: () => void
  setPlayerClass: (index: number, classId: ClassId, optionIndex: number) => void
  setPlayerName: (index: number, name: string) => void
  nextPlayer: () => void
  reset: () => void
}

const stepOrder: ReserveStep[] = ['calendar', 'squad', 'briefing', 'success']

function buildPlayers(size: number, isFfa: boolean): PlayerSlot[] {
  if (isFfa) {
    return Array.from({ length: size }, (_, i) => ({
      id: `p-${i}`,
      team: 'solo' as const,
      name: '',
      classId: null,
      optionIndex: 0,
    }))
  }
  const red = Math.ceil(size / 2)
  return Array.from({ length: size }, (_, i) => ({
    id: `p-${i}`,
    team: (i < red ? 'red' : 'blue') as PlayerTeam,
    name: '',
    classId: null,
    optionIndex: 0,
  }))
}

const initial: Omit<
  State,
  | 'setPreset'
  | 'setStep'
  | 'previousStep'
  | 'setSquadPhase'
  | 'setDate'
  | 'setTimeSlot'
  | 'setSquadSize'
  | 'setGameMode'
  | 'setSurpriseMode'
  | 'setRedTeamDefaultClass'
  | 'setBlueTeamDefaultClass'
  | 'setSoloDefaultClass'
  | 'setCustomizePerPlayer'
  | 'enterCustomizePerPlayer'
  | 'backToDefaultLoadout'
  | 'confirmTeamLoadout'
  | 'initPlayers'
  | 'setPlayerClass'
  | 'setPlayerName'
  | 'nextPlayer'
  | 'reset'
> = {
  step: 'calendar',
  direction: 1,
  squadPhase: 'mode',
  date: null,
  timeSlot: null,
  squadSize: 6,
  gameMode: null,
  surpriseMode: false,
  players: buildPlayers(6, false),
  currentPlayerIndex: 0,
  preset: null,
  customizePerPlayer: false,
  redTeamDefaultClass: 'warrior',
  blueTeamDefaultClass: 'warrior',
  soloDefaultClass: 'warrior',
}

const allModeIds: GameModeId[] = ['ctf', 'deathmatch', 'aliens', 'ludo', 'free-for-all']

export const useReservationStore = create<State>((set, get) => ({
  ...initial,
  setPreset: (preset) => set({ preset }),
  setStep: (step, dir = 1) => set({ step, direction: dir }),
  previousStep: () => {
    const { step, squadPhase } = get()
    if (step === 'calendar') return

    if (step === 'squad') {
      if (squadPhase === 'character') {
        set({ squadPhase: 'size', customizePerPlayer: false, currentPlayerIndex: 0, direction: -1 })
        return
      }
      if (squadPhase === 'size') {
        set({ squadPhase: 'mode', direction: -1 })
        return
      }
      set({ step: 'calendar', direction: -1 })
      return
    }

    if (step === 'briefing') {
      set({
        step: 'squad',
        direction: -1,
        currentPlayerIndex: 0,
        squadPhase: 'character',
        customizePerPlayer: false,
      })
      return
    }

    if (step === 'success') {
      set({ step: 'briefing', direction: -1 })
    }
  },
  setSquadPhase: (squadPhase) => set({ squadPhase }),
  setDate: (date) => set({ date }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setSquadSize: (n) => {
    const rules = getGameModeRules(get().gameMode)
    const size = Math.min(rules.maxPlayers, Math.max(rules.minPlayers, n))
    const isFfa = !rules.teamBased
    set({ squadSize: size, players: buildPlayers(size, isFfa), currentPlayerIndex: 0 })
  },
  setGameMode: (gameMode) => {
    const rules = getGameModeRules(gameMode)
    let { squadSize } = get()
    squadSize = Math.min(rules.maxPlayers, Math.max(rules.minPlayers, squadSize))
    const isFfa = !rules.teamBased
    set({
      gameMode,
      surpriseMode: false,
      squadSize,
      players: buildPlayers(squadSize, isFfa),
      currentPlayerIndex: 0,
    })
  },
  setSurpriseMode: (surpriseMode) => {
    if (surpriseMode) {
      const pick = allModeIds[Math.floor(Math.random() * allModeIds.length)]!
      const rules = getGameModeRules(pick)
      let { squadSize } = get()
      squadSize = Math.min(rules.maxPlayers, Math.max(rules.minPlayers, squadSize))
      const isFfa = !rules.teamBased
      set({
        surpriseMode: true,
        gameMode: pick,
        squadSize,
        players: buildPlayers(squadSize, isFfa),
        currentPlayerIndex: 0,
      })
    } else {
      set({ surpriseMode: false })
    }
  },
  setRedTeamDefaultClass: (redTeamDefaultClass) => set({ redTeamDefaultClass }),
  setBlueTeamDefaultClass: (blueTeamDefaultClass) => set({ blueTeamDefaultClass }),
  setSoloDefaultClass: (soloDefaultClass) => set({ soloDefaultClass }),
  setCustomizePerPlayer: (customizePerPlayer) => set({ customizePerPlayer }),
  enterCustomizePerPlayer: () => set({ customizePerPlayer: true, currentPlayerIndex: 0 }),
  backToDefaultLoadout: () =>
    set({
      customizePerPlayer: false,
      currentPlayerIndex: 0,
      players: get().players.map((p) => ({ ...p, classId: null, optionIndex: 0 })),
    }),
  confirmTeamLoadout: () => {
    const state = get()
    const ffa = isFreeForAll(state.gameMode)
    const players = state.players.map((p) => {
      const classId = ffa
        ? state.soloDefaultClass
        : p.team === 'red'
          ? state.redTeamDefaultClass
          : p.team === 'blue'
            ? state.blueTeamDefaultClass
            : state.soloDefaultClass
      return { ...p, classId, optionIndex: 0 }
    })
    set({
      players,
      customizePerPlayer: false,
      step: 'briefing',
      direction: 1,
    })
  },
  initPlayers: () => {
    const { squadSize, gameMode } = get()
    const isFfa = isFreeForAll(gameMode)
    set({ players: buildPlayers(squadSize, isFfa), currentPlayerIndex: 0 })
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
  reset: () => set({ ...initial, players: buildPlayers(6, false) }),
}))

export function stepIndex(step: ReserveStep): number {
  return stepOrder.indexOf(step) + 1
}

export function getClassOption(classId: ClassId, optionIndex: number): ClassOption | null {
  const c = paintballClasses.find((x) => x.id === classId)
  if (!c) return null
  return c.options[optionIndex] ?? c.options[0] ?? null
}
