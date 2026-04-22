'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Footer } from '@/components/Footer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Navbar } from '@/components/Navbar'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SplatCursor } from '@/components/ui/SplatCursor'

const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
})
const ExperiencesSection = dynamic(() => import('@/components/sections/ExperiencesSection'), {
  loading: () => <div className="min-h-[30vh]" aria-hidden />,
})
const ArsenalSection = dynamic(() => import('@/components/sections/ArsenalSection'), {
  loading: () => <div className="min-h-[40vh]" aria-hidden />,
})
const TournamentSection = dynamic(() => import('@/components/sections/TournamentSection'), {
  loading: () => <div className="min-h-[30vh]" aria-hidden />,
})
const GallerySection = dynamic(() => import('@/components/sections/GallerySection'), {
  loading: () => <div className="min-h-[30vh]" aria-hidden />,
})
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  loading: () => <div className="min-h-[20vh]" aria-hidden />,
})
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), {
  loading: () => <div className="min-h-[20vh]" aria-hidden />,
})
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <div className="min-h-[30vh]" aria-hidden />,
})

export default function HomeClient() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded ? <LoadingScreen onDone={() => setLoaded(true)} /> : null}
      {loaded ? (
        <>
          <ScrollProgress />
          <Navbar />
          <main>
            <HeroSection />
            <ExperiencesSection />
            <ArsenalSection />
            <TournamentSection />
            <GallerySection />
            <TestimonialsSection />
            <FAQSection />
            <ContactSection />
          </main>
          <Footer />
          <WhatsAppFloat />
          <SplatCursor />
        </>
      ) : null}
    </>
  )
}
