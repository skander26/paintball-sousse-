"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  speedX: number;
  drift: number;
  driftSpeed: number;
  phase: number;
};

const BG = "#050507";
const RED = "#E8001C";
/** Multiplicateur de vitesse (léger boost par rapport à la version initiale) */
const SPEED = 8;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const getCount = () => {
      const isMobile = window.innerWidth < 768;
      const cores = navigator.hardwareConcurrency ?? 4;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const isLowEnd = cores <= 2 || (mem !== undefined && mem <= 2);
      if (isLowEnd) return 20;
      if (isMobile) return 40;
      return 75;
    };

    const initParticles = (w: number, h: number) => {
      const count = getCount();
      const sizes = [3, 4, 5, 6, 8, 9, 10];
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)]!;
        const isLarge = size >= 8;
        const isMid = size >= 5 && size < 8;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          opacity: isLarge
            ? 0.7 + Math.random() * 0.3
            : isMid
              ? 0.35 + Math.random() * 0.3
              : 0.15 + Math.random() * 0.2,
          speedY:
            -SPEED *
            (0.08 + Math.random() * 0.18 + (size / 10) * 0.1),
          speedX: (Math.random() - 0.5) * 0.04 * SPEED,
          drift: 0.3 + Math.random() * 0.8,
          driftSpeed: SPEED * (0.002 + Math.random() * 0.004),
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(w, h);
    };

    const drawStatic = (w: number, h: number) => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      for (const p of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = RED;
        if (p.size >= 8) {
          ctx.shadowColor = RED;
          ctx.shadowBlur = 6;
        }
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    };

    const animate = () => {
      if (!runningRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      timeRef.current += 1;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (const p of particles) {
        p.y += p.speedY;
        p.x +=
          p.speedX +
          Math.sin(timeRef.current * p.driftSpeed + p.phase) * p.drift * 0.02;

        if (p.y + p.size < 0) {
          p.y = h + p.size;
          p.x = Math.random() * w;
        }
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = RED;
        if (p.size >= 8) {
          ctx.shadowColor = RED;
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }
        const rotation =
          Math.sin(timeRef.current * p.driftSpeed * 0.5 + p.phase) * 0.3;
        ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
        ctx.rotate(rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();

    if (prefersReducedMotion) {
      drawStatic(window.innerWidth, window.innerHeight);
      return undefined;
    }

    runningRef.current = true;
    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        runningRef.current = false;
        cancelAnimationFrame(rafRef.current);
      } else {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-bg pointer-events-none fixed inset-0 z-0 block h-full w-full"
      style={{ background: BG }}
      aria-hidden
    />
  );
}
