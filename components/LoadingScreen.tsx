"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingGun } from "@/components/LoadingGun";
import { useI18n } from "@/lib/i18n";
import gsap from "gsap";

const LOAD_DURATION_MS = 2200;
const HOLD_AT_FULL_MS = 140;
const EXPLODE_S = 0.55;
const UNVEIL_S = 0.45;

type LoadingScreenProps = {
  onDone: () => void;
};

function playShotBurst() {
  const ACtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!ACtx) return;
  const ctx = new ACtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(220, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.1);
  g.gain.setValueAtTime(0.22, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.2);
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"fill" | "burst" | "fade">("fill");
  const [soundOn, setSoundOn] = useState(false);
  const splashPlayed = useRef(false);
  const burstRan = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) {
      setProgress(100);
      const tBurst = window.setTimeout(() => setPhase("burst"), HOLD_AT_FULL_MS);
      return () => clearTimeout(tBurst);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(
        100,
        ((now - start) / LOAD_DURATION_MS) * 100,
      );
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
      else {
        window.setTimeout(() => setPhase("burst"), HOLD_AT_FULL_MS);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    if (phase !== "burst") return;
    if (burstRan.current) return;
    burstRan.current = true;

    if (!splashPlayed.current && soundOn && !reduce) {
      splashPlayed.current = true;
      playShotBurst();
    }

    gsap.timeline().to(rootRef.current, {
      opacity: 0,
      duration: UNVEIL_S,
      delay: EXPLODE_S,
      ease: "power2.inOut",
      onComplete: () => {
        setPhase("fade");
        onDone();
      },
    });
  }, [phase, soundOn, reduce, onDone]);

  const enableSound = useCallback(() => {
    setSoundOn(true);
    const ACtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ACtx) return;
    const ctx = new ACtx();
    if (ctx.state === "suspended") void ctx.resume();
  }, []);

  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          key="loader-root"
          ref={rootRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050507]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: UNVEIL_S }}
        >
          <button
            type="button"
            onClick={enableSound}
            className="absolute left-6 top-6 min-h-[44px] rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 transition hover:border-brand-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            aria-label={soundOn ? t("sound_off") : t("sound")}
          >
            {soundOn ? t("sound_off") : t("sound")}
          </button>

          <AnimatePresence mode="sync">
            {phase === "burst" && (
              <motion.div
                key="splat"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#050507]"
                initial={{ opacity: 1 }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0.85 }}
                  animate={{
                    scale: reduce ? 1.2 : 4,
                    opacity: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 210,
                    damping: 22,
                    mass: 0.65,
                  }}
                  className="h-[70vmin] w-[70vmin] bg-[#E8001C]"
                  style={{
                    clipPath:
                      "polygon(28% 8%, 74% 4%, 94% 28%, 88% 74%, 58% 96%, 22% 88%, 6% 52%, 14% 22%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-[2] flex flex-col items-center px-4">
            <div className="mb-6">
              <LoadingGun progress={progress} />
            </div>

            <motion.div
              className="mb-10 h-10 w-2 rounded-full bg-brand-red/80"
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <h1 className="font-display text-4xl tracking-wide text-white md:text-6xl">
              PAINTBALL SOUSSE
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
