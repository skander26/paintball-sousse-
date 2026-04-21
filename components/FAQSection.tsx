"use client";

import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const FaqAccentBall = dynamic(
  () => import("@/components/3d/FaqAccentBall").then((m) => m.FaqAccentBall),
  { ssr: false },
);

const faqs = [
  {
    q: "What is the minimum group size?",
    a: "Minimum 6 players recommended for the best experience.",
  },
  {
    q: "What age is allowed to play?",
    a: "Players must be 12 years or older. Under 18 requires parental consent.",
  },
  {
    q: "What should I wear?",
    a: "Comfortable clothes you don't mind getting dirty. We provide protective masks and gear.",
  },
  {
    q: "Is paintball safe?",
    a: "Absolutely. All players wear full-face masks and receive safety briefings before every game.",
  },
  {
    q: "How do I book?",
    a: "Call or WhatsApp us at +216 46 209 091 or email paintballsousse@gmail.com.",
  },
  {
    q: "Are there women's special offers?",
    a: "Yes! We run women's promotional events with 20% discounts on selected dates.",
  },
  {
    q: "Do you offer corporate team-building packages?",
    a: "Yes! We offer tailored team-building packages for companies of all sizes.",
  },
];

export function FAQSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#08080f] px-4 py-24 md:px-10">
      <FaqAccentBall />

      <div className="relative z-[1] mx-auto max-w-3xl">
        <h2 className="mb-14 text-center font-display text-5xl tracking-[0.14em] text-white md:text-6xl">
          {t("faq_title")}
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border bg-black-card/70 backdrop-blur-xl transition-colors ${
                  isOpen ? "border-brand-red/70" : "border-white/10"
                }`}
                style={{
                  borderLeftWidth: isOpen ? 4 : 0,
                  borderLeftColor: "#E8001C",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl tracking-wide text-white md:text-2xl">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 shrink-0 text-brand-red transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden border-t border-white/10">
                    <div className="px-6 py-5 font-body leading-relaxed text-muted">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
