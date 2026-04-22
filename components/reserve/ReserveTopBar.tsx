"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useReservationStore } from "@/store/reservationStore";

const LABELS: Record<number, string> = {
  1: "SELECT YOUR DATE",
  2: "ASSEMBLE YOUR SQUAD",
  3: "MISSION BRIEFING",
  4: "MISSION ACCEPTED",
};

export function ReserveTopBar() {
  const router = useRouter();
  const reset = useReservationStore((s) => s.reset);
  const step = useReservationStore((s) => s.step);

  const pct = (step / 4) * 100;

  return (
    <header className="relative z-20 border-b border-white/10 bg-[rgba(5,5,7,0.9)] px-4 py-3 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="font-body text-xs uppercase tracking-wider text-white/70 transition hover:text-white"
            onClick={(e) => {
              if (step !== 4) return;
              e.preventDefault();
              reset();
              router.push("/");
            }}
          >
            ← EXIT MISSION
          </Link>
          <div className="text-center">
            <p className="font-display text-lg tracking-wide text-white md:text-xl">PAINTBALL SOUSSE</p>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-muted">Tactical reservation system</p>
          </div>
          <p className="font-mono text-xs text-[#E8001C] md:text-sm" style={{ fontFamily: "var(--font-orbitron)" }}>
            STEP {step}/4
          </p>
        </div>
        <p className="text-center font-body text-[10px] text-muted/90 md:text-[11px]">{LABELS[step]}</p>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-[#E8001C]"
            style={{
              width: `${pct}%`,
              boxShadow: "4px 0 12px #E8001C",
            }}
            initial={false}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>
    </header>
  );
}
