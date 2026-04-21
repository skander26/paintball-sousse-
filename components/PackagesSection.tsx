"use client";

import { motion } from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { RedButton } from "@/components/ui/RedButton";

function TiltCard({
  children,
  featured,
}: {
  children: React.ReactNode;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rx: 0, ry: 0 });

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({ rx: py * -10, ry: px * 12 });
  };

  const onLeave = () => setStyle({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: style.rx,
        rotateY: style.ry,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl border bg-black-card/90 p-8 shadow-card backdrop-blur-xl transition-shadow ${
        featured
          ? "border-[var(--gold-accent)] shadow-[0_0_60px_rgba(255,215,0,0.12)] lg:scale-[1.05]"
          : "border-white/10"
      }`}
    >
      {children}
    </motion.div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export function PackagesSection() {
  const { t } = useI18n();

  return (
    <section
      id="packages"
      className="relative overflow-hidden px-4 py-24 md:px-10"
      style={{
        clipPath: "polygon(0 0, 100% 6%, 100% 94%, 0 100%)",
        background:
          "linear-gradient(145deg, #050507 0%, #0d0d12 55%, #12121a 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[120%] w-[60%] rotate-12 bg-brand-red/10"
        style={{ clipPath: "polygon(20% 0, 100% 0, 80% 100%, 0 100%)" }}
      />

      <div className="relative z-[1] mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-16 text-center font-display text-5xl tracking-[0.14em] text-white md:text-6xl"
        >
          {t("pack_title")}
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-3 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="order-2 lg:order-1"
          >
            <TiltCard>
              <p className="font-display text-2xl tracking-wide text-white">
                {t("pack_group")}
              </p>
              <p className="mt-6 font-mono text-5xl text-brand-red md:text-[56px]">
                35 <span className="text-lg text-white">TND</span>
              </p>
              <p className="mt-2 font-body text-muted">{t("pack_per")}</p>
              <ul className="mt-8 space-y-3 font-body text-muted">
                {[
                  "Field fees & ref",
                  "Standard kit",
                  "Safety briefing",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <RedButton type="button" className="w-full">
                  {t("nav_book")}
                </RedButton>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0, ease }}
            className="order-1 lg:order-2"
          >
            <TiltCard featured>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-brand-red px-5 py-1 font-body text-xs font-bold uppercase tracking-widest text-white">
                {t("popular")}
              </div>
              <p className="font-display text-2xl tracking-wide text-white">
                {t("pack_tournament")}
              </p>
              <p className="mt-6 font-mono text-6xl text-white md:text-[64px]">
                50 <span className="text-lg text-white/80">TND</span>
              </p>
              <p className="mt-2 font-body text-muted">{t("pack_per")}</p>
              <ul className="mt-8 space-y-3 font-body text-muted">
                {[
                  "Extended match time",
                  "Competitive brackets",
                  "Staff + medic on field",
                  "Victory podium photos",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--gold-accent)]" />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <RedButton variant="outline-gold" type="button" className="w-full">
                  {t("join")}
                </RedButton>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="order-3"
          >
            <TiltCard>
              <div className="inline-flex rounded-full border border-brand-red px-4 py-1 font-body text-xs font-semibold uppercase tracking-widest text-brand-red">
                {t("special")}
              </div>
              <p className="mt-5 font-display text-2xl tracking-wide text-white">
                {t("pack_women")}
              </p>
              <p className="mt-4 font-body text-sm font-semibold text-muted">
                {t("discount")}
              </p>
              <div className="mt-6 flex items-end gap-4">
                <span className="font-mono text-3xl text-muted line-through">40 TND</span>
                <span className="font-mono text-5xl text-brand-red">32 TND</span>
              </div>
              <p className="mt-2 font-body text-muted">{t("pack_per")}</p>
              <div className="mt-10">
                <RedButton type="button" className="w-full">
                  {t("claim")}
                </RedButton>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
