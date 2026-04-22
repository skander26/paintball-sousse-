'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PBIcon } from '@/components/ui/PBIcon'
import { whatsappHref } from '@/lib/constants'

export function WhatsAppFloat() {
  return (
    <motion.div
      className="fixed bottom-6 right-5 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
    >
      <Link
        href={whatsappHref('Bonjour Paintball Sousse 👋')}
        target="_blank"
        rel="noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        aria-label="WhatsApp"
      >
        <PBIcon name="whatsapp" className="text-3xl" />
      </Link>
    </motion.div>
  )
}
