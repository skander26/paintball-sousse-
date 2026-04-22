"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useReservationStore } from "@/store/reservationStore";
import { getClassById, type ClassId } from "@/data/classes";
import { playClick, playConfirm } from "@/lib/reserveSounds";
import { PHONE_DISPLAY } from "@/lib/constants";

function classDot(classId: ClassId | null) {
  if (!classId) return "#888";
  return getClassById(classId)?.color ?? "#fff";
}

export function StepBriefing() {
  const selectedDate = useReservationStore((s) => s.selectedDate);
  const selectedTime = useReservationStore((s) => s.selectedTime);
  const getTotalCost = useReservationStore((s) => s.getTotalCost);
  const getRedTeam = useReservationStore((s) => s.getRedTeam);
  const getBlueTeam = useReservationStore((s) => s.getBlueTeam);
  const getSquadBalanceScore = useReservationStore((s) => s.getSquadBalanceScore);
  const getMissionTotalBalls = useReservationStore((s) => s.getMissionTotalBalls);
  const getMissionAvgDurationMinutes = useReservationStore((s) => s.getMissionAvgDurationMinutes);
  const getGameModeLabel = useReservationStore((s) => s.getGameModeLabel);
  const setStep = useReservationStore((s) => s.setStep);
  const setNavigationDirection = useReservationStore((s) => s.setNavigationDirection);

  const red = getRedTeam();
  const blue = getBlueTeam();
  const total = getTotalCost();
  const balance = getSquadBalanceScore();
  const missionBalls = getMissionTotalBalls();
  const avgDur = getMissionAvgDurationMinutes();
  const modeLabel = getGameModeLabel();

  const maxDur = (team: typeof red) =>
    team.length ? Math.max(...team.map((p) => p.durationMinutes)) : 0;

  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    const c = animate(0, total, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayTotal(Math.round(v)),
    });
    return () => c.stop();
  }, [total]);

  const dateLabel = useMemo(() => {
    if (!selectedDate) return "—";
    return selectedDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const onModify = () => {
    playClick();
    setNavigationDirection(-1);
    setStep(2);
  };

  const onConfirm = () => {
    playConfirm();
    setNavigationDirection(1);
    setStep(4);
  };

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 pb-36 pt-8 md:pb-12">
      <div className="text-center">
        <h2 className="font-display text-4xl text-white md:text-5xl">⚔️ MISSION BRIEFING ⚔️</h2>
        <p className="mt-2 font-body text-lg text-muted">Your squad is assembled. The arena awaits.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-[#E8001C]/40 border-l-4 border-l-[#E8001C] bg-[#12121A]/90 p-5"
        >
          <h3 className="font-display text-2xl text-[#E8001C]">RED TEAM</h3>
          <ul className="mt-4 space-y-3">
            {red.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="reserve-row-shimmer relative overflow-hidden rounded-lg border border-white/5 bg-black/20 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: classDot(p.classId) }}
                  />
                  <span className="font-mono text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {p.name || `Joueur ${i + 1}`}
                  </span>
                </div>
                <p className="mt-1 font-body text-sm text-muted">
                  {p.className} · {p.balls} billes · {p.price} TND
                </p>
              </motion.li>
            ))}
          </ul>
          <p className="mt-4 font-body text-sm text-[#E8001C]">
            TEAM TOTAL:{" "}
            <span className="font-mono text-lg text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              {red.reduce((s, p) => s + p.price, 0)} TND
            </span>
            {" · "}
            <span className="font-body text-muted">
              {red.reduce((s, p) => s + p.balls, 0)} billes · ~{maxDur(red)} min max
            </span>
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-2 py-4 md:py-12">
          <svg viewBox="0 0 120 48" className="h-12 w-32 text-[#E8001C]" aria-hidden>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M10 38 L30 8 L50 38 M70 8 L90 38 L110 8"
            />
          </svg>
          <motion.span
            className="font-display text-7xl text-[#E8001C] md:text-8xl"
            animate={{ opacity: [1, 0.85, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            VS
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-[#0047FF]/40 border-l-4 border-l-[#0047FF] bg-[#12121A]/90 p-5"
        >
          <h3 className="font-display text-2xl text-[#0047FF]">BLUE TEAM</h3>
          <ul className="mt-4 space-y-3">
            {blue.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="reserve-row-shimmer relative overflow-hidden rounded-lg border border-white/5 bg-black/20 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: classDot(p.classId) }}
                  />
                  <span className="font-mono text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    {p.name || `Joueur ${i + 1}`}
                  </span>
                </div>
                <p className="mt-1 font-body text-sm text-muted">
                  {p.className} · {p.balls} billes · {p.price} TND
                </p>
              </motion.li>
            ))}
          </ul>
          <p className="mt-4 font-body text-sm text-[#0047FF]">
            TEAM TOTAL:{" "}
            <span className="font-mono text-lg text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              {blue.reduce((s, p) => s + p.price, 0)} TND
            </span>
            {" · "}
            <span className="font-body text-muted">
              {blue.reduce((s, p) => s + p.balls, 0)} billes · ~{maxDur(blue)} min max
            </span>
          </p>
        </motion.div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#E8001C]/30 bg-[#0d0d12] p-6 font-body text-sm">
        <p className="font-display text-xl tracking-wide text-white">MISSION PARAMETERS</p>
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-left text-muted">
          <p>
            <span className="text-white/90">🎮 Mode :</span> {modeLabel}
          </p>
          <p>
            <span className="text-white/90">📅 Date :</span> {dateLabel}
          </p>
          <p>
            <span className="text-white/90">⏰ Heure :</span> {selectedTime ?? "—"}
          </p>
          <p>
            <span className="text-white/90">⏱ Durée moy. :</span> ~{avgDur} min (selon loadouts)
          </p>
          <p>
            <span className="text-white/90">🎯 Billes totales :</span>{" "}
            <span className="font-mono text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              {missionBalls}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d0d12] p-6 text-center font-body text-sm text-muted">
        <p>📍 Près du Mall de Sousse, Route Sidi Bou Ali, Kalaa Kebira</p>
        <p className="mt-2 text-white/80">📞 {PHONE_DISPLAY}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#12121A] p-4">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Squad balance</p>
        <p className="mt-1 font-body text-sm text-white">{balance.label}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-[#E8001C]"
            initial={{ width: 0 }}
            animate={{ width: `${balance.pct}%` }}
            transition={{ duration: 0.9 }}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-body text-sm uppercase tracking-widest text-muted">Total mission cost</p>
        <p className="font-mono text-5xl text-white md:text-6xl" style={{ fontFamily: "var(--font-orbitron)" }}>
          {displayTotal} TND
        </p>
        <p className="mt-2 font-body text-sm text-muted">Payable on arrival · No credit card required</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-3 border-t border-white/10 bg-[#050507]/95 p-4 backdrop-blur-md md:relative md:mt-10 md:border-0 md:bg-transparent md:flex-row md:justify-center">
        <motion.button
          type="button"
          onClick={onModify}
          className="w-full rounded-xl border border-white/30 py-4 font-display text-xl text-white md:w-auto md:min-w-[200px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← MODIFY SQUAD
        </motion.button>
        <motion.button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-xl bg-[#E8001C] py-4 font-display text-xl text-white shadow-glow md:w-auto md:min-w-[280px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎯 CONFIRM MISSION →
        </motion.button>
      </div>

    </div>
  );
}
