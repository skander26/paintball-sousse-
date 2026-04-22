"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { useReservationStore } from "@/store/reservationStore";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/constants";

function buildWhatsAppBody(): string {
  const s = useReservationStore.getState();
  const date = s.selectedDate;
  const time = s.selectedTime;
  const players = s.players;
  const total = s.getTotalCost();
  const red = s.getRedTeam();
  const blue = s.getBlueTeam();
  const mode = s.getGameModeLabel();

  const dStr = date
    ? date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";

  const redTotal = red.reduce((x, p) => x + p.price, 0);
  const blueTotal = blue.reduce((x, p) => x + p.price, 0);

  const redLines = red.map((p) => `  • ${p.name || "Joueur"} — ${p.className} · ${p.balls} billes · ${p.price} TND`).join("\n");
  const blueLines = blue.map((p) => `  • ${p.name || "Joueur"} — ${p.className} · ${p.balls} billes · ${p.price} TND`).join("\n");

  return `🎯 RÉSERVATION — PAINTBALL SOUSSE

📅 Date : ${dStr}
⏰ Heure : ${time ?? "—"}
🎮 Mode : ${mode}
👥 Joueurs : ${players.length}

🔴 ÉQUIPE ROUGE (${red.length} joueurs) :
${redLines}
Total équipe rouge : ${redTotal} TND

🔵 ÉQUIPE BLEUE (${blue.length} joueurs) :
${blueLines}
Total équipe bleue : ${blueTotal} TND

💰 TOTAL : ${total} TND
(Paiement sur place — aucune carte requise)

Merci de confirmer ma réservation ! 🎯`;
}

function downloadIcs() {
  const s = useReservationStore.getState();
  const date = s.selectedDate;
  const time = s.selectedTime ?? "11:00";
  if (!date) return;
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hh, mm, 0, 0);
  const avg = s.getMissionAvgDurationMinutes() || 120;
  const end = new Date(start.getTime() + avg * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paintball Sousse//FR",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "SUMMARY:Paintball Sousse — Mission",
    "DESCRIPTION:Session réservée — paiement sur place",
    "LOCATION:Route Sidi Bou Ali, Kalaa Kebira (près Mall de Sousse)",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "paintball-sousse-mission.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function StepSuccess() {
  const router = useRouter();
  const reset = useReservationStore((s) => s.reset);
  const [showSplat, setShowSplat] = useState(true);
  const selectedDate = useReservationStore((s) => s.selectedDate);
  const selectedTime = useReservationStore((s) => s.selectedTime);
  const players = useReservationStore((s) => s.players);
  const getTotalCost = useReservationStore((s) => s.getTotalCost);

  const total = getTotalCost();
  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(buildWhatsAppBody())}`;

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="relative z-10 mx-auto min-h-[70vh] max-w-lg px-4 pb-24 pt-12">
      {showSplat && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#E8001C]"
          initial={{ scale: 0, opacity: 0.95 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setShowSplat(false)}
          style={{
            borderRadius: "40% 60% 55% 45% / 45% 50% 50% 55%",
          }}
        />
      )}

      <div className="reserve-confetti no-print pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="no-print relative rounded-2xl border border-white/10 bg-[#12121A]/95 p-8 text-center"
      >
        <h2 className="font-display text-4xl text-white md:text-5xl">🎯 MISSION ACCEPTED 🎯</h2>
        <p className="mt-4 font-body text-lg text-muted">Your reservation is confirmed!</p>

        <div className="mt-8 space-y-3 text-left font-body text-white/90">
          <p>📅 {dateLabel}</p>
          <p>⏰ {selectedTime ?? "—"}</p>
          <p>👥 {players.length} joueurs</p>
          <p className="font-mono text-xl text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
            💰 {total} TND (paiement sur place)
          </p>
          <p className="text-muted">📍 Près du Mall de Sousse, Route Sidi Bou Ali, Kalaa Kebira</p>
          <p className="text-muted">📞 Questions ? {PHONE_DISPLAY}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadIcs();
            }}
            className="block w-full rounded-xl border border-white/25 py-3 font-display text-lg text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📱 SAVE TO CALENDAR
          </motion.a>
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-[#25D366] py-4 font-display text-xl text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💬 CONFIRM ON WHATSAPP →
          </motion.a>
          <motion.button
            type="button"
            onClick={() => window.print()}
            className="w-full rounded-xl border border-[#E8001C]/50 py-3 font-body text-[#E8001C]"
          >
            PRINT MISSION BRIEFING
          </motion.button>
          <Link
            href="/"
            className="block w-full rounded-xl py-3 font-body text-white/80 underline underline-offset-4"
            onClick={(e) => {
              e.preventDefault();
              reset();
              router.push("/");
            }}
          >
            ← BACK TO HOME
          </Link>
        </div>
      </motion.div>

      <div className="hidden print:block print:text-black">
        <h1 className="font-display text-3xl">Paintball Sousse</h1>
        <p className="mt-4 font-body">Mission confirmée</p>
        <p>
          {dateLabel} — {selectedTime}
        </p>
        <p>
          {players.length} joueurs — {total} TND
        </p>
        <p className="mt-4">Présentez ce document sur place.</p>
        <p className="mt-6 font-mono text-sm">https://maps.google.com/?q=35.835,10.602</p>
      </div>
    </div>
  );
}
