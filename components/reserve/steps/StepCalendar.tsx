'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { useReservationStore } from '@/store/reservationStore'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

type Slot = { time: string; duration: string; spots: number; available: boolean }

const TIME_SLOTS: Slot[] = [
  { time: '09:00', duration: '~2 HRS', spots: 6, available: true },
  { time: '11:00', duration: '~2 HRS', spots: 6, available: true },
  { time: '13:00', duration: '~2 HRS', spots: 6, available: true },
  { time: '15:00', duration: '~2 HRS', spots: 4, available: true },
  { time: '17:00', duration: '~2 HRS', spots: 6, available: false },
]

type DayState = 'empty' | 'past' | 'full' | 'available' | 'selected'

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function parseISODateLocal(iso: string | null): Date | null {
  if (!iso) return null
  const [y, m, day] = iso.split('-').map(Number)
  if (!y || !m || !day) return null
  return new Date(y, m - 1, day)
}

function toISOLocal(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function mondayPad(year: number, month: number) {
  const dow = new Date(year, month, 1).getDay()
  return (dow + 6) % 7
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const pad = mondayPad(year, month)
  const dim = daysInMonth(year, month)
  const cells: (Date | null)[] = []
  for (let i = 0; i < pad; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function isFullDate(d: Date): boolean {
  return (d.getDate() + d.getMonth()) % 6 === 0
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const cardShell = {
  background: 'rgba(18, 17, 22, 0.90)' as const,
  backdropFilter: 'blur(16px)' as const,
  WebkitBackdropFilter: 'blur(16px)' as const,
  border: '1px solid rgba(255,255,255,0.08)' as const,
  borderRadius: '14px' as const,
}

export function StepCalendar() {
  const { t, locale } = useI18n()
  const setStep = useReservationStore((s) => s.setStep)
  const setSquadPhase = useReservationStore((s) => s.setSquadPhase)
  const setDate = useReservationStore((s) => s.setDate)
  const setTimeSlot = useReservationStore((s) => s.setTimeSlot)
  const date = useReservationStore((s) => s.date)
  const timeSlot = useReservationStore((s) => s.timeSlot)

  const today = useMemo(() => new Date(), [])
  const today0 = startOfDay(today)

  const [currentMonth, setCurrentMonth] = useState(() => {
    const stored = parseISODateLocal(useReservationStore.getState().date)
    if (stored) return stored.getMonth()
    return new Date().getMonth()
  })
  const [currentYear, setCurrentYear] = useState(() => {
    const stored = parseISODateLocal(useReservationStore.getState().date)
    if (stored) return stored.getFullYear()
    return new Date().getFullYear()
  })

  const selectedDate = parseISODateLocal(date)
  const selectedISO = date

  const monthYearLabel = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1)
    const loc = locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-US' : 'fr-FR'
    const raw = d.toLocaleString(loc, { month: 'long', year: 'numeric' })
    if (locale === 'ar') return raw
    return raw.toLocaleUpperCase(loc)
  }, [currentMonth, currentYear, locale])

  const isPrevDisabled =
    currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const clearIfSelectionOutsideView = useCallback(
    (nextMonth: number, nextYear: number) => {
      const sel = parseISODateLocal(useReservationStore.getState().date)
      if (sel && (sel.getMonth() !== nextMonth || sel.getFullYear() !== nextYear)) {
        setDate(null)
        setTimeSlot(null)
      }
    },
    [setDate, setTimeSlot],
  )

  const goToPrevMonth = () => {
    if (isPrevDisabled) return
    sounds.click()
    if (currentMonth === 0) {
      const y = currentYear - 1
      const m = 11
      setCurrentMonth(m)
      setCurrentYear(y)
      clearIfSelectionOutsideView(m, y)
    } else {
      const m = currentMonth - 1
      setCurrentMonth(m)
      clearIfSelectionOutsideView(m, currentYear)
    }
  }

  const goToNextMonth = () => {
    sounds.click()
    if (currentMonth === 11) {
      const y = currentYear + 1
      const m = 0
      setCurrentMonth(m)
      setCurrentYear(y)
      clearIfSelectionOutsideView(m, y)
    } else {
      const m = currentMonth + 1
      setCurrentMonth(m)
      clearIfSelectionOutsideView(m, currentYear)
    }
  }

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth],
  )

  const getDayState = useCallback(
    (day: Date | null): DayState => {
      if (!day) return 'empty'
      const d0 = startOfDay(day)
      if (d0 < today0) return 'past'
      if (isFullDate(day)) return 'full'
      if (selectedDate && isSameDay(day, selectedDate)) return 'selected'
      return 'available'
    },
    [selectedDate, today0],
  )

  const dowKeys = [
    'reserve.cal.dow.0',
    'reserve.cal.dow.1',
    'reserve.cal.dow.2',
    'reserve.cal.dow.3',
    'reserve.cal.dow.4',
    'reserve.cal.dow.5',
    'reserve.cal.dow.6',
  ] as const

  const formatLockedDate = useCallback(
    (d: Date) => {
      const loc = locale === 'ar' ? 'ar-TN' : locale === 'en' ? 'en-US' : 'fr-FR'
      return d.toLocaleDateString(loc, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    },
    [locale],
  )

  const handleDayClick = (day: Date) => {
    const state = getDayState(day)
    if (state !== 'available') return
    sounds.click()
    setDate(toISOLocal(day))
    setTimeSlot(null)
  }

  const handleSlotClick = (slot: Slot) => {
    if (!slot.available) return
    sounds.click()
    setTimeSlot(slot.time)
  }

  const handleProceed = () => {
    sounds.confirm()
    setSquadPhase('mode')
    setStep('squad', 1)
  }

  const slotDurationLabel = t('reserve.cal.slotDuration')

  return (
    <div
      className="w-full min-w-0 overflow-x-hidden"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px clamp(16px, 4vw, 48px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* MISSION INTEL — full width */}
      <div style={{ ...cardShell, padding: '18px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
            fontSize: '22px',
            color: '#F2F0F5',
            letterSpacing: '0.06em',
            marginBottom: '4px',
          }}
        >
          {t('reserve.cal.intelTitle')}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body), Rajdhani, sans-serif',
            fontSize: '15px',
            color: '#A09AAD',
          }}
        >
          {t('reserve.cal.intelSub')}
        </div>
      </div>

      {/* Two columns: calendar | slots + proceed */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[60%_40%] lg:items-start">
        {/* LEFT — Calendar */}
        <div style={{ ...cardShell, padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={isPrevDisabled}
              aria-label={locale === 'en' ? 'Previous month' : 'Mois précédent'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: isPrevDisabled ? '#3a3a4a' : '#F2F0F5',
                cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ←
            </button>
            <div
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '26px',
                color: '#F2F0F5',
                letterSpacing: '0.08em',
                textAlign: 'center',
              }}
            >
              {monthYearLabel}
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label={locale === 'en' ? 'Next month' : 'Mois suivant'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#F2F0F5',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              →
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginBottom: '10px',
            }}
          >
            {dowKeys.map((key) => (
              <div
                key={key}
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: '#635D72',
                  padding: '6px 0',
                }}
              >
                {t(key)}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                }}
              >
                {calendarDays.map((day, index) => (
                  <CalendarDayCell
                    key={day ? toISOLocal(day) : `e-${index}`}
                    day={day}
                    state={getDayState(day)}
                    today={today}
                    openLabel={t('reserve.cal.open')}
                    fullLabel={t('reserve.cal.full')}
                    onSelect={handleDayClick}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — slots + proceed (hidden on mobile until date chosen) */}
        <div className={selectedISO ? 'flex min-h-0 flex-col gap-4' : 'hidden min-h-0 flex-col gap-4 lg:flex'}>
          <div
            style={{
              ...cardShell,
              padding: '24px',
              flex: 1,
              minHeight: 0,
            }}
          >
            {!selectedISO ? (
              <div
                className="hidden flex-col items-center justify-center gap-3 text-[#635D72] lg:flex"
                style={{ minHeight: '200px' }}
              >
                <div style={{ fontSize: '32px', opacity: 0.4 }} aria-hidden>
                  📅
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                    fontSize: '15px',
                    textAlign: 'center',
                    color: '#635D72',
                  }}
                >
                  {t('reserve.cal.pickDateHint1')}
                  <br />
                  {t('reserve.cal.pickDateHint2')}
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: '#635D72',
                    marginBottom: '14px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('reserve.cal.slotsLabel')}
                </div>
                <div className="flex flex-row gap-2.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] lg:flex-col lg:overflow-visible lg:pb-0">
                  {TIME_SLOTS.map((slot) => {
                    const s = { ...slot, duration: slotDurationLabel }
                    const active = timeSlot === s.time
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!s.available}
                        onClick={() => handleSlotClick(s)}
                        className="flex min-h-[44px] min-w-[90px] shrink-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-[10px] transition-all lg:min-h-0 lg:min-w-0 lg:w-full lg:flex-row lg:items-center lg:justify-between lg:gap-0"
                        style={{
                          padding: '14px 18px',
                          cursor: s.available ? 'pointer' : 'not-allowed',
                          opacity: !s.available ? 0.4 : 1,
                          background: active ? '#E8001C' : 'rgba(255,255,255,0.04)',
                          border:
                            active ? '1.5px solid #E8001C' : '1px solid rgba(255,255,255,0.09)',
                          boxShadow: active ? '0 0 18px rgba(232,0,28,0.3)' : 'none',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-data), Orbitron, sans-serif',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: active ? '#FFFFFF' : '#F2F0F5',
                          }}
                        >
                          {s.time}
                        </span>
                        <span
                          className="flex flex-col items-center gap-0.5 text-center lg:items-end lg:text-right"
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                              fontSize: '12px',
                              color: active ? 'rgba(255,255,255,0.75)' : '#635D72',
                            }}
                          >
                            {s.duration}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: !s.available
                                ? '#635D72'
                                : active
                                  ? 'rgba(255,255,255,0.8)'
                                  : '#22C55E',
                            }}
                          >
                            {!s.available ? t('reserve.cal.full') : t('reserve.cal.spotsLeftFmt').replace('{{n}}', String(s.spots))}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                {timeSlot && selectedDate ? (
                  <div
                    style={{
                      marginTop: '14px',
                      fontFamily: 'var(--font-body), Rajdhani, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#E8001C',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t('reserve.cal.lockedIn')
                      .replace('{{date}}', formatLockedDate(selectedDate))
                      .replace('{{time}}', timeSlot)}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {selectedISO && timeSlot ? (
            <button
              type="button"
              onClick={handleProceed}
              className="h-[52px] w-full touch-manipulation lg:h-[58px]"
              style={{
                background: '#E8001C',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '20px',
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(232,0,28,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {t('reserve.cal.proceed')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function CalendarDayCell({
  day,
  state,
  today,
  openLabel,
  fullLabel,
  onSelect,
}: {
  day: Date | null
  state: DayState
  today: Date
  openLabel: string
  fullLabel: string
  onSelect: (d: Date) => void
}) {
  if (!day) {
    return <div style={{ height: '54px' }} aria-hidden />
  }

  const isSelected = state === 'selected'
  const isAvailable = state === 'available'
  const isFull = state === 'full'
  const isPast = state === 'past'
  const isToday = isSameDay(day, today)

  const bg = isSelected
    ? '#E8001C'
    : isToday && !isSelected
      ? 'rgba(232,0,28,0.06)'
      : 'rgba(255,255,255,0.03)'

  const border = isSelected
    ? '2px solid #E8001C'
    : isToday && !isSelected
      ? '1.5px solid rgba(232,0,28,0.5)'
      : '1px solid rgba(255,255,255,0.08)'

  const cellStyle: CSSProperties = {
    height: '54px',
    width: '100%',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border,
    background: bg,
    boxShadow: isSelected ? '0 0 20px rgba(232,0,28,0.4)' : 'none',
    opacity: isPast ? 0.25 : isFull ? 0.4 : 1,
    transition: 'all 0.18s',
  }

  const inner = (
    <>
      <span
        style={{
          fontFamily: 'var(--font-data), Orbitron, sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          color: isSelected ? '#FFFFFF' : isPast ? '#635D72' : '#D4D0E0',
        }}
      >
        {day.getDate()}
      </span>
      {(isAvailable || isFull) && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '5px',
            fontFamily: 'var(--font-body), Rajdhani, sans-serif',
            fontSize: '8px',
            fontWeight: 700,
            color: isAvailable ? '#22C55E' : '#635D72',
          }}
        >
          {isAvailable ? openLabel : fullLabel}
        </span>
      )}
    </>
  )

  if (isAvailable) {
    return (
      <button
        type="button"
        onClick={() => onSelect(day)}
        style={{ ...cellStyle, cursor: 'pointer', padding: 0 }}
        className="border-0 bg-transparent"
      >
        {inner}
      </button>
    )
  }

  return <div style={{ ...cellStyle, cursor: 'default' }}>{inner}</div>
}
