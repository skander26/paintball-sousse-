"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useReservationStore } from "@/store/reservationStore";

const LINE1 = "INITIALIZING MISSION...";
const LINE2 = "PAINTBALL SOUSSE — TACTICAL COMMAND";

const INTRO_TOTAL_MS = 2500;
const PROGRESS_MS = 1800;
const PROGRESS_DELAY_MS = 200;

export function ReserveIntro() {
  const reduce = useReducedMotion();
  const setIntroComplete = useReservationStore((s) => s.setIntroComplete);
  const setIntroSkipped = useReservationStore((s) => s.setIntroSkipped);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [flash, setFlash] = useState(false);
  const [progress, setProgress] = useState(0);

  const finish = useCallback(() => {
    setIntroComplete(true);
  }, [setIntroComplete]);

  useEffect(() => {
    if (reduce) {
      setIntroComplete(true);
      return;
    }

    let i = 0;
    const t1 = window.setInterval(() => {
      i += 1;
      setLine1(LINE1.slice(0, i));
      if (i >= LINE1.length) {
        window.clearInterval(t1);
        let j = 0;
        const t2 = window.setInterval(() => {
          j += 1;
          setLine2(LINE2.slice(0, j));
          if (j >= LINE2.length) window.clearInterval(t2);
        }, 28);
      }
    }, 32);

    const pStart = window.setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, (elapsed / PROGRESS_MS) * 100);
        setProgress(p);
        if (p < 100) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, PROGRESS_DELAY_MS);

    const flashT = window.setTimeout(() => setFlash(true), INTRO_TOTAL_MS - 200);
    const doneT = window.setTimeout(() => finish(), INTRO_TOTAL_MS);

    return () => {
      window.clearInterval(t1);
      window.clearTimeout(pStart);
      window.clearTimeout(flashT);
      window.clearTimeout(doneT);
    };
  }, [reduce, finish, setIntroComplete]);

  const skip = () => {
    setIntroSkipped(true);
    finish();
  };

  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050507]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <div className="reserve-scan pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <motion.div
        className="relative z-10 mb-10"
        initial={{ opacity: 0, rotate: -12 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" className="text-[#E8001C]">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
            <line x1="50" y1="8" x2="50" y2="22" stroke="currentColor" strokeWidth="1.2" />
            <line x1="50" y1="78" x2="50" y2="92" stroke="currentColor" strokeWidth="1.2" />
            <line x1="8" y1="50" x2="22" y2="50" stroke="currentColor" strokeWidth="1.2" />
            <line x1="78" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </motion.g>
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-xl px-6 text-center font-mono text-sm tracking-wider text-white md:text-base">
        <p className="min-h-[1.5em] font-mono text-[#E8001C]" style={{ fontFamily: "var(--font-orbitron)" }}>
          {line1}
        </p>
        <p className="mt-3 min-h-[1.5em] text-xs text-white/70 md:text-sm" style={{ fontFamily: "var(--font-orbitron)" }}>
          {line2}
        </p>
      </div>

      <div className="relative z-10 mt-10 w-[min(90vw,360px)]">
        <p className="mb-2 text-center font-body text-[11px] uppercase tracking-[0.25em] text-muted">
          Loading mission data
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#E8001C]"
            style={{ width: `${progress}%` }}
            layout
          />
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="fixed bottom-6 right-6 z-20 font-body text-xs text-white/40 transition hover:text-white/70"
      >
        SKIP INTRO →
      </button>

      {flash && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.35 }}
        />
      )}
    </motion.div>
  );
}
