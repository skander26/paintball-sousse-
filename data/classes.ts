import type { Tier } from './packages'

export type ClassId = 'recruit' | 'soldier' | 'warrior' | 'elite' | 'commander'

export type ClassOption = { balls: number; price: number; duration: string }

export type PaintballClass = {
  id: ClassId
  tier: Tier
  nameKey: string
  taglineKey: string
  filter: string
  platformColor: string
  stats: { power: number; speed: number; endurance: number; accuracy: number }
  options: ClassOption[]
}

export const paintballClasses: PaintballClass[] = [
  {
    id: 'recruit',
    tier: 'recruit',
    nameKey: 'reserve.class.recruit.name',
    taglineKey: 'reserve.class.recruit.tag',
    filter: 'hue-rotate(210deg) brightness(0.9)',
    platformColor: 'rgba(148,163,184,0.4)',
    stats: { power: 45, speed: 70, endurance: 55, accuracy: 50 },
    options: [
      { balls: 30, price: 25, duration: '30 min' },
      { balls: 40, price: 30, duration: '30 min' },
    ],
  },
  {
    id: 'soldier',
    tier: 'soldier',
    nameKey: 'reserve.class.soldier.name',
    taglineKey: 'reserve.class.soldier.tag',
    filter: 'hue-rotate(120deg) brightness(0.95)',
    platformColor: 'rgba(34,197,94,0.4)',
    stats: { power: 60, speed: 65, endurance: 70, accuracy: 62 },
    options: [
      { balls: 60, price: 35, duration: '30 min' },
      { balls: 80, price: 40, duration: '40 min' },
    ],
  },
  {
    id: 'warrior',
    tier: 'warrior',
    nameKey: 'reserve.class.warrior.name',
    taglineKey: 'reserve.class.warrior.tag',
    filter: 'hue-rotate(20deg) brightness(1)',
    platformColor: 'rgba(249,115,22,0.4)',
    stats: { power: 75, speed: 72, endurance: 68, accuracy: 74 },
    options: [
      { balls: 100, price: 45, duration: '45 min' },
      { balls: 120, price: 50, duration: '60 min' },
    ],
  },
  {
    id: 'elite',
    tier: 'elite',
    nameKey: 'reserve.class.elite.name',
    taglineKey: 'reserve.class.elite.tag',
    filter: 'none',
    platformColor: 'rgba(232,0,28,0.45)',
    stats: { power: 88, speed: 78, endurance: 80, accuracy: 85 },
    options: [
      { balls: 160, price: 65, duration: '1h30' },
      { balls: 200, price: 75, duration: '1h30–2h' },
    ],
  },
  {
    id: 'commander',
    tier: 'commander',
    nameKey: 'reserve.class.commander.name',
    taglineKey: 'reserve.class.commander.tag',
    filter: 'hue-rotate(-15deg) brightness(1.1) sepia(0.3)',
    platformColor: 'rgba(255,215,0,0.45)',
    stats: { power: 95, speed: 70, endurance: 92, accuracy: 90 },
    options: [{ balls: 250, price: 100, duration: '2h' }],
  },
]
