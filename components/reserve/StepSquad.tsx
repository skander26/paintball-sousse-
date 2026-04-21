"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { ClassId, PackageOption } from "@/data/classes";
import { findPackageOption, getClassById } from "@/data/classes";
import type { GameModeId } from "@/data/packages";
import { GAME_MODES } from "@/data/packages";
import { CharacterCarousel, useReserveMobile } from "@/components/reserve/CharacterCarousel";
import { ClassCompareRadar } from "@/components/reserve/ClassCompareRadar";
import { useReservationStore, pickRandomGameMode } from "@/store/reservationStore";
import { playClick, playSelect } from "@/lib/reserveSounds";
import { DURATION_NORMAL_S, STAGGER_CHILD_S } from "@/lib/constants";

function SoldierIcon({ team }: { team: "red" | "blue" | "empty" }) {
  if (team === "empty") {
    return (
      <svg viewBox="0 0 24 32" className="h-6 w-5 text-white/15" aria-hidden>
        <path fill="currentColor" d="M12 2L8 8v6l-2 4h12l-2-4V8l-4-6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 32" className="h-6 w-5" aria-hidden>
      <path
        fill={team === "red" ? "#E8001C" : "#0047FF"}
        d="M12 2L8 8v6l-2 4h12l-2-4V8l-4-6z"
      />
    </svg>
  );
}

export function StepSquad() {
  const mobile = useReserveMobile();
  const squadPhase = useReservationStore((s) => s.squadPhase);
  const totalPlayers = useReservationStore((s) => s.totalPlayers);
  const setTotalPlayers = useReservationStore((s) => s.setTotalPlayers);
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase);
  const players = useReservationStore((s) => s.players);
  const currentPlayerIndex = useReservationStore((s) => s.currentPlayerIndex);
  const setCurrentPlayerIndex = useReservationStore((s) => s.setCurrentPlayerIndex);
  const assignPlayerLoadout = useReservationStore((s) => s.assignPlayerLoadout);
  const setPlayerCallsign = useReservationStore((s) => s.setPlayerCallsign);
  const compareOpen = useReservationStore((s) => s.compareOpen);
  const setCompareOpen = useReservationStore((s) => s.setCompareOpen);
  const allClassesAssigned = useReservationStore((s) => s.allClassesAssigned);
  const setStep = useReservationStore((s) => s.setStep);
  const setNavigationDirection = useReservationStore((s) => s.setNavigationDirection);
  const gameModeId = useReservationStore((s) => s.gameModeId);
  const setGameMode = useReservationStore((s) => s.setGameMode);
  const preselectedClassId = useReservationStore((s) => s.preselectedClassId);
  const preselectedBalls = useReservationStore((s) => s.preselectedBalls);

  const [previewClass, setPreviewClass] = useState<ClassId>("warrior");
  const [selectedPkg, setSelectedPkg] = useState<PackageOption>(
    () => getClassById("warrior")!.defaultPackage,
  );
  const [lockBurst, setLockBurst] = useState(false);

  useEffect(() => {
    const c = getClassById(previewClass);
    if (!c) return;
    if (preselectedClassId === previewClass && preselectedBalls != null) {
      const match = findPackageOption(previewClass, preselectedBalls);
      setSelectedPkg(match ?? c.defaultPackage);
    } else {
      setSelectedPkg(c.defaultPackage);
    }
  }, [previewClass, preselectedClassId, preselectedBalls]);

  useEffect(() => {
    if (preselectedClassId) {
      setPreviewClass(preselectedClassId);
    }
  }, [preselectedClassId]);

  const redN = Math.ceil(totalPlayers / 2);
  const blueN = Math.floor(totalPlayers / 2);
  const current = players[currentPlayerIndex];

  const onLockSize = () => {
    playClick();
    setSquadPhase("mode");
  };

  const onLockMode = () => {
    if (!gameModeId) return;
    playClick();
    setSquadPhase("classes");
    setCurrentPlayerIndex(0);
  };

  const onSurpriseMode = () => {
    playClick();
    setGameMode(pickRandomGameMode());
  };

  const onSelectClass = () => {
    if (!current || current.classId) return;
    playSelect();
    setLockBurst(true);
    window.setTimeout(() => setLockBurst(false), 700);
    assignPlayerLoadout(
      current.id,
      previewClass,
      {
        balls: selectedPkg.balls,
        price: selectedPkg.price,
        durationMinutes: selectedPkg.durationMinutes,
        durationLabel: selectedPkg.duration,
      },
      current.name,
    );
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setPreviewClass("warrior");
    }
  };

  const callsign = current?.name ?? "";
  const pc = getClassById(previewClass);

  if (squadPhase === "size") {
    return (
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-28 pt-8 md:pb-12">
        <h2 className="text-center font-display text-5xl text-white md:text-7xl">HOW MANY SOLDIERS?</h2>
        <p className="mt-2 text-center font-body text-lg text-muted">Minimum 6 — Maximum 20 players</p>

        <div className="mt-10 flex items-center justify-center gap-6">
          <motion.button
            type="button"
            aria-label="Decrease"
            className="rounded-xl border border-white/20 px-5 py-3 font-display text-4xl text-white"
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playClick();
              setTotalPlayers(totalPlayers - 1);
            }}
            disabled={totalPlayers <= 6}
          >
            −
          </motion.button>
          <motion.span
            key={totalPlayers}
            className="font-mono text-7xl text-[#E8001C] md:text-8xl"
            style={{ fontFamily: "var(--font-orbitron)" }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 0.28 }}
          >
            {totalPlayers}
          </motion.span>
          <motion.button
            type="button"
            aria-label="Increase"
            className="rounded-xl border border-white/20 px-5 py-3 font-display text-4xl text-white"
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playClick();
              setTotalPlayers(totalPlayers + 1);
            }}
            disabled={totalPlayers >= 20}
          >
            +
          </motion.button>
        </div>

        <p className="mt-6 text-center font-body text-xl text-white/90">
          = {redN} RED TEAM + {blueN} BLUE TEAM
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <SoldierIcon
              key={i}
              team={i < totalPlayers ? (i < redN ? "red" : "blue") : "empty"}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-xl border-l-4 border-[#E8001C] bg-[#12121A] p-4">
            <p className="font-display text-xl text-[#E8001C]">RED TEAM</p>
            <p className="font-mono text-2xl text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              {redN} PLAYERS
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-[#0047FF] bg-[#12121A] p-4">
            <p className="font-display text-xl text-[#0047FF]">BLUE TEAM</p>
            <p className="font-mono text-2xl text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              {blueN} PLAYERS
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050507]/95 p-4 backdrop-blur-md md:relative md:mt-10 md:border-0 md:bg-transparent">
          <motion.button
            type="button"
            onClick={onLockSize}
            className="w-full rounded-xl bg-[#E8001C] py-4 font-display text-2xl text-white shadow-glow"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            LOCK IN SQUAD SIZE
          </motion.button>
        </div>
      </div>
    );
  }

  if (squadPhase === "mode") {
    return (
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-32 pt-8 md:pb-12">
        <h2 className="text-center font-display text-5xl text-white md:text-6xl">SELECT GAME MODE</h2>
        <p className="mt-2 text-center font-body text-muted">One mode for the whole mission.</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GAME_MODES.map((m) => {
            const sel = gameModeId === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => {
                  playClick();
                  setGameMode(m.id);
                }}
                className={`relative rounded-2xl border bg-[#12121A] p-5 text-left transition ${
                  sel
                    ? "border-[#E8001C] shadow-[0_0_24px_rgba(232,0,28,0.35)]"
                    : "border-white/10 hover:border-[#E8001C]/50"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {sel && (
                  <span className="absolute right-3 top-3 text-lg text-[#E8001C]" aria-hidden>
                    ✓
                  </span>
                )}
                <span className="text-3xl">{m.icon}</span>
                <p className="mt-2 font-display text-xl text-white">{m.title}</p>
                <p className="mt-1 font-body text-sm text-muted">{m.subtitle}</p>
                <p className="mt-2 font-body text-xs text-white/60">{m.desc}</p>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          type="button"
          onClick={onSurpriseMode}
          className="mt-6 w-full rounded-xl border border-dashed border-white/25 py-4 font-body text-sm text-muted transition hover:border-[#E8001C]/60 hover:text-white"
          whileHover={{ scale: 1.01 }}
        >
          🎲 SURPRISE US — RANDOM MODE
        </motion.button>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050507]/95 p-4 backdrop-blur-md md:relative md:mt-10 md:border-0 md:bg-transparent">
          <motion.button
            type="button"
            disabled={!gameModeId}
            onClick={onLockMode}
            className={`w-full rounded-xl py-4 font-display text-2xl ${
              gameModeId ? "bg-[#E8001C] text-white shadow-glow" : "cursor-not-allowed bg-white/10 text-white/40"
            }`}
            whileHover={gameModeId ? { scale: 1.01 } : undefined}
            whileTap={gameModeId ? { scale: 0.99 } : undefined}
          >
            LOCK BATTLE MODE →
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 pb-36 pt-6 md:pb-12">
      {preselectedClassId && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl border border-[#E8001C]/40 bg-[#E8001C]/10 px-4 py-3 text-center font-body text-sm text-[#E8001C]"
        >
          ⚡ Pré-sélection depuis l&apos;arsenal — {preselectedClassId.toUpperCase()}
          {preselectedBalls ? ` · ${preselectedBalls} billes` : ""} — vous pouvez changer ci-dessous.
        </motion.div>
      )}

      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="font-body text-sm text-muted">
          PLAYER {currentPlayerIndex + 1} OF {players.length} — SELECT YOUR LOADOUT
        </p>
        <button
          type="button"
          onClick={() => {
            playClick();
            setCompareOpen(!compareOpen);
          }}
          className="rounded-full border border-white/20 px-3 py-1 font-body text-[11px] uppercase tracking-wider text-white/80"
        >
          {compareOpen ? "Close compare" : "Compare"}
        </button>
      </div>

      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-[#E8001C]"
          initial={false}
          animate={{
            width: `${(players.filter((p) => p.classId).length / players.length) * 100}%`,
          }}
        />
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-1 md:justify-start">
        {players.map((p, i) => (
          <span key={p.id} className="font-mono text-lg" aria-hidden>
            {p.classId ? "✅" : i === currentPlayerIndex ? "⚡" : "✗"}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {compareOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] p-4"
          >
            <ClassCompareRadar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {lockBurst && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              background: "radial-gradient(circle, rgba(232,0,28,0.5) 0%, transparent 70%)",
            }}
          />
        )}

        <motion.div
          animate={
            lockBurst
              ? { rotateY: [0, 360], y: [0, -24, 0] }
              : { rotateY: 0, y: 0 }
          }
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <CharacterCarousel activeId={previewClass} onChange={setPreviewClass} mobile={mobile} />
        </motion.div>
      </div>

      {pc && pc.packages.length > 1 && (
        <div className="mt-6">
          <p className="mb-3 font-body text-xs uppercase tracking-wider text-muted">Choose your ammo count</p>
          <div className="flex flex-wrap gap-2">
            {pc.packages.map((pkg) => {
              const active = selectedPkg.balls === pkg.balls && selectedPkg.price === pkg.price;
              return (
                <motion.button
                  key={`${pkg.balls}-${pkg.price}`}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedPkg(pkg);
                  }}
                  className={`rounded-full border px-4 py-2 font-body text-sm transition ${
                    active
                      ? "text-white shadow-[0_0_16px_rgba(0,0,0,0.4)]"
                      : "border-white/15 bg-[#0d0d12] text-muted hover:border-white/30"
                  }`}
                  style={
                    active
                      ? {
                          borderColor: pc.color,
                          backgroundColor: `${pc.color}22`,
                          color: "#fff",
                        }
                      : undefined
                  }
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {pkg.balls} balls · {pkg.price} TND
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {pc && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${pc.id}-${selectedPkg.balls}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION_NORMAL_S }}
            className="mt-6 rounded-2xl border border-white/10 bg-[#12121A]/95 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-3xl" style={{ color: pc.color }}>
                  ⚡ {pc.name}
                </p>
                <p className="font-body text-sm text-muted">{pc.subtitle}</p>
                <p className="font-body text-sm italic text-muted">&ldquo;{pc.tagline}&rdquo;</p>
              </div>
              {pc.badge && (
                <span
                  className="rounded-full px-3 py-1 font-body text-[10px] font-bold uppercase text-black"
                  style={{ backgroundColor: pc.color }}
                >
                  {pc.badge}
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {(["firepower", "speed", "endurance", "accuracy"] as const).map((k, i) => (
                <div key={k}>
                  <div className="flex justify-between font-body text-[11px] uppercase text-muted">
                    <span>{k}</span>
                    <span>{pc.stats[k]}/5</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: pc.color, opacity: 0.85 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(pc.stats[k] / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * STAGGER_CHILD_S }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 font-body text-sm text-white/90">
              <span>🎯 {selectedPkg.balls} PAINTBALLS</span>
              <span>⏱ {selectedPkg.duration}</span>
              <span className="font-mono text-lg" style={{ fontFamily: "var(--font-orbitron)", color: pc.color }}>
                💰 {selectedPkg.price} TND
              </span>
            </div>
            <p className="mt-3 font-body text-sm text-muted">{pc.description}</p>
          </motion.div>
        </AnimatePresence>
      )}

      <label className="mt-6 block">
        <span className="mb-2 block font-body text-xs uppercase text-muted">Callsign (optional)</span>
        <input
          type="text"
          value={callsign}
          onChange={(e) => current && setPlayerCallsign(current.id, e.target.value)}
          placeholder="e.g. VIPER, GHOST, STRIKER..."
          className="w-full rounded-xl border border-white/15 bg-[#0d0d12] px-4 py-3 font-body text-white placeholder:text-white/30 focus:border-[#E8001C] focus:outline-none"
        />
      </label>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-2 border-t border-white/10 bg-[#050507]/95 p-4 backdrop-blur-md md:relative md:mt-8 md:border-0 md:bg-transparent">
        <motion.button
          type="button"
          onClick={onSelectClass}
          disabled={!current || !!current.classId}
          className={`w-full rounded-xl py-4 font-display text-xl tracking-wide ${
            current?.classId ? "bg-white/10 text-white/40" : "bg-[#E8001C] text-white shadow-glow"
          }`}
          whileHover={!current?.classId ? { scale: 1.01 } : undefined}
          whileTap={!current?.classId ? { scale: 0.99 } : undefined}
        >
          SELECT THIS LOADOUT ▶
        </motion.button>

        {allClassesAssigned() && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => {
              playClick();
              setNavigationDirection(1);
              setStep(3);
            }}
            className="w-full rounded-xl border border-[#E8001C] bg-[#E8001C]/20 py-4 font-display text-xl text-[#E8001C]"
          >
            PROCEED TO BRIEFING →
          </motion.button>
        )}
      </div>
    </div>
  );
}
