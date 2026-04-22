"use client";

import Image from "next/image";
import Link from "next/link";
import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import {
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
} from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative overflow-hidden border-t border-[rgba(232,0,28,0.2)] bg-[rgba(5,5,7,0.95)] px-4 py-16 backdrop-blur-sm md:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 footer-sweep opacity-40"
        style={{
          background:
            "linear-gradient(110deg, transparent 0%, rgba(232,0,28,0.22) 45%, transparent 70%)",
          backgroundSize: "220% 100%",
        }}
      />

      <div className="relative z-[1] mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={48} height={48} />
            <span className="font-display text-xl tracking-[0.18em]">
              {t("brand")}
            </span>
          </div>
          <p className="mt-5 max-w-xs font-body text-muted">{t("tagline")}</p>
          <div className="mt-6 flex gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 text-white transition hover:border-brand-red hover:text-brand-red"
            >
              <PBIcon icon={ICONS.instagram} size={20} />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 text-white transition hover:border-brand-red hover:text-brand-red"
            >
              <PBIcon icon={ICONS.facebook} size={20} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-display text-lg tracking-wide text-white">{t("footer_links")}</p>
          <ul className="mt-5 space-y-3 font-body text-muted">
            {[
              ["#home", "nav_home"],
              ["#experiences", "nav_exp"],
              ["#arsenal", "nav_pack"],
              ["#tournament", "nav_tour"],
              ["#gallery", "nav_gal"],
              ["#contact", "nav_contact"],
            ].map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {t(key as "nav_home")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-lg tracking-wide text-white">{t("footer_services")}</p>
          <ul className="mt-5 space-y-3 font-body text-muted">
            {[
              "Paintball",
              "Team Building",
              "Events",
              "School Groups",
              "Family Packages",
            ].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-lg tracking-wide text-white">{t("footer_contact")}</p>
          <ul className="mt-5 space-y-3 font-body text-muted">
            <li>Kalaa Kebira · Route Sidi Bou Ali</li>
            <li>
              <a className="hover:text-white" href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`}>
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </li>
            <li>Open weekends · bookings daily</li>
          </ul>
        </div>
      </div>

      <div className="relative z-[1] mx-auto mt-14 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-white/10 pt-10 font-body text-sm text-muted md:flex-row md:items-center">
        <p>{t("footer_rights")}</p>
        <p>{t("footer_made")}</p>
      </div>
    </footer>
  );
}
