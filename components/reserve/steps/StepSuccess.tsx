'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { gameModes } from '@/data/packages'
import { isFreeForAll } from '@/lib/gameModeConfig'
import { getClassOption, useReservationStore } from '@/store/reservationStore'
import { RedButton } from '@/components/ui/RedButton'
import { ADDRESS_LINES, PHONE_DISPLAY, whatsappHref } from '@/lib/constants'
import { useI18n } from '@/lib/i18n'

export function StepSuccess() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const reset = useReservationStore((s) => s.reset)
  const date = useReservationStore((s) => s.date)
  const timeSlot = useReservationStore((s) => s.timeSlot)
  const gameMode = useReservationStore((s) => s.gameMode)
  const players = useReservationStore((s) => s.players)

  const total = useMemo(
    () =>
      players.reduce((sum, p) => {
        if (!p.classId) return sum
        const opt = getClassOption(p.classId, p.optionIndex)
        return sum + (opt?.price ?? 0)
      }, 0),
    [players],
  )

  const modeLabel = useMemo(() => {
    if (!gameMode) return '—'
    const m = gameModes.find((x) => x.id === gameMode)
    return m ? t(m.nameKey) : '—'
  }, [gameMode, t])

  const formattedDate = useMemo(() => {
    if (!date) return '—'
    const d = new Date(date)
    return d.toLocaleDateString(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-US' : 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [date, locale])

  const waMsg = useMemo(() => {
    const ffa = isFreeForAll(gameMode)
    const lines = ffa
      ? [
          `Paintball Sousse — Réservation`,
          `🎯 ${modeLabel}`,
          `👥 ${players.length} guerriers — pas d'équipes`,
          `Date: ${formattedDate}`,
          `Heure: ${timeSlot}`,
          `Total: ${total} DT`,
        ]
      : [
          `Paintball Sousse — Réservation`,
          `Date: ${formattedDate}`,
          `Heure: ${timeSlot}`,
          `Joueurs: ${players.length}`,
          `Mode: ${modeLabel}`,
          `Total: ${total} DT`,
        ]
    return lines.join('\n')
  }, [formattedDate, timeSlot, players.length, modeLabel, total, gameMode])

  const confetti = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#ffffff' : '#E8001C',
      })),
    [],
  )

  return (
    <div className="container-pb relative max-w-3xl py-16 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        <motion.div
          key="splat"
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="pointer-events-none absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 bg-[var(--red)]"
          style={{
            clipPath:
              'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%, 15% 45%, 45% 15%, 75% 35%, 55% 75%, 25% 85%)',
          }}
        />
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.45 }}>
        <h1 className="text-display-md text-[var(--text-primary)]">🎯 {t('reserve.success.title')}</h1>

        <div className="pb-card-red mx-auto mt-10 max-w-xl p-6 text-left">
          <div className="space-y-2 font-body text-[15px] text-[var(--text-secondary)]">
            <div>
              📅 {formattedDate} — ⏰ {timeSlot}
            </div>
            <div>
              👥 {players.length} joueurs — 💰 {total} DT
            </div>
          </div>
        </div>

        <p className="text-body-md mt-8 text-[var(--text-secondary)]">
          📍 {ADDRESS_LINES.join(', ')}
        </p>
        <p className="text-body-md mt-2 text-[var(--text-secondary)]">📞 {PHONE_DISPLAY}</p>

        <div className="mt-10 flex flex-col gap-3">
          <a
            href={whatsappHref(waMsg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-md bg-[#22C55E] font-display text-[20px] uppercase tracking-[0.08em] text-white shadow-[0_8px_30px_rgba(34,197,94,0.35)]"
          >
            💬 {t('reserve.success.wa')}
          </a>
          <button
            type="button"
            className="min-h-[48px] rounded-md border border-[var(--border)] bg-transparent px-6 font-body text-[14px] font-semibold text-[var(--text-primary)] hover:border-[var(--border-hover)]"
            onClick={() => window.print()}
          >
            🖨 {t('reserve.success.print')}
          </button>
          <button
            type="button"
            className="min-h-[44px] font-body text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => {
              reset()
              router.push('/')
            }}
          >
            ← {t('reserve.success.home')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
