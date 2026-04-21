"use client";

import { motion } from "framer-motion";
import { STAGGER_CHILD_S } from "@/lib/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: STAGGER_CHILD_S, delayChildren: 0.06 },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

export function SectionTitle({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const chars = title.split("");

  return (
    <div className={`relative mb-12 text-center ${className}`}>
      <motion.h2
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="font-display text-4xl tracking-[0.12em] text-white md:text-6xl"
        aria-label={title}
      >
        {chars.map((c, i) => (
          <motion.span
            key={`${c}-${i}`}
            variants={letter}
            className="inline-block"
            style={{ whiteSpace: c === " " ? "pre" : undefined }}
          >
            {c === " " ? "\u00a0" : c}
          </motion.span>
        ))}
      </motion.h2>
      <div
        className="mx-auto mt-4 h-1 w-40 rounded-full bg-gradient-to-r from-transparent via-brand-red to-transparent"
        aria-hidden
      />
    </div>
  );
}
