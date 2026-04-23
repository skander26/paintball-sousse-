import type { ClassId } from '@/data/classes'

/**
 * Images du sélecteur de classe en réservation.
 * Placez les fichiers sous `public/characters/{red|blue}/{classId}.webp`
 * (ex. `public/characters/red/warrior.webp`).
 */
export function reserveCharacterImage(team: 'red' | 'blue', classId: ClassId): string {
  return `/characters/${team}/${classId}.webp`
}
