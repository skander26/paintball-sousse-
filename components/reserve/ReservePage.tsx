"use client";

import { Suspense, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReservationStore } from "@/store/reservationStore";
import { ReserveUrlSync } from "@/components/reserve/ReserveUrlSync";
import { ReserveIntro } from "@/components/reserve/ReserveIntro";
import { ReserveTopBar } from "@/components/reserve/ReserveTopBar";
import { StepCalendar } from "@/components/reserve/StepCalendar";
import { StepSquad } from "@/components/reserve/StepSquad";
import { StepBriefing } from "@/components/reserve/StepBriefing";
import { StepSuccess } from "@/components/reserve/StepSuccess";
import { PaintTrailCursor } from "@/components/reserve/PaintTrailCursor";
import { AmbientAudioToggle } from "@/components/reserve/AmbientAudioToggle";
import { DURATION_NORMAL_S } from "@/lib/constants";
import { playClick } from "@/lib/reserveSounds";

export function ReservePage() {
  const introComplete = useReservationStore((s) => s.introComplete);
  const step = useReservationStore((s) => s.step);
  const squadPhase = useReservationStore((s) => s.squadPhase);
  const dir = useReservationStore((s) => s.navigationDirection);
  const setStep = useReservationStore((s) => s.setStep);
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase);
  const setNavigationDirection = useReservationStore((s) => s.setNavigationDirection);
  const [ready, setReady] = useState(
    () => useReservationStore.getState().step !== 4,
  );

  useLayoutEffect(() => {
    const s = useReservationStore.getState();
    if (s.step === 4) {
      s.reset();
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        className="relative min-h-dvh bg-transparent"
        aria-hidden
      />
    );
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  const goBack = () => {
    if (step <= 1) return;
    playClick();
    setNavigationDirection(-1);
    if (step === 2) {
      if (squadPhase === "classes") {
        setSquadPhase("mode");
        return;
      }
      if (squadPhase === "mode") {
        setSquadPhase("size");
        return;
      }
    }
    setStep((step - 1) as 1 | 2 | 3 | 4);
  };

  return (
    <div className="relative min-h-dvh bg-transparent text-white">
      <Suspense fallback={null}>
        <ReserveUrlSync />
      </Suspense>
      <PaintTrailCursor />
      <AmbientAudioToggle />

      <AnimatePresence mode="wait">
        {!introComplete && (
          <ReserveIntro key="reserve-intro" />
        )}
      </AnimatePresence>

      {introComplete && (
        <>
          <ReserveTopBar />
          {step > 1 && step < 4 && (
            <motion.button
              type="button"
              onClick={goBack}
              className="fixed left-4 top-[7.5rem] z-[55] rounded-full border border-white/15 bg-black/50 px-4 py-2 font-body text-xs uppercase tracking-wider text-white/80 backdrop-blur-sm md:top-32"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ← Étape précédente
            </motion.button>
          )}

          <main className="relative z-10 min-h-[calc(100dvh-140px)] pb-8">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: DURATION_NORMAL_S, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-[50vh]"
              >
                {step === 1 && <StepCalendar />}
                {step === 2 && <StepSquad />}
                {step === 3 && <StepBriefing />}
                {step === 4 && <StepSuccess />}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
}
