import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réservation',
  description: 'Réservez votre session Paintball Sousse en quelques étapes.',
}

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
