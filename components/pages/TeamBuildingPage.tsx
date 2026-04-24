'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { PBIcon, PBIconify } from '@/components/ui/PBIcon'
import { RedButton } from '@/components/ui/RedButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import {
  budgetOptions,
  games,
  pillars,
  processSteps,
  programs,
  programInterestOptions,
  tbTestimonials,
  teamBuildingStats,
  teamSizeOptions,
} from '@/data/teamBuilding'
import { ADDRESS_LINES, EMAIL, PHONE_DISPLAY, PHONE_TEL, whatsappHref } from '@/lib/constants'

const formSchema = z.object({
  companyName: z.string().min(1, 'Required'),
  yourName: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  teamSize: z.enum(['6–10', '10–20', '20–50', '50+']),
  preferredDate: z.string().optional(),
  programInterest: z.string().min(1, 'Select an option'),
  budget: z.string().min(1, 'Select an option'),
  details: z.string().optional(),
})

type TeamQuoteFormData = z.infer<typeof formSchema>

const heroStagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.05 } } }
const heroItem = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }

function buildWhatsappMessage(d: TeamQuoteFormData) {
  const lines = [
    '— Paintball Sousse team building quote —',
    `Company: ${d.companyName}`,
    `Name: ${d.yourName}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `Team size: ${d.teamSize}`,
    d.preferredDate ? `Date: ${d.preferredDate}` : '',
    `Program: ${d.programInterest}`,
    `Budget: ${d.budget}`,
    d.details ? `Details: ${d.details}` : '',
  ].filter(Boolean)
  return lines.join('\n')
}

export function TeamBuildingPage() {
  const [success, setSuccess] = useState(false)
  const [submittedPayload, setSubmittedPayload] = useState<TeamQuoteFormData | null>(null)
  const [tIdx, setTIdx] = useState(0)
  const [isNarrow, setIsNarrow] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setIsNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    if (!isNarrow) {
      return
    }
    const id = setInterval(() => {
      setTIdx((i) => (i + 1) % tbTestimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [isNarrow])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamQuoteFormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = useCallback((data: TeamQuoteFormData) => {
    setSubmittedPayload(data)
    setSuccess(true)
  }, [])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="overflow-x-hidden">
        <section
          id="top"
          className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-20 pt-28"
        >
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.p
              variants={heroItem}
              className="mb-4 inline-block rounded-md border border-[var(--border-red)] bg-[var(--red-subtle)] px-4 py-1.5 font-body text-[12px] font-semibold tracking-[0.28em] text-[var(--red)]"
            >
              CORPORATE EXPERIENCES
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-[clamp(64px,10vw,120px)] uppercase leading-[0.92] tracking-[0.02em] text-white"
            >
              TEAM BUILDING
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-0 font-display text-[clamp(48px,7vw,80px)] uppercase leading-[0.95] tracking-[0.02em] text-[var(--red)]"
            >
              AT PAINTBALL SOUSSE
            </motion.p>
            <motion.p
              variants={heroItem}
              className="mx-auto mt-6 max-w-[680px] font-body text-[18px] leading-[1.7] text-[var(--text-secondary)]"
            >
              We believe in the power of teamwork. Our activities combine the thrill of paintball with strategic exercises
              that promote collaboration, communication, and leadership.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-10 flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
            >
              <RedButton href="#contact" className="w-full sm:min-w-[200px] sm:max-w-none sm:w-auto">
                GET A CUSTOM QUOTE →
              </RedButton>
              <a
                href="#programs"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-md border-2 border-[var(--border-red)] bg-transparent px-8 font-display text-[clamp(16px,2.2vw,20px)] uppercase tracking-[0.08em] text-white transition hover:border-[var(--red)] hover:text-[var(--red)] sm:w-auto"
              >
                SEE OUR PROGRAMS ↓
              </a>
            </motion.div>
            <motion.div
              variants={heroItem}
              className="mt-12 grid w-full max-w-3xl grid-cols-3 border border-[var(--border)]"
            >
              {teamBuildingStats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col items-center justify-center gap-1 py-4 sm:py-5 ${i > 0 ? 'border-l border-[var(--border)]' : ''}`}
                >
                  <span className="font-data text-[clamp(20px,5vw,56px)] font-bold leading-none text-white">{s.value}</span>
                  <span className="px-1 text-center font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-[13px]">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="section" aria-labelledby="tb-why">
          <div className="container-pb">
            <SectionTitle label="THE ADVANTAGE" id="tb-why" title="WHY CHOOSE US?" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
              {pillars.map((p, i) => (
                <motion.article
                  key={p.number}
                  className="pb-card relative p-7 transition duration-200 hover:translate-y-[-4px] hover:border-[var(--border-red)]"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                >
                  <span className="absolute right-5 top-3 font-data text-[48px] font-bold leading-none text-white/[0.12]">
                    {p.number}
                  </span>
                  <PBIconify icon={p.icon} className="text-[40px] text-[var(--red)]" />
                  <h3 className="mt-4 font-display text-[28px] uppercase leading-tight text-[var(--text-primary)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-body text-[16px] leading-[1.7] text-[var(--text-secondary)]">{p.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="section" aria-labelledby="tb-programs-h">
          <div className="container-pb">
            <SectionTitle
              label="WHAT WE OFFER"
              title="OUR PROGRAMS"
              subtitle="Every program is designed to deliver measurable results"
            />
            <h2 id="tb-programs-h" className="sr-only">
              Our programs
            </h2>
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))' }}
            >
              {programs.map((pr, i) => {
                const isRed = pr.variant === 'red'
                const isGold = pr.variant === 'gold'
                const cardSurface = isRed
                  ? 'pb-card-red'
                  : isGold
                    ? 'pb-card border border-[rgba(255,215,0,0.4)]'
                    : 'pb-card'
                return (
                  <motion.article
                    key={pr.id}
                    className={`${cardSurface} group relative flex min-h-full flex-col p-6 transition duration-200 hover:translate-y-[-4px] hover:border-[var(--border-red)]`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    {pr.tag ? (
                      <span
                        className="absolute right-3 top-3 z-[1] rounded-sm px-2.5 py-0.5 font-body text-[10px] font-bold text-white"
                        style={{ backgroundColor: pr.tagColor }}
                      >
                        {pr.tag}
                      </span>
                    ) : null}
                    <PBIconify icon={pr.icon} className="text-[44px] text-[var(--red)]" />
                    <h3 className="mt-3 font-display text-[26px] uppercase leading-tight text-[var(--text-primary)]">
                      {pr.title}
                    </h3>
                    <p className="mt-2 flex-1 font-body text-[15px] leading-[1.7] text-[var(--text-secondary)]">
                      {pr.desc}
                    </p>
                    <a
                      href="#contact"
                      className="mt-5 inline-block font-body text-[13px] font-semibold text-[var(--red)] transition group-hover:underline"
                    >
                      LEARN MORE →
                    </a>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="tb-activities">
          <div className="container-pb">
            <SectionTitle
              label="GET READY TO PLAY"
              title="OUR ACTIVITIES"
              subtitle="Beyond paintball — a full arsenal of team activities"
            />
            <h2 id="tb-activities" className="sr-only">
              Activities
            </h2>
            <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              {games.map((g, i) => (
                <motion.article
                  key={g.name}
                  className="pb-card flex flex-col gap-2 p-4 sm:p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <PBIconify icon={g.icon} className="text-[32px] text-[var(--red)]" />
                  <h3 className="font-display text-[18px] uppercase leading-tight text-[var(--text-primary)]">
                    {g.name}
                  </h3>
                  <p className="font-body text-[13px] text-[var(--text-secondary)]">{g.desc}</p>
                </motion.article>
              ))}
            </div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {games.map((g) => (
                <div
                  key={g.name}
                  className="w-[min(180px,80vw)] shrink-0 snap-start"
                >
                  <article className="pb-card flex h-full min-h-full flex-col gap-2 p-4 text-left">
                    <PBIconify icon={g.icon} className="text-[32px] text-[var(--red)]" />
                    <h3 className="font-display text-[18px] uppercase leading-tight text-[var(--text-primary)]">
                      {g.name}
                    </h3>
                    <p className="font-body text-[13px] text-[var(--text-secondary)]">{g.desc}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProcessSection />

        <GetInTouchSection />

        <TestimonialsBlock active={tIdx} onDotClick={setTIdx} isNarrow={isNarrow} />

        <section id="contact" className="section" aria-labelledby="tb-contact-title">
          <div className="container-pb">
            <SectionTitle
              label="LET'S TALK"
              title="GET YOUR CUSTOM QUOTE"
              subtitle="Tell us about your team and we'll design the perfect experience"
            />
            <h2 id="tb-contact-title" className="sr-only">
              Quote request
            </h2>
            <div className="mt-2 grid grid-cols-1 gap-12 lg:grid-cols-[0.6fr_0.4fr]">
              <div>
                {success && submittedPayload ? (
                  <motion.div
                    className="pb-card-red p-8"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-display text-[28px] uppercase text-[var(--text-primary)]">✅ REQUEST RECEIVED!</p>
                    <p className="mt-3 font-body text-[16px] text-[var(--text-secondary)]">Our team will contact you within 24 hours.</p>
                    <p className="mt-4 font-body text-[15px] text-[var(--text-secondary)]">Or reach us directly on WhatsApp</p>
                    <div className="mt-4">
                      <a
                        href={whatsappHref(buildWhatsappMessage(submittedPayload))}
                        className="font-body text-[16px] font-bold text-[var(--red)] underline"
                      >
                        Open WhatsApp →
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <Field
                      id="cname"
                      label="Company name *"
                      err={errors.companyName?.message}
                      reg={register('companyName')}
                    />
                    <Field id="yname" label="Your name *" err={errors.yourName?.message} reg={register('yourName')} />
                    <Field
                      id="ph"
                      label="Phone / WhatsApp *"
                      type="tel"
                      err={errors.phone?.message}
                      reg={register('phone')}
                    />
                    <Field id="em" label="Email *" type="email" err={errors.email?.message} reg={register('email')} />
                    <div>
                      <label htmlFor="ts" className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
                        Team size *
                      </label>
                      <select
                        id="ts"
                        className="min-h-[48px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 text-[16px] text-white"
                        {...register('teamSize')}
                      >
                        <option value="">Select…</option>
                        {teamSizeOptions.map((o) => (
                          <option key={o} value={o}>
                            {o} players
                          </option>
                        ))}
                      </select>
                      {errors.teamSize ? (
                        <p className="mt-1.5 text-[13px] text-[var(--red)]">{String(errors.teamSize.message)}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="date" className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
                        Preferred date
                      </label>
                      <input
                        id="date"
                        type="date"
                        className="min-h-[48px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3"
                        {...register('preferredDate')}
                      />
                    </div>
                    <div>
                      <label htmlFor="progi" className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
                        Program interest
                      </label>
                      <select
                        id="progi"
                        className="min-h-[48px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 text-white"
                        {...register('programInterest')}
                      >
                        <option value="">Select…</option>
                        {programInterestOptions.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      {errors.programInterest ? (
                        <p className="mt-1.5 text-[13px] text-[var(--red)]">{errors.programInterest.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="bud" className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
                        Budget range
                      </label>
                      <select
                        id="bud"
                        className="min-h-[48px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 text-white"
                        {...register('budget')}
                      >
                        <option value="">Select…</option>
                        {budgetOptions.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      {errors.budget ? <p className="mt-1.5 text-[13px] text-[var(--red)]">{errors.budget.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="det" className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
                        Additional details
                      </label>
                      <textarea
                        id="det"
                        rows={4}
                        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] p-3 text-white"
                        {...register('details')}
                      />
                    </div>
                    <RedButton type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      SEND QUOTE REQUEST →
                    </RedButton>
                  </form>
                )}
              </div>
              <aside className="space-y-6 text-[var(--text-secondary)]">
                <h3 className="pb-label !mb-0 text-left !tracking-[0.2em]">QUICK CONTACT</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <span className="shrink-0" aria-hidden>
                      📞
                    </span>
                    <div>
                      <a href={`tel:${PHONE_TEL}`} className="font-body text-[16px] text-[var(--text-primary)]">
                        {PHONE_DISPLAY}
                      </a>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[13px] font-semibold"
                        >
                          CALL
                        </a>
                        <a
                          href={whatsappHref('Hi Paintball Sousse — team building question')}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[13px] font-semibold"
                        >
                          WHATSAPP
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <span aria-hidden>📧</span>
                    <a href={`mailto:${EMAIL}`} className="font-body text-[15px] break-all text-[var(--text-primary)]">
                      {EMAIL}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="shrink-0" aria-hidden>
                      📍
                    </span>
                    <span className="font-body text-[15px]">Near Mall of Sousse, Kalaa Kebira — {ADDRESS_LINES.join(', ')}</span>
                  </li>
                </ul>
                <div>
                  <h3 className="pb-label !mb-3 !text-left !tracking-[0.2em]">RESPONSE TIME</h3>
                  <div className="pb-card flex items-center gap-3 p-4">
                    <PBIcon name="timer" className="text-3xl text-[var(--red)]" />
                    <p className="font-body text-[15px] text-[var(--text-primary)]">We respond within 24 hours</p>
                  </div>
                </div>
                <div>
                  <h3 className="pb-label !mb-3 !text-left !tracking-[0.2em]">AVAILABLE FOR</h3>
                  <p className="font-body text-[15px] leading-[1.8] text-[var(--text-primary)]">
                    {['Corporate Events', 'School Groups', 'Private Parties', 'NGOs'].map((t) => (
                      <span key={t} className="me-1 inline-block after:content-['·'] after:text-[var(--text-muted)] last:after:content-['']">
                        {t}
                        {' '}
                      </span>
                    ))}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

function Field({
  id,
  label,
  err,
  reg,
  type = 'text',
}: {
  id: string
  label: string
  err?: string
  reg: ReturnType<ReturnType<typeof useForm<TeamQuoteFormData>>['register']>
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-body text-[14px] text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="min-h-[48px] w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 text-white"
        {...reg}
      />
      {err ? <p className="mt-1.5 text-[13px] text-[var(--red)]">{err}</p> : null}
    </div>
  )
}

function ProcessSection() {
  return (
    <section className="section" aria-labelledby="tb-process">
      <div className="container-pb">
        <SectionTitle label="SIMPLE PROCESS" title="HOW IT WORKS" />
        <h2 id="tb-process" className="sr-only">
          How it works
        </h2>
        <div className="relative pl-0 md:hidden">
          <div
            className="absolute left-[1.1rem] top-4 bottom-4 w-0 border-l-2 border-dashed border-red-500/50"
            aria-hidden
          />
          <ol className="m-0 list-none p-0 pl-0">
            {processSteps.map((s, i) => (
            <motion.li
              key={s.n}
              className="relative z-[1] flex gap-4 pb-10 last:pb-0 pl-0"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.2, duration: 0.35 }}
            >
              <div
                className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--red)] bg-[var(--bg-base)] font-data text-[15px] font-bold text-white"
                style={{ minWidth: 40, minHeight: 40 }}
              >
                {s.n}
              </div>
              <div>
                <PBIconify icon={s.icon} className="text-2xl text-[var(--red)]" />
                <h3 className="mt-2 font-display text-[20px] uppercase text-[var(--text-primary)] sm:text-[22px]">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-prose font-body text-[15px] text-[var(--text-secondary)]">{s.desc}</p>
              </div>
            </motion.li>
            ))}
          </ol>
        </div>
        <ol className="mb-0 hidden list-none pl-0 md:grid md:grid-cols-4 md:gap-3">
          {processSteps.map((s, i) => (
            <motion.li
              key={s.n}
              className="relative text-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
            >
              {i < processSteps.length - 1 ? (
                <div
                  className="absolute left-[50%] top-9 z-0 w-[calc(100%-0.5rem)] translate-x-1/2 border-t-2 border-dashed border-red-500/50"
                  aria-hidden
                />
              ) : null}
              <div className="relative z-[1] mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--red)] font-data text-[16px] font-bold text-white">
                {s.n}
              </div>
              <div className="mt-4">
                <PBIconify icon={s.icon} className="mx-auto text-2xl text-[var(--red)]" />
                <h3 className="mt-3 font-display text-[20px] uppercase text-[var(--text-primary)] lg:text-[22px]">
                  {s.title}
                </h3>
                <p className="mt-1.5 px-1 font-body text-[15px] text-[var(--text-secondary)]">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function GetInTouchSection() {
  return (
    <section className="section" aria-labelledby="tb-get-in-touch">
      <div className="container-pb">
        <motion.div
          className="pb-card mx-auto max-w-2xl p-8 text-center md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
        >
          <h2
            id="tb-get-in-touch"
            className="font-display text-[clamp(28px,5vw,44px)] uppercase leading-tight tracking-[0.04em] text-[var(--text-primary)]"
          >
            Like what you see?
          </h2>
          <p className="mt-4 font-body text-[18px] leading-[1.7] text-[var(--text-secondary)]">Get in touch to learn more.</p>
          <div className="mt-8 flex justify-center">
            <RedButton href="#contact" size="lg">
              GET IN TOUCH →
            </RedButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialsBlock({
  active,
  onDotClick,
  isNarrow,
}: {
  active: number
  onDotClick: (i: number) => void
  isNarrow: boolean
}) {
  const id = useId()
  return (
    <section className="section" aria-labelledby="tb-testimonials">
      <div className="container-pb">
        <SectionTitle label="TRUSTED BY COMPANIES" title="WHAT TEAMS SAY" />
        <h2 id="tb-testimonials" className="sr-only">
          Testimonials
        </h2>
        {isNarrow ? (
          <div>
            <div
              className="flex snap-x snap-mandatory overflow-x-hidden rounded-[var(--radius-lg)]"
              role="region"
              aria-roledescription="carousel"
              aria-label="Client testimonials"
            >
              {tbTestimonials.map((m, i) => (
                <div
                  key={m.id}
                  id={`${id}-t-${i}`}
                  className="w-full min-w-full flex-shrink-0 snap-center px-1"
                  style={{ display: i === active ? 'block' : 'none' }}
                >
                  <TCard m={m} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Testimonial slides">
              {tbTestimonials.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className="min-h-[44px] min-w-[44px] p-0"
                  aria-pressed={i === active}
                  aria-label={`View testimonial ${i + 1}`}
                  onClick={() => onDotClick(i)}
                >
                  <span
                    className="mx-1.5 my-1 block h-2.5 w-2.5 rounded-full"
                    style={{ background: i === active ? 'var(--red)' : 'var(--text-muted)' }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tbTestimonials.map((m) => (
              <div key={m.id}>
                <TCard m={m} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TCard({ m }: { m: (typeof tbTestimonials)[number] }) {
  return (
    <article className="pb-card flex h-full min-h-0 flex-col p-6 sm:p-7">
      <div className="mb-2 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <PBIcon key={i} name="star" className="text-[18px] text-[var(--red)]" />
        ))}
      </div>
      <p className="font-body text-[16px] italic leading-[1.8] text-[#C8C4D4] sm:text-[17px]">&ldquo;{m.quote}&rdquo;</p>
      <div className="mt-6 flex flex-1 items-end gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--bg-raised)] font-data text-lg font-bold text-white">
          {m.companyInitial}
        </div>
        <div>
          <p className="font-body text-[16px] font-bold text-white">{m.name}</p>
          <p className="font-body text-[14px] text-[var(--text-secondary)]">{m.role}</p>
        </div>
      </div>
    </article>
  )
}
