"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION_FAST_S } from "@/lib/constants";

type Props = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "solid" | "outline-gold";
};

export function RedButton({
  children,
  className = "",
  variant = "solid",
  ...rest
}: Props) {
  const base =
    "relative inline-flex min-h-[44px] items-center justify-center skew-x-[-2deg] px-8 py-3 font-display text-lg uppercase tracking-wide transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const styles =
    variant === "solid"
      ? "border border-brand-red bg-brand-red text-white hover:shadow-[0_0_30px_var(--red-glow)] focus-visible:outline-brand-red"
      : "border-2 border-[var(--gold-accent)] bg-transparent text-[var(--gold-accent)] hover:bg-[rgba(255,215,0,0.06)] focus-visible:outline-[var(--gold-accent)]";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: DURATION_FAST_S }}
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      <span className="skew-x-[2deg]">{children}</span>
    </motion.button>
  );
}
