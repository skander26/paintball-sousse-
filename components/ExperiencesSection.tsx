"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui/SectionTitle";

const ExperienceCharacters = dynamic(
  () =>
    import("@/components/3d/ExperienceCharacters").then(
      (m) => m.ExperienceCharacters,
    ),
  { ssr: false },
);

const items = [
  { icon: "🎯", title: "Paintball Games" },
  { icon: "🤝", title: "Team Building" },
  { icon: "🎂", title: "Private Events" },
  { icon: "🏫", title: "School & Youth" },
  { icon: "👨‍👩‍👧", title: "Family Packages" },
  { icon: "🌿", title: "Outdoor Adventure" },
] as const;

const copy: Record<string, string> = {
  "Paintball Games": "Full-throttle matches, objective games, and field control for all levels.",
  "Team Building": "Custom corporate programs to align your teams under pressure and fun.",
  "Private Events": "Birthdays, bachelor/ette, and private field time with a dedicated ref.",
  "School & Youth": "Supervised games for students with extra focus on safety and guidance.",
  "Family Packages": "Beginner-friendly sessions for families that want to start together.",
  "Outdoor Adventure": "Open-air field, natural cover, and the Sousse sun on your mask.",
};

export function ExperiencesSection() {
  const { t } = useI18n();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  return (
    <section
      id="experiences"
      className="relative overflow-hidden bg-transparent px-4 py-24 md:px-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          transform: "translateZ(0)",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(232,0,28,0.35), transparent 55%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-7xl">
        <SectionTitle title={t("exp_title")} />

        {!mobile && (
          <div className="relative mb-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <ExperienceCharacters mobile={mobile} />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              data-exp-card
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-card backdrop-blur-xl transition-colors hover:border-brand-red/70 hover:bg-[rgba(232,0,28,0.05)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  clipPath:
                    "polygon(25% 10%, 75% 8%, 92% 35%, 85% 78%, 55% 94%, 18% 82%, 8% 48%)",
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(232,0,28,0.35), transparent 65%)",
                }}
              />
              <div className="mb-5 text-5xl">{item.icon}</div>
              <h3 className="font-display text-2xl tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-muted">
                {copy[item.title]}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
