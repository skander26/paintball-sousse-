"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { z } from "zod";
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
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-xl bg-white/5" /> },
);

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  eventType: z.enum([
    "paintball",
    "team",
    "birthday",
    "school",
    "tournament",
  ]),
  groupSize: z.coerce.number().min(1).max(500),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

/** Tailwind has no `bg-black-deep`; use surface tokens + autofill override (Chrome). */
const fieldClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-surface-card px-4 py-3 text-[16px] text-white placeholder:text-muted/60 outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/25 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(18,18,26)] [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]";

export function ContactSection() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      eventType: "paintball",
      groupSize: 8,
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((r) => window.setTimeout(r, 650));
    setSent(true);
  });

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
          <h2 className="font-display text-5xl tracking-[0.14em] text-white md:text-6xl">
            {t("contact_title")}
          </h2>

          {!sent ? (
            <form onSubmit={onSubmit} className="mt-10 space-y-5">
              <div>
                <label className="font-body text-sm font-semibold text-muted">Full Name</label>
                <input
                  {...form.register("fullName")}
                  className={`min-h-[48px] ${fieldClass}`}
                  autoComplete="name"
                />
                {form.formState.errors.fullName && (
                  <p className="mt-2 text-sm text-brand-red">Required</p>
                )}
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-muted">
                  Phone / WhatsApp
                </label>
                <input
                  {...form.register("phone")}
                  inputMode="tel"
                  className={`min-h-[48px] ${fieldClass}`}
                />
                {form.formState.errors.phone && (
                  <p className="mt-2 text-sm text-brand-red">Invalid phone</p>
                )}
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-muted">Email</label>
                <input
                  {...form.register("email")}
                  type="email"
                  className={`min-h-[48px] ${fieldClass}`}
                  autoComplete="email"
                />
                {form.formState.errors.email && (
                  <p className="mt-2 text-sm text-brand-red">Invalid email</p>
                )}
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-muted">Event Type</label>
                <select
                  {...form.register("eventType")}
                  className={`min-h-[48px] cursor-pointer ${fieldClass}`}
                >
                  <option value="paintball">Paintball Game</option>
                  <option value="team">Team Building</option>
                  <option value="birthday">Birthday</option>
                  <option value="school">School Group</option>
                  <option value="tournament">Tournament</option>
                </select>
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-muted">Group Size</label>
                <input
                  {...form.register("groupSize")}
                  type="number"
                  min={1}
                  className={`min-h-[48px] ${fieldClass}`}
                />
                {form.formState.errors.groupSize && (
                  <p className="mt-2 text-sm text-brand-red">Invalid size</p>
                )}
              </div>

              <div>
                <label className="font-body text-sm font-semibold text-muted">Message</label>
                <textarea
                  {...form.register("message")}
                  rows={5}
                  className={`min-h-[120px] resize-y ${fieldClass}`}
                />
                {form.formState.errors.message && (
                  <p className="mt-2 text-sm text-brand-red">Tell us more (min 10 chars)</p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center bg-brand-red px-6 py-4 font-display text-xl uppercase tracking-widest text-white shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
              >
                {t("contact_send")} →
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-12 rounded-3xl border border-brand-red/50 bg-[rgba(232,0,28,0.08)] p-10 text-center font-body text-lg text-white"
              style={{
                clipPath:
                  "polygon(8% 6%, 92% 4%, 98% 40%, 88% 86%, 12% 94%, 3% 48%)",
              }}
            >
              <p className="font-display text-3xl tracking-wide text-brand-red">
                {t("contact_success")}
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="space-y-8"
        >
          <div>
            <h3 className="font-display text-4xl tracking-[0.16em] text-white">
              {t("contact_find")}
            </h3>
            <p className="mt-4 max-w-lg font-body text-lg leading-relaxed text-muted">
              Near Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse
            </p>
          </div>

          <ContactMap />

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60 hover:shadow-[0_0_24px_var(--red-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            >
              <Phone className="h-5 w-5 text-brand-red" aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60 hover:shadow-[0_0_24px_var(--red-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            >
              <Mail className="h-5 w-5 text-brand-red" aria-hidden />
              {EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            >
              <Instagram className="h-5 w-5 text-brand-red" aria-hidden />
              @paintball_sousse
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-black-card/70 px-4 py-3 font-body text-white transition hover:border-brand-red/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            >
              <Facebook className="h-5 w-5 text-brand-red" aria-hidden />
              Paintball Sousse
            </a>
          </div>

          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-green-500/40 bg-green-600/15 px-6 py-4 font-body font-semibold text-green-300 transition hover:bg-green-600/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400"
          >
            WhatsApp rapid booking
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
