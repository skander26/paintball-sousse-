'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  radius: number
  opacity: number
  speedY: number
  speedX: number
  phase: number
  driftAmp: number
  driftFreq: number
  hasTrail: boolean
  trail: { x: number; y: number; opacity: number }[]
  trailMax: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ running: false, raf: 0, time: 0 })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const state = stateRef.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    const count = () => {
      const mobile = window.innerWidth < 768
      const lowEnd = (navigator.hardwareConcurrency ?? 4) <= 2
      if (lowEnd) return 18
      if (mobile) return 32
      return 60
    }

    const makeParticle = (w: number, h: number, startY?: number): Particle => {
      const radii = [2, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11]
      const r = radii[Math.floor(Math.random() * radii.length)]!
      const large = r >= 8
      const mid = r >= 5
      const hasTrail = Math.random() < 0.12
      return {
        x: Math.random() * w,
        y: startY ?? Math.random() * h,
        radius: r,
        opacity: large
          ? 0.65 + Math.random() * 0.35
          : mid
            ? 0.3 + Math.random() * 0.3
            : 0.12 + Math.random() * 0.18,
        speedY: -(0.25 + Math.random() * 0.45 + r * 0.025),
        speedX: (Math.random() - 0.5) * 0.06,
        phase: Math.random() * Math.PI * 2,
        driftAmp: 0.4 + Math.random() * 1.0,
        driftFreq: 0.008 + Math.random() * 0.012,
        hasTrail,
        trail: [],
        trailMax: hasTrail ? 8 + Math.floor(Math.random() * 10) : 0,
      }
    }

    const init = (w: number, h: number) => {
      particlesRef.current = Array.from({ length: count() }, () => makeParticle(w, h))
    }

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init(w, h)
    }

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.fillStyle = '#0F0E11'
      ctx.fillRect(0, 0, w, h)

      state.time++

      for (const p of particlesRef.current) {
        if (p.hasTrail) {
          p.trail.push({ x: p.x, y: p.y, opacity: p.opacity })
          if (p.trail.length > p.trailMax) p.trail.shift()
        }

        p.y += p.speedY
        p.x += p.speedX + Math.sin(state.time * p.driftFreq + p.phase) * p.driftAmp * 0.015

        if (p.y + p.radius < 0) {
          Object.assign(p, makeParticle(w, h, h + p.radius))
          p.trail = []
        }
        if (p.x < -p.radius) p.x = w + p.radius
        if (p.x > w + p.radius) p.x = -p.radius

        if (p.hasTrail && p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const t = p.trail[i]!
            const prev = p.trail[i - 1]!
            const progress = i / p.trail.length
            const trailOpacity = p.opacity * progress * 0.5
            const trailRadius = p.radius * progress * 0.7

            ctx.save()
            ctx.globalAlpha = trailOpacity
            ctx.fillStyle = '#C8001A'
            ctx.beginPath()
            ctx.arc(t.x, t.y, Math.max(trailRadius, 1), 0, Math.PI * 2)
            ctx.fill()

            if (i < p.trail.length - 1) {
              ctx.strokeStyle = '#C8001A'
              ctx.lineWidth = trailRadius * 1.2
              ctx.lineCap = 'round'
              ctx.beginPath()
              ctx.moveTo(prev.x, prev.y)
              ctx.lineTo(t.x, t.y)
              ctx.stroke()
            }
            ctx.restore()
          }
        }

        ctx.save()
        ctx.globalAlpha = p.opacity

        if (p.radius >= 8) {
          ctx.shadowColor = '#E8001C'
          ctx.shadowBlur = 10
        }

        ctx.fillStyle = '#E8001C'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        if (p.radius >= 4) {
          ctx.shadowBlur = 0
          ctx.globalAlpha = p.opacity * 0.6
          ctx.fillStyle = 'rgba(255,255,255,0.45)'
          ctx.beginPath()
          ctx.arc(
            p.x - p.radius * 0.28,
            p.y - p.radius * 0.28,
            p.radius * 0.32,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }

        ctx.shadowBlur = 0
        ctx.restore()
      }

      state.raf = requestAnimationFrame(draw)
    }

    resize()

    if (reduced) {
      ctx.fillStyle = '#0F0E11'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of particlesRef.current) {
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = '#E8001C'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      return
    }

    state.running = true
    state.raf = requestAnimationFrame(draw)

    const onResize = () => resize()
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(state.raf)
      } else {
        state.raf = requestAnimationFrame(draw)
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(state.raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
      style={{ background: '#0F0E11' }}
    />
  )
}
