'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const TARGET = new Date('2025-12-28T09:00:00')

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function CountdownTimer() {
  const { t } = useI18n()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, TARGET.getTime() - now)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  const items = [
    { v: pad(d), l: t('tournament.days') },
    { v: pad(h), l: t('tournament.hours') },
    { v: pad(m), l: t('tournament.mins') },
    { v: pad(s), l: t('tournament.secs') },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.l}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-4 text-center"
        >
          <div className="text-data-md text-[var(--red)]">{it.v}</div>
          <div className="mt-1 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {it.l}
          </div>
        </div>
      ))}
    </div>
  )
}
