'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ClassId } from '@/data/classes'
import { ReserveIntro } from '@/components/reserve/ReserveIntro'
import { ReserveTopBar } from '@/components/reserve/ReserveTopBar'
import { StepBriefing } from '@/components/reserve/steps/StepBriefing'
import { StepCalendar } from '@/components/reserve/steps/StepCalendar'
import { StepSquad } from '@/components/reserve/steps/StepSquad'
import { StepSuccess } from '@/components/reserve/steps/StepSuccess'
import { useReservationStore } from '@/store/reservationStore'

const variants = {
  initial: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  }),
}

const validTiers: ClassId[] = ['recruit', 'soldier', 'warrior', 'elite', 'commander']

export default function ReserveClient() {
  const [intro, setIntro] = useState(true)
  const searchParams = useSearchParams()
  const step = useReservationStore((s) => s.step)
  const direction = useReservationStore((s) => s.direction)
  const setPreset = useReservationStore((s) => s.setPreset)

  useEffect(() => {
    useReservationStore.getState().reset()
  }, [])

  useEffect(() => {
    const pkg = searchParams.get('package')
    const ballsParam = searchParams.get('balls')
    if (pkg && validTiers.includes(pkg as ClassId)) {
      const b = ballsParam ? Number(ballsParam) : 0
      setPreset({ tier: pkg as ClassId, balls: Number.isFinite(b) ? b : 0 })
    } else {
      setPreset(null)
    }
  }, [searchParams, setPreset])

  return (
    <div className="min-h-[100dvh] pb-16">
      {intro ? (
        <ReserveIntro onStart={() => setIntro(false)} />
      ) : (
        <>
          <ReserveTopBar />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="will-change-transform"
            >
              {step === 'calendar' ? <StepCalendar /> : null}
              {step === 'squad' ? <StepSquad /> : null}
              {step === 'briefing' ? <StepBriefing /> : null}
              {step === 'success' ? <StepSuccess /> : null}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
