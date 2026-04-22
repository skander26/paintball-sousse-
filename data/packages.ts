export type Tier = 'recruit' | 'soldier' | 'warrior' | 'elite' | 'commander'

export const tierColors: Record<Tier, string> = {
  recruit: 'var(--tier-recruit)',
  soldier: 'var(--tier-soldier)',
  warrior: 'var(--tier-warrior)',
  elite: 'var(--tier-elite)',
  commander: 'var(--tier-commander)',
}

export const tierHex: Record<Tier, string> = {
  recruit: '#94a3b8',
  soldier: '#22c55e',
  warrior: '#f97316',
  elite: '#e8001c',
  commander: '#ffd700',
}

export const packages = [
  { balls: 30, duration: '30 min', minutes: 30, price: 25, tier: 'recruit' as const },
  { balls: 40, duration: '30 min', minutes: 30, price: 30, tier: 'recruit' as const },
  { balls: 60, duration: '30 min', minutes: 30, price: 35, tier: 'soldier' as const },
  { balls: 80, duration: '40 min', minutes: 40, price: 40, tier: 'soldier' as const },
  {
    balls: 100,
    duration: '45 min',
    minutes: 45,
    price: 45,
    tier: 'warrior' as const,
    popular: true,
  },
  { balls: 120, duration: '60 min', minutes: 60, price: 50, tier: 'warrior' as const },
  { balls: 160, duration: '1h 30min', minutes: 90, price: 65, tier: 'elite' as const },
  { balls: 200, duration: '1h30–2h', minutes: 105, price: 75, tier: 'elite' as const },
  { balls: 250, duration: '2h', minutes: 120, price: 100, tier: 'commander' as const },
]

export const gameModes = [
  {
    id: 'ctf',
    icon: 'flag' as const,
    nameKey: 'arsenal.mode.ctf.name',
    descKey: 'arsenal.mode.ctf.desc',
  },
  {
    id: 'deathmatch',
    icon: 'skull' as const,
    nameKey: 'arsenal.mode.deathmatch.name',
    descKey: 'arsenal.mode.deathmatch.desc',
  },
  {
    id: 'aliens',
    icon: 'alien' as const,
    nameKey: 'arsenal.mode.aliens.name',
    descKey: 'arsenal.mode.aliens.desc',
  },
  {
    id: 'ludo',
    icon: 'dice' as const,
    nameKey: 'arsenal.mode.ludo.name',
    descKey: 'arsenal.mode.ludo.desc',
  },
]

export const recharges = [
  { balls: 15, price: 5, color: '#22c55e' },
  { balls: 30, price: 10, color: '#eab308' },
  { balls: 50, price: 15, color: '#f97316' },
  { balls: 100, price: 30, color: '#e8001c' },
]
