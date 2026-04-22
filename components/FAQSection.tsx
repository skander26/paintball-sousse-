"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import type { TranslationKey } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";

const FaqAccentBall = dynamic(
  () => import("@/components/3d/FaqAccentBall").then((m) => m.FaqAccentBall),
  { ssr: false },
);

const FAQ_KEYS: { q: TranslationKey; a: TranslationKey }[] = [
  { q: "faq_item_0_q", a: "faq_item_0_a" },
  { q: "faq_item_1_q", a: "faq_item_1_a" },
  { q: "faq_item_2_q", a: "faq_item_2_a" },
  { q: "faq_item_3_q", a: "faq_item_3_a" },
  { q: "faq_item_4_q", a: "faq_item_4_a" },
  { q: "faq_item_5_q", a: "faq_item_5_a" },
  { q: "faq_item_6_q", a: "faq_item_6_a" },
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
          {FAQ_KEYS.map((keys, idx) => {
            const isOpen = open === idx;
            const q = t(keys.q);
            const a = t(keys.a);
            return (
              <div
                key={keys.q}
                className={`rounded-2xl border bg-black-card/70 backdrop-blur-xl transition-colors ${
                  isOpen
                    ? "border-brand-red/70 border-s-4 border-s-[#E8001C]"
                    : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red md:px-6 md:py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[15px] tracking-wide text-white md:text-2xl">
                    {q}
                  </span>
                  <PBIcon
                    icon={ICONS.chevronDown}
                    size={22}
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-5 py-4 font-body text-[15px] leading-relaxed text-muted md:px-6 md:text-base">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
