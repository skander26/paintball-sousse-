let audioCtx: AudioContext | null = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext()
    } catch {
      return null
    }
  }
  return audioCtx
}

export async function unlockSounds() {
  const ctx = getCtx()
  if (ctx?.state === 'suspended') await ctx.resume()
}

function synth(freq: number, endFreq: number, gain: number, dur: number) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g)
    g.connect(ctx.destination)
    osc.frequency.value = freq
    if (endFreq) {
      osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + dur)
    }
    g.gain.setValueAtTime(gain, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch {
    /* ignore */
  }
}

export const sounds = {
  click: () => {
    void unlockSounds()
    synth(800, 400, 0.08, 0.3)
  },
  select: () => {
    void unlockSounds()
    synth(600, 0, 0.15, 0.1)
    setTimeout(() => synth(900, 0, 0.15, 0.1), 120)
  },
  confirm: () => {
    void unlockSounds()
    ;[400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => synth(f, 0, 0.12, 0.4), i * 60)
    })
  },
  error: () => {
    void unlockSounds()
    synth(200, 150, 0.1, 0.2)
  },
}
