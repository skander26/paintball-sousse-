'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { useReservationStore } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

type Slot = { time: string; spots: number; full?: boolean }

const SLOTS: Slot[] = [
  { time: '09:00', spots: 6 },
  { time: '11:00', spots: 4 },
  { time: '14:00', spots: 6, full: true },
  { time: '16:00', spots: 5 },
  { time: '18:00', spots: 3 },
]

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

export function StepCalendar() {
  const { t, locale } = useI18n()
  const setStep = useReservationStore((s) => s.setStep)
  const setDate = useReservationStore((s) => s.setDate)
  const setTimeSlot = useReservationStore((s) => s.setTimeSlot)
  const date = useReservationStore((s) => s.date)
  const timeSlot = useReservationStore((s) => s.timeSlot)

  const [cursor, setCursor] = useState(() => new Date(2025, 10, 1))

  const monthLabel = useMemo(
    () =>
      cursor.toLocaleString(locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-US' : 'fr-FR', {
        month: 'long',
        year: 'numeric',
      }),
    [cursor, locale],
  )

  const firstDow = startOfMonth(cursor).getDay()
  const dim = daysInMonth(cursor)
  const cells = useMemo(() => {
    const arr: (number | null)[] = []
    for (let i = 0; i < firstDow; i++) arr.push(null)
    for (let d = 1; d <= dim; d++) arr.push(d)
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [cursor, firstDow, dim])

  const today = new Date()
  const isPast = (day: number) => {
    const test = new Date(cursor.getFullYear(), cursor.getMonth(), day)
    test.setHours(0, 0, 0, 0)
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return test < t0
  }

  const unavailable = (day: number) => day % 7 === 2 || day % 11 === 0

  const selectDay = (day: number) => {
    if (isPast(day) || unavailable(day)) return
    sounds.click()
    const iso = new Date(cursor.getFullYear(), cursor.getMonth(), day).toISOString().slice(0, 10)
    setDate(iso)
    setTimeSlot(null)
  }

  const canConfirm = Boolean(date && timeSlot)

  return (
    <div className="container-pb max-w-4xl py-10">
      <h2 className="text-display-sm text-[var(--text-primary)]">{t('reserve.cal.title')}</h2>
      <p className="text-body-md mt-3 text-[var(--text-secondary)]">{t('reserve.cal.sub')}</p>

      <div className="mt-8 pb-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-raised)]"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Mois précédent"
          >
            <PBIcon name="arrowLeft" />
          </button>
          <div className="font-display text-[clamp(22px,4vw,28px)] uppercase text-[var(--text-primary)]">
            {monthLabel}
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-raised)]"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Mois suivant"
          >
            <PBIcon name="arrowRight" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cursor.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-7 gap-1 text-center font-body text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="h-11" />
                const iso = new Date(cursor.getFullYear(), cursor.getMonth(), day).toISOString().slice(0, 10)
                const selected = date === iso
                const past = isPast(day)
                const unav = unavailable(day)
                const isToday =
                  day === today.getDate() &&
                  cursor.getMonth() === today.getMonth() &&
                  cursor.getFullYear() === today.getFullYear()
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={past || unav}
                    onClick={() => selectDay(day)}
                    className={`flex h-11 w-full items-center justify-center rounded-md border text-[14px] font-semibold transition-transform ${
                      selected
                        ? 'border-transparent bg-[var(--red)] text-white shadow-[0_0_18px_var(--red-glow)]'
                        : past || unav
                          ? 'cursor-not-allowed border-transparent bg-transparent opacity-25 line-through'
                          : 'border-[var(--border)] bg-[var(--bg-surface)] hover:scale-105 hover:border-[var(--red)]'
                    } ${isToday && !selected ? 'ring-1 ring-white/40' : ''}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {date ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {SLOTS.map((s) => {
              const active = timeSlot === s.time
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.full}
                  onClick={() => {
                    if (s.full) return
                    sounds.click()
                    setTimeSlot(s.time)
                  }}
                  className={`min-w-[100px] rounded-md border px-3 py-3 text-center transition-colors ${
                    s.full
                      ? 'cursor-not-allowed opacity-30'
                      : active
                        ? 'border-transparent bg-[var(--red)] text-white'
                        : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--red)]'
                  }`}
                >
                  <div className="font-data text-[18px]">{s.time}</div>
                  <div className="mt-1 font-body text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    {s.full ? 'COMPLET' : `${s.spots} places`}
                  </div>
                </button>
              )
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {canConfirm ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8"
          >
            <RedButton
              onClick={() => {
                sounds.confirm()
                setStep('squad', 1)
              }}
              className="w-full sm:w-auto"
            >
              {t('reserve.cal.confirm')} →
            </RedButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
