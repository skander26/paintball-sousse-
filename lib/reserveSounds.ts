"use client";

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) sharedCtx = new Ctx();
  return sharedCtx;
}

/** Resume audio context after user gesture (required by browsers). */
export function resumeAudioContext(): void {
  const ctx = getCtx();
  if (ctx?.state === "suspended") void ctx.resume();
}

/** UI click — short tone sweep (spec: 80Hz sine burst 80ms; tuned for audibility). */
export function playClick(): void {
  const ctx = getCtx();
  if (!ctx) return;
  resumeAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime;
  osc.frequency.setValueAtTime(80, t0);
  osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.07);
  gain.gain.setValueAtTime(0.22, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
  osc.start(t0);
  osc.stop(t0 + 0.085);
}

/** Character carousel navigation — short swoosh (noise burst). */
export function playSwoosh(): void {
  const ctx = getCtx();
  if (!ctx) return;
  resumeAudioContext();
  const bufferSize = ctx.sampleRate * 0.12;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.4;
  }
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  src.buffer = buffer;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

export function playSelect(): void {
  const ctx = getCtx();
  if (!ctx) return;
  resumeAudioContext();
  [600, 900].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.11);
  });
}

export function playConfirm(): void {
  const ctx = getCtx();
  if (!ctx) return;
  resumeAudioContext();
  [400, 500, 600, 800].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.05;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.42);
  });
}

let ambientNodes: { stop: () => void } | null = null;

/** Subtle wind-like noise loop — user must toggle on (no autoplay). */
export function startAmbientLoop(): void {
  const ctx = getCtx();
  if (!ctx || ambientNodes) return;
  resumeAudioContext();
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.15;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  const gain = ctx.createGain();
  gain.gain.value = 0.04;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start();
  ambientNodes = {
    stop: () => {
      try {
        src.stop();
      } catch {
        /* ignore */
      }
      gain.disconnect();
      filter.disconnect();
      ambientNodes = null;
    },
  };
}

export function stopAmbientLoop(): void {
  ambientNodes?.stop();
}
