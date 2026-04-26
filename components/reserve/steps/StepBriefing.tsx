'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { animate, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { gameModes } from '@/data/packages'
import { getClassOption, type PlayerSlot, useReservationStore } from '@/store/reservationStore'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import type { IconKey } from '@/icons'
import { whatsappHref } from '@/lib/constants'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'
import { isFreeForAll } from '@/lib/gameModeConfig'

const FFA_ROW_ACCENTS = ['#E8001C', '#f97316', '#eab308']

const schema = z.object({
  fullName: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Téléphone requis'),
})

type FormValues = z.infer<typeof schema>

export function StepBriefing() {
  const { t, locale } = useI18n()
  const setStep = useReservationStore((s) => s.setStep)
  const date = useReservationStore((s) => s.date)
  const timeSlot = useReservationStore((s) => s.timeSlot)
  const gameMode = useReservationStore((s) => s.gameMode)
  const players = useReservationStore((s) => s.players)

  const [showForm, setShowForm] = useState(false)

  const ffa = isFreeForAll(gameMode)

  const modeLabel = useMemo(() => {
    if (!gameMode) return '—'
    const m = gameModes.find((x) => x.id === gameMode)
    return m ? t(m.nameKey) : '—'
  }, [gameMode, t])

  const total = useMemo(
    () =>
      players.reduce((sum, p) => {
        if (!p.classId) return sum
        const opt = getClassOption(p.classId, p.optionIndex)
        return sum + (opt?.price ?? 0)
      }, 0),
    [players],
  )

  const [displayTotal, setDisplayTotal] = useState(0)

  useEffect(() => {
    const controls = animate(0, total, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayTotal(Math.round(v)),
    })
    return () => controls.stop()
  }, [total])

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const red = players.filter((p) => p.team === 'red')
  const blue = players.filter((p) => p.team === 'blue')

  const teamTotal = (list: typeof players) =>
    list.reduce((sum, p) => {
      if (!p.classId) return sum
      const opt = getClassOption(p.classId, p.optionIndex)
      return sum + (opt?.price ?? 0)
    }, 0)

  const onSubmit = (values: FormValues) => {
    sounds.confirm()
    const lines = ffa
      ? [
          `Paintball Sousse — Réservation`,
          `🎯 ${modeLabel}`,
          `👥 ${players.length} guerriers — pas d'équipes`,
          `Nom: ${values.fullName}`,
          `Tél: ${values.phone}`,
          `Date: ${formattedDate} ${timeSlot}`,
          `Total: ${total} DT`,
        ]
      : [
          `Paintball Sousse — Mission`,
          `Nom: ${values.fullName}`,
          `Tél: ${values.phone}`,
          `Date: ${formattedDate} ${timeSlot}`,
          `Mode: ${modeLabel}`,
          `Joueurs: ${players.length}`,
          `Total: ${total} DT`,
        ]
    const msg = lines.join('\n')
    window.open(whatsappHref(msg), '_blank')
    setStep('success', 1)
  }

  return (
    <div
      className={`container-pb flex max-h-full min-h-0 max-w-5xl flex-1 flex-col py-5 sm:py-6 ${showForm ? 'overflow-y-auto' : 'overflow-hidden'}`}
    >
      <h2 className="text-display-sm leading-tight text-[var(--text-primary)]">{t('reserve.brief.title')}</h2>
      <p className="text-body-md mt-2 text-[var(--text-secondary)]">{t('reserve.brief.sub')}</p>

      <div className="mt-5 pb-card p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <Row icon="calendar" label={t('reserve.brief.date')} value={formattedDate} />
          <Row icon="clock" label={t('reserve.brief.time')} value={timeSlot ?? '—'} />
          <Row icon="target" label={t('reserve.brief.mode')} value={modeLabel} />
          <Row icon="timer" label={t('reserve.brief.duration')} value="~45 min" />
        </div>
        {ffa ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-[rgba(232,0,28,0.35)] bg-[rgba(232,0,28,0.08)] px-3 py-2 font-body text-[13px] font-semibold text-[var(--text-primary)]">
            <PBIcon name="swords" className="text-lg text-[var(--red)]" />
            {t('reserve.brief.ffaWarning')}
          </p>
        ) : null}
      </div>

      {ffa ? (
        <ArenaRosterCard players={players} total={total} t={t} />
      ) : (
        <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          <TeamCard
            title={t('reserve.brief.red')}
            accent="var(--red)"
            players={red}
            total={teamTotal(red)}
            t={t}
          />
          <TeamCard
            title={t('reserve.brief.blue')}
            accent="#0066FF"
            players={blue}
            total={teamTotal(blue)}
            t={t}
          />
        </div>
      )}

      <div className="mt-5 shrink-0 text-center">
        <p className="pb-label">{t('reserve.brief.grand')}</p>
        <div className="font-data text-[clamp(28px,5vw,52px)] font-bold leading-none text-[var(--text-primary)]">
          {displayTotal} DT
        </div>
        <p className="mt-2 font-body text-[13px] text-[var(--text-muted)]">{t('reserve.brief.payNote')}</p>
      </div>

      <div className="mt-5 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="min-h-[48px] rounded-md border border-[var(--border)] bg-transparent px-6 font-body text-[14px] font-semibold text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
          onClick={() => {
            sounds.click()
            useReservationStore.setState({
              currentPlayerIndex: 0,
              customizePerPlayer: false,
              squadPhase: 'character',
            })
            setStep('squad', -1)
          }}
        >
          ← {t('reserve.brief.edit')}
        </button>
        {!showForm ? (
          <RedButton
            onClick={() => {
              sounds.click()
              setShowForm(true)
            }}
          >
            🎯 {t('reserve.brief.confirm')}
          </RedButton>
        ) : null}
      </div>

      {showForm ? (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 shrink-0 pb-card p-4 sm:p-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="pb-label mb-2 block">{t('reserve.brief.name')}</label>
              <input
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 font-body text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--border-red)]"
                {...register('fullName')}
              />
              {errors.fullName ? (
                <p className="mt-1 font-body text-[13px] text-[var(--red)]">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div>
              <label className="pb-label mb-2 block">{t('reserve.brief.phone')}</label>
              <input
                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 font-body text-[16px] text-[var(--text-primary)] outline-none focus:border-[var(--border-red)]"
                {...register('phone')}
              />
              {errors.phone ? (
                <p className="mt-1 font-body text-[13px] text-[var(--red)]">{errors.phone.message}</p>
              ) : null}
            </div>
          </div>
          <div className="mt-4">
            <RedButton type="submit" className="w-full">
              {t('reserve.brief.send')} →
            </RedButton>
          </div>
        </motion.form>
      ) : null}
    </div>
  )
}

function Row({ icon, label, value }: { icon: IconKey; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <PBIcon name={icon} className="mt-0.5 text-xl text-[var(--red)]" />
      <div>
        <div className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {label}
        </div>
        <div className="font-body text-[15px] text-[var(--text-primary)]">{value}</div>
      </div>
    </div>
  )
}

function ArenaRosterCard({
  players,
  total,
  t,
}: {
  players: PlayerSlot[]
  total: number
  t: (k: string) => string
}) {
  return (
    <div
      className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden pb-card"
      style={{ borderTop: '3px solid #E8001C' }}
    >
      <div className="shrink-0 border-b border-[var(--border)] px-4 py-2.5 sm:px-5 sm:py-3">
        <h3 className="font-display text-[20px] uppercase leading-tight text-[var(--text-primary)] sm:text-[22px]">
          {t('reserve.brief.arenaTitle')}
        </h3>
      </div>
      <div className="min-h-0 flex-1 divide-y divide-[var(--border)] overflow-hidden px-2">
        {players.map((p, i) => {
          const opt = p.classId ? getClassOption(p.classId, p.optionIndex) : null
          const initials = (p.name || `J${i + 1}`).slice(0, 2).toUpperCase()
          const accent = FFA_ROW_ACCENTS[i % FFA_ROW_ACCENTS.length]!
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-3 py-2 sm:py-2.5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-body text-[12px] font-bold text-white"
                style={{ background: accent }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="font-body text-[14px] font-semibold text-[var(--text-primary)]">
                  {p.name || `Joueur ${i + 1}`}
                </div>
                <div className="font-body text-[13px] text-[var(--text-muted)]">
                  {p.classId ? t(`reserve.class.${p.classId}.name`) : '—'} · {opt?.price ?? 0} DT
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="font-body text-[13px] text-[var(--text-muted)]">{t('reserve.brief.totalArena')}</span>
        <span className="font-data text-[16px] text-[#E8001C]">{total} DT</span>
      </div>
    </div>
  )
}

function TeamCard({
  title,
  accent,
  players,
  total,
  t,
}: {
  title: string
  accent: string
  players: PlayerSlot[]
  total: number
  t: (k: string) => string
}) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden pb-card" style={{ borderTop: `3px solid ${accent}` }}>
      <div className="shrink-0 border-b border-[var(--border)] px-4 py-2.5 sm:px-5 sm:py-3">
        <h3 className="font-display text-[20px] uppercase leading-tight text-[var(--text-primary)] sm:text-[22px]">
          {title}
        </h3>
      </div>
      <div className="min-h-0 flex-1 divide-y divide-[var(--border)] overflow-hidden px-2">
        {players.map((p, i) => {
          const opt = p.classId ? getClassOption(p.classId, p.optionIndex) : null
          const initials = (p.name || `J${i + 1}`).slice(0, 2).toUpperCase()
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-3 py-2 sm:py-2.5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-body text-[12px] font-bold text-white"
                style={{ background: accent }}
              >
                {initials}
              </div>
              <div className="flex-1">
                <div className="font-body text-[14px] font-semibold text-[var(--text-primary)]">
                  {p.name || `Joueur ${i + 1}`}
                </div>
                <div className="font-body text-[13px] text-[var(--text-muted)]">
                  {p.classId ? t(`reserve.class.${p.classId}.name`) : '—'} · {opt?.price ?? 0} DT
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="font-body text-[13px] text-[var(--text-muted)]">{t('reserve.brief.totalTeam')}</span>
        <span className="font-data text-[16px]" style={{ color: accent }}>
          {total} DT
        </span>
      </div>
    </div>
  )
}
