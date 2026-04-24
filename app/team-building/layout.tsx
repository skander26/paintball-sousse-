import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team Building',
  description:
    "Boost your team's performance with paintball-powered team building in Sousse, Tunisia. Custom programs, expert facilitators, all-inclusive packages.",
  keywords: [
    'team building sousse',
    'team building tunisie',
    'activité entreprise sousse',
    'paintball entreprise',
  ],
}

export default function TeamBuildingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
