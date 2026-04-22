"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { useI18n } from "@/lib/i18n";

type LoadingGunProps = {
  progress: number;
};

export function LoadingGun({ progress }: LoadingGunProps) {
  const { t } = useI18n();
  const uid = useId();
  const clipId = `gunClip-${uid}`;
  const gradId = `paintFill-${uid}`;
  const p = Math.min(100, Math.max(0, progress));
  /** Largeur max du remplissage (corps + canon), alignée sur la silhouette */
  const fillW = (p / 100) * 220;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.svg
        width={60}
        height={60}
        viewBox="0 0 60 60"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <circle cx="30" cy="30" r="26" fill="none" stroke="#E8001C" strokeWidth="1.5" opacity={0.8} />
        <circle cx="30" cy="30" r="6" fill="none" stroke="#E8001C" strokeWidth="1.5" />
        <circle cx="30" cy="30" r="2" fill="#E8001C" />
        <line x1="30" y1="4" x2="30" y2="20" stroke="#E8001C" strokeWidth="1.5" />
        <line x1="30" y1="40" x2="30" y2="56" stroke="#E8001C" strokeWidth="1.5" />
        <line x1="4" y1="30" x2="20" y2="30" stroke="#E8001C" strokeWidth="1.5" />
        <line x1="40" y1="30" x2="56" y2="30" stroke="#E8001C" strokeWidth="1.5" />
      </motion.svg>

      <div className="relative h-[80px] w-[min(280px,90vw)]">
        <svg width="280" height="80" viewBox="0 0 280 80" className="absolute left-0 top-0" aria-hidden>
          <rect x="60" y="28" width="140" height="28" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          <rect x="200" y="33" width="72" height="12" rx="6" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          <rect x="268" y="35" width="10" height="8" rx="2" fill="#111" stroke="#444" strokeWidth="1" />
          <ellipse cx="110" cy="26" rx="22" ry="16" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          <rect x="100" y="26" width="20" height="10" fill="#1a1a1a" />
          <ellipse cx="110" cy="24" rx="16" ry="10" fill="none" stroke="#2a2a2a" strokeWidth="1" />
          <line x1="110" y1="14" x2="110" y2="26" stroke="#2a2a2a" strokeWidth="0.8" />
          <path d="M 85 56 L 95 56 L 100 80 L 80 80 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          <path d="M 95 56 Q 110 70 125 56" fill="none" stroke="#333" strokeWidth="1.5" />
          <rect x="106" y="52" width="4" height="12" rx="1" fill="#222" stroke="#444" strokeWidth="0.8" />
          <rect x="60" y="58" width="18" height="10" rx="3" fill="#111" stroke="#333" strokeWidth="1" />
          <rect x="130" y="26" width="60" height="4" rx="1" fill="#222" stroke="#2a2a2a" strokeWidth="0.5" />
          <rect x="104" y="26" width="12" height="8" rx="2" fill="#222" stroke="#333" strokeWidth="0.8" />
        </svg>

        <svg width="280" height="80" viewBox="0 0 280 80" className="absolute left-0 top-0" aria-hidden>
          <defs>
            <clipPath id={clipId}>
              <rect x="60" y="28" width="140" height="28" rx="4" />
              <rect x="200" y="33" width="72" height="12" rx="6" />
              <rect x="268" y="35" width="10" height="8" rx="2" />
              <ellipse cx="110" cy="26" rx="22" ry="16" />
              <rect x="100" y="26" width="20" height="10" />
              <path d="M 85 56 L 95 56 L 100 80 L 80 80 Z" />
              <rect x="60" y="58" width="18" height="10" rx="3" />
            </clipPath>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B0012" />
              <stop offset="70%" stopColor="#E8001C" />
              <stop offset="100%" stopColor="#FF4D5E" />
            </linearGradient>
          </defs>
          <motion.rect
            x="60"
            y="0"
            height="80"
            fill={`url(#${gradId})`}
            clipPath={`url(#${clipId})`}
            initial={{ width: 0 }}
            animate={{ width: fillW }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
          <motion.rect
            x="60"
            y="30"
            height="6"
            rx="2"
            fill="rgba(255,255,255,0.15)"
            clipPath={`url(#${clipId})`}
            initial={{ width: 0 }}
            animate={{ width: fillW }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
        </svg>

        {p >= 95 && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            className="absolute bottom-[-8px] left-[140px] h-3 w-1.5 rounded-b bg-[#E8001C]"
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#E8001C]"
          style={{ fontFamily: "var(--font-orbitron), monospace" }}
        >
          {t("loading")}
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.2em] text-white/30"
          style={{ fontFamily: "var(--font-orbitron), monospace" }}
        >
          {Math.round(p)}%
        </span>
      </div>
    </div>
  );
}
