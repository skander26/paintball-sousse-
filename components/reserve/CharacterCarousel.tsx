'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSyncExternalStore, type Dispatch, type SetStateAction } from 'react'
import { paintballClasses } from '@/data/classes'
import { reserveCharacterImage } from '@/lib/reserveCharacterAssets'
import { sounds } from '@/lib/sounds'

function useMinWidthLg() {
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mq = window.matchMedia('(min-width: 1024px)')
    mq.addEventListener('change', onStoreChange)
    return () => mq.removeEventListener('change', onStoreChange)
  }
  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  const getServerSnapshot = () => false
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const arrowBtnClass =
  'absolute top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/35 bg-white/10 text-[30px] font-semibold leading-none text-white shadow-none transition-colors duration-200 hover:border-white/70 hover:bg-white/20 hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] sm:h-16 sm:w-16 sm:text-[34px] lg:h-[4.25rem] lg:w-[4.25rem] lg:text-[40px]'

type CharacterCarouselProps = {
  classIndex: number
  setClassIndex: Dispatch<SetStateAction<number>>
  currentTeam: 'red' | 'blue'
}

export function CharacterCarousel({ classIndex, setClassIndex, currentTeam }: CharacterCarouselProps) {
  const isDesktopLayout = useMinWidthLg()

  const slideMotion = (i: number) => {
    const offset = i - classIndex
    const dist = Math.abs(offset)
    const active = offset === 0

    /** Même échelle sur mobile/tablette ; variations décoratives seulement au desktop. */
    const rankMul = isDesktopLayout
      ? (1 + i * 0.05) *
        (currentTeam === 'red' && paintballClasses[i]?.id === 'warrior' ? 1.25 : 1)
      : 1

    const scale = active
      ? (isDesktopLayout ? 1.08 : 1.02) * rankMul
      : isDesktopLayout
        ? 0.56
        : 0.52

    const opacity = active ? 1 : 0.72
    const step = isDesktopLayout ? 168 : 56
    const x = offset * step
    const zIndex = active ? 20 : 10 - dist
    const filter = active
      ? 'blur(0px) saturate(1) brightness(1)'
      : 'blur(8px) saturate(0.82) brightness(0.88)'

    return { x, y: 0, scale, opacity, zIndex, filter }
  }

  return (
    <div className="flex w-full min-w-0 max-w-full min-h-0 max-h-[min(64dvh,calc(100dvh-6rem))] flex-1 items-center justify-center overflow-x-visible overflow-y-visible lg:max-h-none lg:min-h-0 lg:flex-1">
      <div className="relative flex h-full min-h-0 w-full max-w-full min-w-0 items-center overflow-x-visible overflow-y-visible lg:max-w-[min(100%,72rem)]">
        <div
          className={[
            'relative mx-auto w-full min-w-0 max-w-full overflow-x-visible overflow-y-visible pt-4 sm:pt-6',
            'h-[min(460px,56dvh)] max-h-[62dvh] sm:h-[min(500px,58dvh)] sm:max-h-[66dvh]',
            'px-4 sm:px-8',
            'lg:h-[min(720px,calc(100dvh-6.5rem))] lg:max-h-[min(720px,calc(100dvh-6.5rem))] lg:px-14 lg:pt-2',
          ].join(' ')}
        >
          <motion.button
            type="button"
            className={`${arrowBtnClass} left-1 sm:left-2 lg:left-4`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={() => {
              sounds.click()
              setClassIndex((v) => (v - 1 + paintballClasses.length) % paintballClasses.length)
            }}
            aria-label="Classe précédente"
          >
            ‹
          </motion.button>
          <motion.button
            type="button"
            className={`${arrowBtnClass} right-1 sm:right-2 lg:right-4`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={() => {
              sounds.click()
              setClassIndex((v) => (v + 1) % paintballClasses.length)
            }}
            aria-label="Classe suivante"
          >
            ›
          </motion.button>

          {paintballClasses.map((c, i) => {
            const st = slideMotion(i)
            return (
              <motion.div
                key={c.id}
                className="absolute inset-0 flex flex-col items-center justify-center overflow-visible will-change-transform"
                initial={false}
                animate={st}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                style={{
                  zIndex: st.zIndex,
                  pointerEvents: i === classIndex ? 'auto' : 'none',
                  transformOrigin: '50% 100%',
                }}
              >
                <div
                  className="relative flex w-full max-w-[min(100%,82vw)] flex-col items-center overflow-visible sm:max-w-[min(100%,26rem)] lg:max-w-[min(100%,40rem)]"
                  style={{
                    background: `radial-gradient(ellipse 80% 32% at 50% 100%, ${c.platformColor} 0%, transparent 72%)`,
                  }}
                >
                  <div className="relative box-border w-full overflow-visible pt-2 pb-1 sm:pt-3 sm:pb-2 lg:pt-4 lg:pb-3">
                    {/** Cadre identique toutes classes : mobile = largeur + ratio fixe ; lg = hauteur max comme avant. */}
                    <div className="relative mx-auto aspect-[3/4] w-[min(78vw,320px)] max-w-full sm:w-[min(76vw,340px)] lg:aspect-auto lg:h-[min(700px,calc(100dvh-7rem))] lg:w-full lg:max-w-[min(100%,40rem)]">
                      <Image
                        src={reserveCharacterImage(currentTeam, c.id)}
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 640px) 320px, (max-width: 1023px) 340px, 40rem"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
