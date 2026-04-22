'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReservationStore, stepIndex, type ReserveStep } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'

const widths: Record<ReserveStep, string> = {
  calendar: '25%',
  squad: '50%',
  briefing: '75%',
  success: '100%',
}

export function ReserveTopBar() {
  const { t } = useI18n()
  const step = useReservationStore((s) => s.step)
  const idx = stepIndex(step)

  return (
    <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-overlay)]">
      <div className="flex h-14 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="min-h-[44px] font-body text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          ← {t('reserve.quit')}
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="hidden font-display text-[16px] uppercase tracking-[0.08em] text-[var(--text-primary)] sm:inline">
            Paintball Sousse
          </span>
        </div>
        <div className="font-data text-[13px] text-[var(--red)]">
          {t('reserve.step')} {idx}/4
        </div>
      </div>
      <div className="h-[3px] w-full bg-[var(--border)]">
        <div
          className="h-full bg-[var(--red)] transition-[width] duration-500 ease-out"
          style={{
            width: widths[step],
            boxShadow: '2px 0 8px var(--red-glow)',
          }}
        />
      </div>
    </div>
  )
}
