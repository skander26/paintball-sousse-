import type { Metadata, Viewport } from 'next'
import './globals.css'
import logo from '@/components/media/logo.png'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://paintballsousse.tn'),
  title: {
    default: 'Paintball Sousse | #1 Paintball en Tunisie',
    template: '%s | Paintball Sousse',
  },
  description:
    "Vivez l'adrénaline du paintball à Sousse, Tunisie. Groupes, team building, anniversaires, tournois. Près du Mall of Sousse.",
  keywords: [
    'paintball sousse',
    'paintball tunisie',
    'team building sousse',
    'loisirs sousse',
  ],
  openGraph: {
    title: 'Paintball Sousse',
    description: 'Ressentez l’adrénaline.',
    images: [{ url: logo.src, width: logo.width, height: logo.height, alt: 'Paintball Sousse' }],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#E8001C',
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" style={{ background: '#0F0E11' }}>
        <ParticleBackground />
        <div className="relative z-[2]">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
