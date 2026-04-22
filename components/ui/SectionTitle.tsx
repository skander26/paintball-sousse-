'use client'

import { motion } from 'framer-motion'

type Props = {
  label: string
  title: string
  subtitle?: string
  id?: string
}

export function SectionTitle({ label, title, subtitle, id }: Props) {
  return (
    <div id={id} className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.35 }}
        className="pb-label mb-3"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="text-display-md text-[var(--text-primary)]"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-body-md mt-4 text-[var(--text-secondary)]"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </div>
  )
}
