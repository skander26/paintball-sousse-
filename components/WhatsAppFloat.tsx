"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

export function WhatsAppFloat() {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-6 end-6 z-[500] group">
      <span className="pointer-events-none absolute bottom-[110%] end-0 whitespace-nowrap rounded-lg bg-black/80 px-3 py-2 font-body text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {t("wa_tooltip")}
      </span>
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("wa_tooltip")}
        className="inline-flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-green-600 text-white shadow-[0_12px_40px_rgba(22,163,74,0.45)] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        <MessageCircle className="h-7 w-7" aria-hidden />
      </Link>
    </div>
  );
}
