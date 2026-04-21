"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[995] h-1 w-full origin-left bg-brand-red shadow-glow"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
