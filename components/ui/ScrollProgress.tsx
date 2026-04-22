'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.15 })

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-[var(--red)]"
      style={{
        scaleX,
        boxShadow: '0 0 12px var(--red-glow)',
      }}
    />
  )
}
