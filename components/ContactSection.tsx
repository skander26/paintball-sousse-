"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import {
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

const ContactMap = dynamic(
  () => import("@/components/ContactMap").then((m) => m.ContactMap),
  { ssr: false, loading: () => <div className="h-[400px] animate-pulse rounded-xl bg-white/5" /> },
);

export function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="bg-black-deep px-4 py-24 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-white/10 bg-black-card/70 p-8 shadow-card backdrop-blur-xl md:p-10"
        >
          <h2 className="font-display text-4xl tracking-[0.12em] text-white md:text-5xl">FIND US & REACH OUT</h2>

          <div className="mt-8 space-y-6 font-body text-lg text-white/90">
            <p>
              <span className="text-brand-red">📍</span> Near Mall of Sousse,
              <br />
              Route Sidi Bou Ali, Kalaa Kebira
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-red px-6 py-3 font-display text-sm uppercase tracking-wider text-white shadow-glow"
              >
                <Phone className="me-2 h-4 w-4" aria-hidden />
                Call
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-green-500/50 bg-green-600/15 px-6 py-3 font-body font-semibold text-green-300"
              >
                WhatsApp
              </a>
            </div>
            <p>
              <span className="text-brand-red">📞</span>{" "}
              <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="hover:text-white">
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <span className="text-brand-red">📧</span>{" "}
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </p>
            <p>
              <span className="text-brand-red">📸</span>{" "}
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                @paintball_sousse
              </a>
            </p>
            <p>
              <span className="text-brand-red">👍</span>{" "}
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Paintball Sousse (Facebook)
              </a>
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-brand-red bg-[rgba(232,0,28,0.06)] p-6 shadow-[0_0_20px_rgba(232,0,28,0.15)]">
            <p className="font-display text-2xl text-white">🎯 WANT TO BOOK?</p>
            <p className="mt-2 font-body text-muted">Head to our tactical reservation system.</p>
            <Link
              href="/reserve"
              className="mt-6 flex min-h-[52px] w-full items-center justify-center bg-brand-red font-display text-xl uppercase tracking-wider text-white shadow-glow"
            >
              ENTER THE ARENA →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="space-y-8"
        >
          <div>
            <h3 className="font-display text-4xl tracking-[0.16em] text-white">{t("contact_find")}</h3>
            <p className="mt-4 max-w-lg font-body text-lg leading-relaxed text-muted">
              Near Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse
            </p>
          </div>

          <div className="h-[400px] overflow-hidden rounded-2xl border border-white/10">
            <ContactMap />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${EMAIL}`}
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60"
            >
              <Mail className="h-5 w-5 text-brand-red" aria-hidden />
              {EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60"
            >
              <Instagram className="h-5 w-5 text-brand-red" aria-hidden />
              @paintball_sousse
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60 sm:col-span-2"
            >
              <Facebook className="h-5 w-5 text-brand-red" aria-hidden />
              Paintball Sousse
            </a>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-green-500/40 bg-green-600/15 px-6 py-4 font-body font-semibold text-green-300 transition hover:bg-green-600/25 sm:w-auto"
          >
            WhatsApp — contact rapide
          </a>
        </motion.div>
      </div>
    </section>
  );
}
