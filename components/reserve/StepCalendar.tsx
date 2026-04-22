"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  getDayAvailability,
  getOpenSlots,
  getPromoForDate,
  isToday,
  type TimeSlotState,
} from "@/lib/reserveCalendar";
import { useReservationStore } from "@/store/reservationStore";
import { playClick } from "@/lib/reserveSounds";
import { DURATION_NORMAL_S, STAGGER_CHILD_S } from "@/lib/constants";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function spotCount(date: Date, time: string): number {
  const s = `${date.toISOString().slice(0, 10)}-${time}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 4 + ((h >>> 0) % 5);
}

export function StepCalendar() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [view, setView] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));

  const selectedDate = useReservationStore((s) => s.selectedDate);
  const selectedTime = useReservationStore((s) => s.selectedTime);
  const setDate = useReservationStore((s) => s.setDate);
  const setTime = useReservationStore((s) => s.setTime);
  const setStep = useReservationStore((s) => s.setStep);
  const setNavigationDirection = useReservationStore((s) => s.setNavigationDirection);

  const cells = useMemo(() => monthGrid(view.y, view.m), [view.y, view.m]);

  const monthLabel = new Date(view.y, view.m, 1).toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const canPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());

  const goPrev = () => {
    if (!canPrev) return;
    playClick();
    setView((v) => {
      if (v.m === 0) return { y: v.y - 1, m: 11 };
      return { y: v.y, m: v.m - 1 };
    });
  };

  const goNext = () => {
    playClick();
    setView((v) => {
      if (v.m === 11) return { y: v.y + 1, m: 0 };
      return { y: v.y, m: v.m + 1 };
    });
  };

  const promo = getPromoForDate(selectedDate);

  const slots = selectedDate ? getOpenSlots(selectedDate) : [];

  const canProceed = Boolean(selectedDate && selectedTime);

  const onProceed = () => {
    if (!canProceed) return;
    playClick();
    setNavigationDirection(1);
    setStep(2);
  };

  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-28 pt-6 md:pb-12">
      {promo.active && (
        <motion.div
          className="mx-auto rounded-full border border-[#E8001C]/50 bg-[#E8001C]/15 px-4 py-2 text-center font-body text-xs text-[#E8001C]"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡ {promo.label}
          {selectedDate
            ? ` — ${selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}`
            : " (jours de semaine)"}
        </motion.div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#12121A]/80 p-5 backdrop-blur-sm">
        <p className="font-display text-2xl text-white md:text-3xl">MISSION INTEL</p>
        <p className="mt-1 font-body text-sm text-muted">Choose your battleground window</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <motion.button
          type="button"
          disabled={!canPrev}
          onClick={goPrev}
          className="rounded-lg border border-white/15 px-3 py-2 font-body text-sm text-white/80 disabled:opacity-30"
          whileHover={{ scale: canPrev ? 1.03 : 1 }}
          whileTap={{ scale: canPrev ? 0.97 : 1 }}
        >
          ←
        </motion.button>
        <h2 className="font-display text-3xl uppercase text-white md:text-4xl">{monthLabel}</h2>
        <motion.button
          type="button"
          onClick={goNext}
          className="rounded-lg border border-white/15 px-3 py-2 font-body text-sm text-white/80"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          →
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey(view.y, view.m)}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: DURATION_NORMAL_S }}
        >
          <div className="mb-2 grid grid-cols-7 gap-1 text-center font-body text-[11px] tracking-[0.2em] text-muted">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} className="min-h-[44px]" />;
              const avail = getDayAvailability(cell, today);
              const sel =
                selectedDate &&
                cell.getDate() === selectedDate.getDate() &&
                cell.getMonth() === selectedDate.getMonth() &&
                cell.getFullYear() === selectedDate.getFullYear();
              const isTodayCell = isToday(cell, today);

              const clickable = avail === "open";

              return (
                <motion.button
                  key={cell.toISOString()}
                  type="button"
                  disabled={!clickable}
                  onClick={() => {
                    if (!clickable) return;
                    playClick();
                    setDate(cell);
                    setTime(null);
                  }}
                  className={`relative flex min-h-[44px] min-w-[40px] flex-col items-center justify-center rounded-lg border font-mono text-sm md:text-base ${
                    sel
                      ? "border-[#E8001C] bg-[#E8001C] text-white shadow-[0_0_20px_rgba(232,0,28,0.45)]"
                      : avail === "full"
                        ? "cursor-not-allowed border-white/10 bg-black/30 opacity-60"
                        : avail === "closed"
                          ? "cursor-not-allowed border-transparent opacity-30 line-through"
                          : "border-[#E8001C]/40 bg-[#12121A]"
                  } ${isTodayCell && !sel ? "ring-1 ring-white/80" : ""}`}
                  style={{ fontFamily: "var(--font-orbitron)" }}
                  whileHover={clickable ? { scale: 1.08 } : undefined}
                  whileTap={clickable ? { scale: 0.96 } : undefined}
                >
                  {avail === "open" && (
                    <span className="absolute right-0.5 top-0.5 rounded bg-[#E8001C]/90 px-1 font-body text-[7px] text-white">
                      OPEN
                    </span>
                  )}
                  {avail === "full" && (
                    <span className="absolute right-0.5 top-0.5 font-body text-[7px] text-muted">FULL</span>
                  )}
                  <span>{cell.getDate()}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#0d0d12]/90 p-4"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-wider text-muted">Available time slots</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slots.map((slot, i) => {
              const open = slot.state === "open";
              const spots = selectedDate ? spotCount(selectedDate, slot.time) : 6;
              const selected = selectedTime === slot.time;
              return (
                <motion.button
                  key={slot.time}
                  type="button"
                  disabled={!open}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * STAGGER_CHILD_S }}
                  onClick={() => {
                    if (!open) return;
                    playClick();
                    setTime(slot.time);
                  }}
                  className={`min-w-[120px] shrink-0 snap-start rounded-xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-[#E8001C] bg-[#E8001C] text-white shadow-[0_0_16px_rgba(232,0,28,0.4)]"
                      : open
                        ? "border-white/15 bg-[#12121A] hover:border-[#E8001C]"
                        : "cursor-not-allowed opacity-40"
                  }`}
                >
                  <p className="font-mono text-xl text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {slot.time}
                  </p>
                  <p className="font-body text-[11px] text-white/60">~2 HRS</p>
                  {open ? (
                    <p className="font-body text-[11px] text-[#E8001C]">{spots} SPOTS LEFT</p>
                  ) : (
                    <p className="font-body text-[11px] text-muted">COMPLET</p>
                  )}
                </motion.button>
              );
            })}
          </div>
          {selectedDate && selectedTime && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center font-mono text-sm text-[#E8001C]"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              ⚡ SLOT LOCKED IN — {selectedDate.toLocaleDateString("fr-FR")} AT {selectedTime}
            </motion.p>
          )}
        </motion.div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050507]/95 p-4 backdrop-blur-md md:relative md:border-0 md:bg-transparent md:p-0">
        <motion.button
          type="button"
          disabled={!canProceed}
          onClick={onProceed}
          className={`w-full rounded-xl py-4 font-display text-2xl tracking-wide ${
            canProceed ? "bg-[#E8001C] text-white shadow-glow" : "cursor-not-allowed bg-white/10 text-white/40"
          }`}
          whileHover={canProceed ? { scale: 1.01 } : undefined}
          whileTap={canProceed ? { scale: 0.99 } : undefined}
        >
          PROCEED TO SQUAD →
        </motion.button>
      </div>
    </div>
  );
}
