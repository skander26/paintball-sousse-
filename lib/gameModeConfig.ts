import { gameModes, type GameModeId } from '@/data/packages'

export type GameModeRules = {
  teamBased: boolean
  minPlayers: number
  maxPlayers: number
}

const fallback: GameModeRules = { teamBased: true, minPlayers: 4, maxPlayers: 20 }

export function getGameModeRules(gameMode: GameModeId | null): GameModeRules {
  if (!gameMode) return fallback
  const m = gameModes.find((x) => x.id === gameMode)
  if (!m) return fallback
  return {
    teamBased: m.teamBased,
    minPlayers: m.minPlayers,
    maxPlayers: m.maxPlayers,
  }
}

export function isFreeForAll(gameMode: GameModeId | null): boolean {
  return gameMode === 'free-for-all'
}
