'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  onNavigate?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  size?: 'md' | 'lg'
}

export function RedButton({
  children,
  href,
  onClick,
  onNavigate,
  className = '',
  type = 'button',
  disabled,
  size = 'md',
}: Props) {
  const h = size === 'lg' ? 'min-h-[60px] px-12 text-[clamp(18px,3vw,24px)]' : 'min-h-[52px] px-8 text-[clamp(16px,2.2vw,20px)]'
  const base =
    `inline-flex items-center justify-center rounded-[6px] bg-[var(--red)] font-display uppercase tracking-[0.08em] text-white shadow-[0_4px_24px_var(--red-glow)] transition-shadow ${h} ${className}`

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.03 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
  }

  if (href) {
    const full = className.includes('w-full')
    return (
      <motion.div {...motionProps} className={full ? `block w-full ${className}` : `inline-flex ${className}`}>
        <Link
          href={href}
          className={`${base} ${full ? 'w-full justify-center' : ''}`}
          onClick={() => {
            onNavigate?.()
            onClick?.()
          }}
        >
          {children}
        </Link>
      </motion.div>
    )
  }

  const full = className.includes('w-full')
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...motionProps}
      className={`${base} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${full ? 'w-full justify-center' : ''}`}
    >
      {children}
    </motion.button>
  )
}
