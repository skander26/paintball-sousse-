"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { HeroCharacterSlot } from "@/components/HeroCharacterImage";
import { PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

const PaintballCanvas = dynamic(
  () =>
    import("@/components/3d/PaintballCanvas").then((m) => m.PaintballCanvas),
  { ssr: false },
);

export function HeroSection() {
  const { t } = useI18n();
  const [mobile, setMobile] = useState(false);

  const { scrollY } = useScroll();
  const chevronOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const upd = () => setMobile(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const checkCanvasParent = () => {
      const el = document.querySelector("[data-hero-canvas]");
      if (!el || !(el instanceof HTMLElement)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        el.style.width = "100%";
        el.style.minHeight = "100vh";
      }
    };
    checkCanvasParent();
    window.addEventListener("resize", checkCanvasParent);
    return () => window.removeEventListener("resize", checkCanvasParent);
  }, []);

  return (
    <section
      id="home"
      className="hero-section flex min-h-[100dvh] flex-col justify-center bg-[#050507] px-4 pb-10 pt-[calc(var(--navbar-height)+16px)] md:px-12 lg:pb-24 lg:pt-28"
    >
      <div
        data-hero-canvas
        data-mobile-visible
        className="pointer-events-none absolute inset-0 z-0 min-h-full w-full overflow-hidden"
      >
        <PaintballCanvas mobile={mobile} />
      </div>

      <div className="relative z-[2] mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] lg:items-center lg:gap-10">
        <div className="flex min-w-0 flex-col">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 mb-6 inline-flex w-fit rounded-full border border-brand-red/80 bg-black/40 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.35em] text-white/85 backdrop-blur-md"
          >
            {t("hero_badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="order-2 font-display text-[clamp(3rem,12vw,7.5rem)] leading-[0.92] text-white"
          >
            {t("hero_l1")}
            <br />
            <span className="glitch-text text-brand-red">{t("hero_l2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="order-3 mt-6 max-w-xl font-body text-lg text-muted md:text-xl"
          >
            {t("hero_sub")}
          </motion.p>

          <div className="order-4 my-6 w-full lg:hidden">
            <HeroCharacterSlot className="mx-auto w-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="order-5 mt-0 flex flex-col gap-5 sm:flex-row sm:items-center lg:mt-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="relative inline-flex">
              <span className="pointer-events-none absolute inset-0 animate-pulse rounded-md bg-brand-red/25 blur-xl" aria-hidden />
              <Link
                href="/reserve"
                className="relative inline-flex min-h-[52px] skew-x-[-2deg] items-center justify-center border border-brand-red bg-brand-red px-10 py-4 font-display text-xl uppercase tracking-wide text-white shadow-[0_0_30px_var(--red-glow)] transition hover:shadow-[0_0_36px_var(--red-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <span className="skew-x-[2deg]">{t("hero_cta")} →</span>
              </Link>
            </motion.div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 font-body text-base text-white/85 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            >
              <MessageCircle className="h-5 w-5 text-green-400" aria-hidden />
              <span>
                {t("hero_call")}{" "}
                <strong className="text-white">{PHONE_DISPLAY}</strong>
              </span>
            </a>
          </motion.div>
        </div>

        <div className="relative z-[2] hidden min-h-[280px] lg:flex lg:items-center lg:justify-center">
          <HeroCharacterSlot />
        </div>
      </div>

      <motion.div
        style={{ opacity: chevronOpacity }}
        className="pointer-events-none absolute bottom-10 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-mono uppercase tracking-[0.45em] text-white/55"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          ⌄
        </motion.span>
        {t("scroll_hint")}
      </motion.div>
    </section>
  );
}
