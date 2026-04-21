"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
            <p className="mb-6 font-mono text-xs tracking-[0.5em] text-brand-red">
              {t("loading")}
            </p>

            <svg
              viewBox="0 0 320 200"
              className="mb-6 h-36 w-64 max-w-[85vw] md:h-40 md:w-72"
              aria-hidden
            >
              <defs>
                <linearGradient id="mag" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8001C" />
                  <stop offset="100%" stopColor="#ff2d44" />
                </linearGradient>
              </defs>
              <rect x="40" y="72" width="240" height="56" rx="10" fill="#12121a" stroke="#2a2a38" />
              <rect
                x="44"
                y="76"
                width={(232 * progress) / 100}
                height="48"
                rx="8"
                fill="url(#mag)"
              />
              <rect x="24" y="96" width="140" height="28" rx="6" fill="#222" />
              <rect x="220" y="84" width="72" height="44" rx="8" fill="#333" />
              <rect x="286" y="92" width="34" height="12" rx="4" fill="#444" />
              <motion.g
                animate={{ rotate: 360 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformOrigin: "160px 100px" }}
              >
                <circle cx="160" cy="48" r="46" fill="none" stroke="#E8001C44" strokeWidth="2" />
                <line x1="160" y1="14" x2="160" y2="82" stroke="#E8001C" strokeWidth="2" />
                <line x1="126" y1="48" x2="194" y2="48" stroke="#E8001C" strokeWidth="2" />
              </motion.g>
            </svg>

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
