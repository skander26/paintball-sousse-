"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DURATION_NORMAL_S } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";

const NAV = [
  { href: "#home", key: "nav_home" as const },
  { href: "#experiences", key: "nav_exp" as const },
  { href: "#arsenal", key: "nav_pack" as const },
  { href: "#tournament", key: "nav_tour" as const },
  { href: "#gallery", key: "nav_gal" as const },
  { href: "#contact", key: "nav_contact" as const },
];

export function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cycleLocale = (l: Locale) =>
    setLocale(l === "en" ? "fr" : l === "fr" ? "ar" : "en");

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: solid ? "rgba(5,5,7,0.95)" : "rgba(5,5,7,0)",
          backdropFilter: solid ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: DURATION_NORMAL_S }}
        className="fixed left-0 right-0 top-0 z-[1000] border-b border-transparent"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link
            href="#home"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            aria-label={t("brand")}
          >
            <Image src="/logo.svg" alt="" width={44} height={44} priority />
            <span className="font-display text-xl tracking-[0.18em] text-white md:text-2xl">
              {t("brand")}
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="nav-drip font-body text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:text-white"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {(["en", "fr", "ar"] as Locale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`min-h-[36px] min-w-[36px] rounded-full px-2 font-mono text-[11px] uppercase transition ${
                    locale === l
                      ? "bg-brand-red text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  aria-pressed={locale === l}
                  aria-label={`Language ${l}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/reserve"
                className="skew-x-[-2deg] inline-block bg-brand-red px-6 py-3 font-display text-sm uppercase tracking-wider text-white shadow-glow transition hover:shadow-[0_0_36px_var(--red-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <span className="skew-x-[2deg] inline-block">{t("nav_book")}</span>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => cycleLocale(locale)}
              className="min-h-[44px] min-w-[44px] rounded-full border border-white/15 px-3 font-mono text-xs uppercase text-white"
              aria-label="Cycle language"
            >
              {locale}
            </button>
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 text-white"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              {open ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] bg-black/95 lg:hidden"
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(232,0,28,0.15) 0 2px, transparent 2px 14px)",
              }}
              aria-hidden
            />
            <div className="relative flex h-full flex-col justify-center px-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-display text-3xl tracking-[0.16em] text-white"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/reserve"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center bg-brand-red px-6 py-3 font-display text-xl uppercase tracking-widest text-white"
                >
                  {t("nav_book")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
