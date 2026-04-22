"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import { useCallback, useRef, useState } from "react";
import {
  ARSENAL_PACKAGES,
  GAME_MODES,
  MAX_BALLS,
  MAX_DURATION_MIN,
  RECHARGES_HOME,
  TIER_ACCENTS,
  shotsPerMinute,
  type ArsenalPackageRow,
} from "@/data/packages";
import { PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/constants";

function PackageTooltip({ row }: { row: ArsenalPackageRow }) {
  const [open, setOpen] = useState(false);
  const spm = shotsPerMinute(row.balls, row.durationMinutes);
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Info"
        className="absolute right-3 top-3 rounded-full p-1 text-white/40 transition hover:text-white"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <PBIcon icon={ICONS.help} size={16} className="text-white/60" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-10 z-20 w-56 rounded-lg border border-white/15 bg-[#1a1a22] p-3 text-left font-body text-[11px] leading-snug text-muted shadow-xl"
          >
            Environ {spm} billes/min sur cette durée — chargez plus sur place si besoin.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadoutCard({ row }: { row: ArsenalPackageRow }) {
  const tier = TIER_ACCENTS[row.tier];
  const ammoPct = (row.balls / MAX_BALLS) * 100;
  const timePct = (row.durationMinutes / MAX_DURATION_MIN) * 100;
  const [showTip, setShowTip] = useState(false);
  const tipTimer = useRef<number | null>(null);

  const onEnter = useCallback(() => {
    tipTimer.current = window.setTimeout(() => setShowTip(true), 2000);
  }, []);
  const onLeave = useCallback(() => {
    if (tipTimer.current) window.clearTimeout(tipTimer.current);
    setShowTip(false);
  }, []);

  const commander = row.tier === "commander";
  const href = `/reserve?package=${row.classId}&balls=${row.balls}`;

  return (
    <motion.div
      className={`relative rounded-2xl border bg-[#0D0D12] p-6 transition ${
        commander ? "arsenal-commander-border border-[#FFD700]/80" : "border-white/[0.06]"
      }`}
      whileHover={{ scale: 1.02, borderColor: tier.color }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <PackageTooltip row={row} />
      {row.popular && (
        <span className="absolute right-3 top-12 rounded-full bg-[#E8001C] px-2 py-0.5 font-body text-[10px] font-bold uppercase text-white">
          ⚡ MOST POPULAR
        </span>
      )}
      {commander && (
        <span className="absolute left-3 top-3 rounded-full bg-[#FFD700]/20 px-2 py-0.5 font-body text-[10px] font-bold uppercase text-[#FFD700]">
          ULTIMATE LOADOUT
        </span>
      )}

      <div className="mb-3 flex items-start justify-between">
        <span
          className="rounded-full px-2 py-0.5 font-body text-[11px] font-semibold uppercase text-white"
          style={{ backgroundColor: `${tier.color}99` }}
        >
          {tier.label}
        </span>
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tier.dot }} />
      </div>

      <p className="font-display text-4xl text-white md:text-5xl">{row.balls} BALLS</p>
      <div className="my-3 h-px bg-white/10" />
      <p className="font-body text-sm text-muted">
        ⏱ {row.duration}
      </p>
      <p className="mt-2 font-mono text-2xl" style={{ fontFamily: "var(--font-orbitron)", color: tier.color }}>
        {row.price} TND
        <span className="ms-1 font-body text-xs font-normal text-muted">/ PERSON</span>
      </p>

      <div className="mt-4 space-y-2">
        <div>
          <p className="font-body text-[10px] uppercase text-muted">Ammo</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full" style={{ width: `${ammoPct}%`, backgroundColor: tier.color }} />
          </div>
        </div>
        <div>
          <p className="font-body text-[10px] uppercase text-muted">Time</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full" style={{ width: `${timePct}%`, backgroundColor: tier.color }} />
          </div>
        </div>
      </div>

      <Link
        href={href}
        className="mt-5 block w-full rounded border py-3 text-center font-body text-sm uppercase tracking-wider transition hover:bg-white/5"
        style={{ borderColor: tier.color, color: tier.color }}
      >
        SELECT THIS LOADOUT →
      </Link>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-0 right-0 z-30 mb-2 rounded-lg border border-[#E8001C]/40 bg-[#12121A] p-3 font-body text-xs text-muted shadow-lg"
          >
            💡 PRO TIP: Most groups choose 100–120 balls for the best experience. You can always recharge during
            the game!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ArsenalSection() {
  return (
    <section
      id="arsenal"
      className="relative overflow-hidden px-4 py-24 md:px-10"
      style={{
        background: "linear-gradient(180deg, #050507 0%, #0d0d12 50%, #050507 100%)",
      }}
    >
      <div className="relative z-[1] mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-body text-sm font-semibold uppercase tracking-[0.35em] text-[#E8001C]"
        >
          WHAT&apos;S IN YOUR LOADOUT?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-center font-display text-6xl text-white md:text-8xl"
        >
          THE ARSENAL
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-center font-body text-lg text-muted">
          Choose your ammunition. Every battle is different.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-sm text-white/90">
            👥 4 to 20 PLAYERS
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-sm text-white/90">
            🎯 AGES 10–60 WELCOME
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-sm text-white/90">
            📋 SAFETY BRIEFING INCLUDED
          </span>
        </div>

        {/* Game modes */}
        <h3 className="mt-20 font-display text-3xl text-white md:text-4xl">GAME MODES</h3>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GAME_MODES.map((m) => (
            <motion.div
              key={m.id}
              className="min-w-[220px] shrink-0 snap-start rounded-2xl border border-white/[0.07] bg-[#12121A] p-5"
              whileHover={{ y: -4, borderColor: "rgba(232,0,28,0.5)" }}
            >
              <span className="text-4xl">{m.icon}</span>
              <p className="mt-3 font-display text-xl text-white">{m.title}</p>
              <p className="mt-2 font-body text-[13px] text-muted">{m.subtitle}</p>
              <p className="mt-2 font-body text-[13px] text-white/60">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Packages */}
        <h3 className="mt-16 font-display text-5xl text-white md:text-6xl">CHOOSE YOUR AMMUNITION</h3>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARSENAL_PACKAGES.map((row) => (
            <LoadoutCard key={`${row.balls}-${row.price}`} row={row} />
          ))}
        </div>

        {/* Bring a friend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="arsenal-pulse-border mt-16 rounded-2xl border border-[#E8001C]/50 bg-[#E8001C]/10 px-6 py-5 text-center"
        >
          <p className="font-display text-xl text-white md:text-2xl">
            👥 GROUPS OF 10+ GET PRIORITY BOOKING — CALL US TO ARRANGE
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 font-body">
            <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-[#E8001C] underline">
              {PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
              WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Recharges */}
        <h3 className="mt-16 font-display text-4xl text-white md:text-5xl">NEED MORE AMMO?</h3>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {RECHARGES_HOME.map((r) => (
            <motion.div
              key={r.balls}
              className="rounded-2xl border border-white/10 bg-[#12121A] p-5 text-center"
              style={{ borderColor: `${r.color}44` }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
              <p className="mt-3 font-mono text-5xl" style={{ fontFamily: "var(--font-orbitron)", color: r.color }}>
                {r.balls}
              </p>
              <p className="font-body text-[11px] uppercase text-muted">BALLS</p>
              <p className="mt-2 font-body text-lg font-bold text-white">{r.price} TND</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center font-body text-sm italic text-muted">
          Recharge balls can be purchased during your session at the venue
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 px-4 py-20 text-center"
          style={{
            background: "linear-gradient(135deg, #0D0D12 0%, #1a0005 50%, #0D0D12 100%)",
            borderTop: "1px solid rgba(232,0,28,0.3)",
            borderBottom: "1px solid rgba(232,0,28,0.3)",
          }}
        >
          <h3 className="font-display text-5xl text-white md:text-7xl">READY TO ENTER THE ARENA?</h3>
          <p className="mx-auto mt-4 max-w-lg font-body text-xl text-muted">
            Reserve your session in 3 minutes. Pay on arrival.
          </p>
          <motion.div className="mt-10 inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/reserve"
              className="inline-block rounded bg-[#E8001C] px-14 py-5 font-display text-3xl text-white shadow-[0_0_40px_rgba(232,0,28,0.5)]"
            >
              🎯 START YOUR MISSION →
            </Link>
          </motion.div>
          <p className="mt-8 font-body text-muted">
            Or call / WhatsApp:{" "}
            <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-white underline">
              {PHONE_DISPLAY}
            </a>{" "}
            ·{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
              WhatsApp
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
