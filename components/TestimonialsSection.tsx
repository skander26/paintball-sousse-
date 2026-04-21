"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const slides = [
  {
    quote:
      "Pure adrenaline — refs were strict, gear was spotless. Best afternoon we had in Sousse.",
    name: "Youssef M.",
    initials: "YM",
  },
  {
    quote:
      "Our company retreat finally felt exciting. Communication, tactics, and laughter non-stop.",
    name: "Sarra K.",
    initials: "SK",
  },
  {
    quote:
      "Friendly staff, insane energy, and a field that feels cinematic. We'll be back.",
    name: "Omar H.",
    initials: "OH",
  },
];

export function TestimonialsSection() {
  const { t } = useI18n();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-surface px-4 py-24 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-12 font-display text-5xl tracking-[0.14em] text-white md:text-6xl">
          {t("testi_title")}
        </h2>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[i].name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-white/10 bg-black-card/80 p-10 shadow-card backdrop-blur-xl"
            >
              <div className="mx-auto mb-8 flex justify-center gap-2" aria-hidden>
                {Array.from({ length: 5 }).map((_, k) => (
                  <span key={k} className="text-brand-red">
                    ★
                  </span>
                ))}
              </div>

              <p className="font-body text-lg italic leading-relaxed text-muted md:text-xl">
                “{slides[i].quote}”
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/25 font-mono font-bold text-brand-red">
                  {slides[i].initials}
                </div>
                <div className="text-start">
                  <p className="font-body text-lg font-bold text-white">{slides[i].name}</p>
                  <p className="font-body text-sm text-muted">Paintball Sousse Player</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-3 w-3 rounded-full transition ${
                idx === i ? "bg-brand-red" : "bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
