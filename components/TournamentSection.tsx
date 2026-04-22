"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import { useEffect, useMemo, useState } from "react";
import { TOURNAMENT_END } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

const TournamentBallScene = dynamic(
  () =>
    import("@/components/3d/TournamentBall").then((m) => m.TournamentBallScene),
  { ssr: false },
);

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    const diff = Math.max(0, target.getTime() - now);
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return { days, hours, minutes, seconds };
  }, [now, target]);
}

export function TournamentSection() {
  const { t } = useI18n();
  const cd = useCountdown(TOURNAMENT_END);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const units = [
    { label: "DAYS", value: cd.days },
    { label: "HOURS", value: cd.hours },
    { label: "MINUTES", value: cd.minutes },
    { label: "SECONDS", value: cd.seconds },
  ];

  return (
    <section
      id="tournament"
      className="relative overflow-hidden bg-[#07070c] px-4 py-24 md:px-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 50% -10%, rgba(232,0,28,0.35), transparent 60%)",
        }}
      />

      {!mobile && <TournamentBallScene />}

      <div className="relative z-[2] mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-brand-red px-4 py-1 font-body text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">
            {t("tour_badge")}
          </span>

          <h2 className="mt-8 font-display text-5xl leading-[0.95] text-white md:text-7xl">
            {t("tour_h1")}
            <br />
            <span className="text-brand-red">{t("tour_h2")}</span>
          </h2>

          <p className="mt-5 font-mono text-sm tracking-[0.25em] text-muted">
            {t("tour_sub")}
          </p>

          <p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-muted">
            {t("tour_desc")}
          </p>

          <div className="mt-10 inline-flex flex-col gap-4">
            <div className="inline-flex items-center rounded-xl border-2 border-brand-red px-6 py-4 font-mono text-xl text-white shadow-[0_0_40px_var(--red-glow)]">
              <span className="text-sm uppercase tracking-[0.4em] text-muted">
                {t("tour_price_lbl")}
              </span>
              <span className="ms-6 text-3xl text-brand-red">50 TND</span>
              <span className="ms-2 font-body text-base text-muted">/ person</span>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/reserve"
                className="inline-flex min-h-[52px] items-center justify-center bg-brand-red px-10 py-4 font-display text-xl uppercase tracking-widest text-white shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                {t("tour_register")} →
              </Link>
            </motion.div>

            <p className="font-body text-sm text-muted">{t("tour_small")}</p>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-8">
          <PBIcon
            icon={ICONS.trophy}
            size={56}
            color="var(--gold-accent)"
            className="drop-shadow-[0_0_24px_rgba(255,215,0,0.35)]"
            aria-hidden
          />

          <div className="grid w-full max-w-xl grid-cols-2 gap-4 md:grid-cols-4">
            {units.map((u) => (
              <motion.div
                key={u.label}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-black-card/90 px-4 py-6 text-center shadow-card"
              >
                <p className="font-mono text-4xl text-brand-red md:text-5xl">
                  {String(u.value).padStart(2, "0")}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
                  {u.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
