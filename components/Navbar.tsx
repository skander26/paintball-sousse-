'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { PBIcon } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { useI18n } from '@/lib/i18n'
import { sounds } from '@/lib/sounds'
import logo from '@/components/media/logo.png'

const links = [
  { href: '/#top', key: 'nav.home', id: 'top' },
  { href: '/#experiences', key: 'nav.exp', id: 'experiences' },
  { href: '/#arsenal', key: 'nav.arsenal', id: 'arsenal' },
  { href: '/#tournament', key: 'nav.tournament', id: 'tournament' },
  { href: '/#gallery', key: 'nav.gallery', id: 'gallery' },
  { href: '/#contact', key: 'nav.contact', id: 'contact' },
]

export function Navbar() {
  const { t } = useI18n()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 80)
  })

  useEffect(() => {
    const ids = ['top', 'experiences', 'arsenal', 'tournament', 'gallery', 'contact']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const barBg = scrolled ? 'bg-[var(--bg-overlay)]' : 'bg-transparent'
  const barBorder = scrolled ? 'border-b border-[var(--border)]' : 'border-b border-transparent'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${barBg} ${barBorder}`}
      >
        <div className="container-pb flex h-14 items-center justify-between gap-3 px-5 md:h-16 lg:px-8">
          <Link href="/#top" className="flex min-h-[44px] items-center gap-3">
            <Image
              src={logo}
              alt="Paintball Sousse — logo circulaire rouge et blanc"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-contain"
              priority
            />
            <span className="hidden font-display text-[18px] uppercase tracking-[0.08em] text-[var(--text-primary)] min-[480px]:inline">
              Paintball Sousse
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => {
              const id = l.href.split('#')[1] ?? 'top'
              const isActive = active === id
              return (
                <Link
                  key={l.key}
                  href={l.href}
                  className={`group relative pb-1 font-body text-[14px] font-semibold transition-colors hover:text-[var(--text-primary)] ${
                    isActive ? 'text-[var(--red)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {t(l.key)}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--red)]"
                    initial={false}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ transformOrigin: '50% 50%' }}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden sm:block">
              <RedButton href="/reserve">{t('nav.reserve')}</RedButton>
            </div>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] lg:hidden"
              aria-label="Menu"
              onClick={() => {
                sounds.click()
                setOpen((v) => !v)
              }}
            >
              <PBIcon name={open ? 'close' : 'menu'} className="text-2xl text-[var(--text-primary)]" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-[rgba(15,14,17,0.98)] px-8 pb-10 pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-1 flex-col gap-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-body text-[18px] font-semibold text-[var(--text-primary)]"
                  >
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-6">
              <LanguageSwitcher />
              <RedButton href="/reserve" onNavigate={() => setOpen(false)}>
                {t('nav.reserve')}
              </RedButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="h-14 md:h-16" aria-hidden />
    </>
  )
}
