'use client'

import { useCallback, useEffect, useMemo, useState, type SetStateAction } from 'react'
import { CharacterCarousel } from '@/components/reserve/CharacterCarousel'
import { paintballClasses, type ClassId } from '@/data/classes'
import { getClassOption, useReservationStore } from '@/store/reservationStore'
import { isFreeForAll } from '@/lib/gameModeConfig'
import { RedButton } from '@/components/ui/RedButton'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'

const RED = '#E8001C'
const BLUE = '#4D8EFF'

export function StepCharacterLoadout() {
  const { t } = useI18n()
  const gameMode = useReservationStore((s) => s.gameMode)
  const players = useReservationStore((s) => s.players)
  const redTeamDefaultClass = useReservationStore((s) => s.redTeamDefaultClass)
  const blueTeamDefaultClass = useReservationStore((s) => s.blueTeamDefaultClass)
  const soloDefaultClass = useReservationStore((s) => s.soloDefaultClass)
  const setRedTeamDefaultClass = useReservationStore((s) => s.setRedTeamDefaultClass)
  const setBlueTeamDefaultClass = useReservationStore((s) => s.setBlueTeamDefaultClass)
  const setSoloDefaultClass = useReservationStore((s) => s.setSoloDefaultClass)
  const enterCustomizePerPlayer = useReservationStore((s) => s.enterCustomizePerPlayer)
  const confirmTeamLoadout = useReservationStore((s) => s.confirmTeamLoadout)
  const preset = useReservationStore((s) => s.preset)

  const ffa = isFreeForAll(gameMode)
  const [previewTeam, setPreviewTeam] = useState<'red' | 'blue'>('red')
  const [classIndex, setClassIndex] = useState(0)

  useEffect(() => {
    if (!preset) return
    const tier = preset.tier
    setRedTeamDefaultClass(tier)
    setBlueTeamDefaultClass(tier)
    setSoloDefaultClass(tier)
  }, [preset, setRedTeamDefaultClass, setBlueTeamDefaultClass, setSoloDefaultClass])

  const previewClassId: ClassId = useMemo(() => {
    if (ffa) return soloDefaultClass
    return previewTeam === 'red' ? redTeamDefaultClass : blueTeamDefaultClass
  }, [ffa, previewTeam, redTeamDefaultClass, blueTeamDefaultClass, soloDefaultClass])

  useEffect(() => {
    const idx = paintballClasses.findIndex((c) => c.id === previewClassId)
    if (idx < 0) return
    setClassIndex((prev) => (prev === idx ? prev : idx))
  }, [previewClassId])

  const setClassIndexWrapped = useCallback(
    (v: SetStateAction<number>) => {
      setClassIndex((prev) => {
        const next = typeof v === 'function' ? v(prev) : v
        const id = paintballClasses[next]?.id
        if (id) {
          if (ffa) setSoloDefaultClass(id)
          else if (previewTeam === 'red') setRedTeamDefaultClass(id)
          else setBlueTeamDefaultClass(id)
        }
        return next
      })
    },
    [ffa, previewTeam, setSoloDefaultClass, setRedTeamDefaultClass, setBlueTeamDefaultClass],
  )

  const currentTeam = ffa ? 'red' : previewTeam

  const redOpt = getClassOption(redTeamDefaultClass, 0)
  const blueOpt = getClassOption(blueTeamDefaultClass, 0)
  const soloOpt = getClassOption(soloDefaultClass, 0)

  return (
    <div className="container-pb flex max-w-5xl min-h-0 w-full min-w-0 flex-1 flex-col px-3 py-3 sm:px-4 lg:px-6">
      <div className="shrink-0 text-center">
        <h2 className="font-display text-[clamp(28px,6vw,44px)] uppercase leading-tight tracking-[0.04em] text-[var(--text-primary)]">
          {t('reserve.loadout.title')}
        </h2>
        <p className="mx-auto mt-2 max-w-xl font-body text-[14px] text-[var(--text-muted)] sm:text-[15px]">
          {ffa ? t('reserve.loadout.subFfa') : t('reserve.loadout.subTeam')}
        </p>
      </div>

      <div className="mx-auto mt-4 min-h-0 w-full max-w-full min-w-0 flex-1 max-lg:pb-24">
        <div className="min-h-0 min-w-0 max-lg:mb-3 lg:mb-4">
          <CharacterCarousel
            classIndex={classIndex}
            setClassIndex={setClassIndexWrapped}
            currentTeam={currentTeam}
          />
        </div>

        {ffa ? (
          <div
            className="mx-auto w-full max-w-[320px] rounded-xl border border-[rgba(232,0,28,0.35)] p-5"
            style={{ background: 'rgba(18, 17, 22, 0.92)' }}
          >
            <div
              className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: RED }}
            >
              {t('reserve.loadout.soloClassLabel')}
            </div>
            <select
              value={soloDefaultClass}
              onChange={(e) => {
                sounds.click()
                setSoloDefaultClass(e.target.value as ClassId)
              }}
              className="w-full cursor-pointer rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2.5 font-display text-[20px] uppercase tracking-[0.06em] text-[#F2F0F5] outline-none focus:border-[rgba(232,0,28,0.5)]"
            >
              {paintballClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.nameKey)}
                </option>
              ))}
            </select>
            <p className="mt-2 font-body text-[13px] text-[#A09AAD]">
              {t('reserve.loadout.soloHint').replace('{{n}}', String(players.length))}
            </p>
            {soloOpt ? (
              <p className="mt-1 font-body text-[13px] text-[#8B8498]">
                🎯 {soloOpt.balls} · {soloOpt.price} DT
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                sounds.click()
                setPreviewTeam('red')
              }}
              className="rounded-xl border p-5 text-left transition-colors"
              style={{
                background: 'rgba(18, 17, 22, 0.92)',
                borderColor: previewTeam === 'red' ? 'rgba(232,0,28,0.55)' : 'rgba(255,255,255,0.1)',
                borderLeftWidth: 3,
                borderLeftColor: RED,
                boxShadow: previewTeam === 'red' ? '0 0 0 1px rgba(232,0,28,0.25)' : undefined,
              }}
            >
              <div
                className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: RED }}
              >
                {t('reserve.loadout.redClassLabel')}
              </div>
              <select
                value={redTeamDefaultClass}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  sounds.click()
                  setRedTeamDefaultClass(e.target.value as ClassId)
                  setPreviewTeam('red')
                }}
                className="w-full cursor-pointer rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2.5 font-display text-[18px] uppercase tracking-[0.06em] text-[#F2F0F5] outline-none focus:border-[rgba(232,0,28,0.45)] sm:text-[20px]"
              >
                {paintballClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.nameKey)}
                  </option>
                ))}
              </select>
              {redOpt ? (
                <p className="mt-2 font-body text-[13px] text-[#A09AAD]">
                  🎯 {redOpt.balls} · {redOpt.price} DT
                </p>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.click()
                setPreviewTeam('blue')
              }}
              className="rounded-xl border p-5 text-left transition-colors"
              style={{
                background: 'rgba(18, 17, 22, 0.92)',
                borderColor: previewTeam === 'blue' ? 'rgba(77,142,255,0.45)' : 'rgba(255,255,255,0.1)',
                borderLeftWidth: 3,
                borderLeftColor: BLUE,
                boxShadow: previewTeam === 'blue' ? '0 0 0 1px rgba(77,142,255,0.2)' : undefined,
              }}
            >
              <div
                className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: BLUE }}
              >
                {t('reserve.loadout.blueClassLabel')}
              </div>
              <select
                value={blueTeamDefaultClass}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  sounds.click()
                  setBlueTeamDefaultClass(e.target.value as ClassId)
                  setPreviewTeam('blue')
                }}
                className="w-full cursor-pointer rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2.5 font-display text-[18px] uppercase tracking-[0.06em] text-[#F2F0F5] outline-none focus:border-[rgba(77,142,255,0.45)] sm:text-[20px]"
              >
                {paintballClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t(c.nameKey)}
                  </option>
                ))}
              </select>
              {blueOpt ? (
                <p className="mt-2 font-body text-[13px] text-[#A09AAD]">
                  🎯 {blueOpt.balls} · {blueOpt.price} DT
                </p>
              ) : null}
            </button>
          </div>
        )}

        <div className="mx-auto mt-5 flex w-full max-w-[600px] flex-col gap-3 rounded-xl border border-dashed border-white/[0.18] bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0 flex-1 text-left">
            <div className="font-body text-[15px] font-semibold text-[var(--text-primary)]">
              {t('reserve.loadout.customizeCta')}
            </div>
            <div className="mt-1 font-body text-[13px] text-[var(--text-muted)]">{t('reserve.loadout.customizeHint')}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.click()
              enterCustomizePerPlayer()
            }}
            className="w-full shrink-0 rounded-lg border border-white/20 bg-transparent px-4 py-2.5 font-body text-[13px] font-bold uppercase tracking-[0.1em] text-[#F2F0F5] transition-colors hover:border-[rgba(232,0,28,0.45)] hover:text-[#E8001C] sm:w-auto"
          >
            {t('reserve.loadout.customizeBtn')}
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[rgba(10,9,14,0.96)] p-3 backdrop-blur-md max-lg:p-3 lg:static lg:z-auto lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
        <RedButton
          className="mx-auto w-full max-w-[600px] rounded-xl"
          onClick={() => {
            sounds.confirm()
            confirmTeamLoadout()
          }}
        >
          {t('reserve.loadout.confirm')} →
        </RedButton>
      </div>
    </div>
  )
}
