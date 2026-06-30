import { useRef, useCallback } from 'react'

let sharedCtx = null

function getCtx() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return sharedCtx
}

/* AudioContext resume — 비동기 처리 */
async function ensureRunning() {
  const ctx = getCtx()
  if (ctx.state !== 'running') {
    try { await ctx.resume() } catch {}
  }
  return ctx
}

/* 사용자 상호작용마다 unlock 시도 (once 제거 — 백그라운드 복귀 대응) */
function unlockAudio() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  try {
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch {}
}

if (typeof window !== 'undefined') {
  ['touchstart', 'touchend', 'click', 'keydown', 'pointerdown'].forEach((e) =>
    window.addEventListener(e, unlockAudio, { passive: true })
  )
}

/* 실제 삐-삐 소리 재생 */
function playTones(ctx) {
  const t = ctx.currentTime
  const gain = ctx.createGain()
  gain.connect(ctx.destination)

  [[0, 0.18], [0.3, 0.48]].forEach(([s, e]) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(1000, t + s)
    osc.frequency.linearRampToValueAtTime(1350, t + (s + e) / 2)
    osc.frequency.linearRampToValueAtTime(1000, t + e)
    osc.connect(gain)
    osc.start(t + s)
    osc.stop(t + e + 0.01)
  })

  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(1.0, t + 0.02)
  gain.gain.setValueAtTime(1.0, t + 0.46)
  gain.gain.linearRampToValueAtTime(0, t + 0.52)
}

export function useAlarmSound() {
  const intervalRef = useRef(null)
  const vibrateRef  = useRef(null)

  const beep = useCallback(async () => {
    const ctx = await ensureRunning()
    playTones(ctx)
  }, [])

  const start = useCallback(async () => {
    /* 1) AudioContext 확실히 깨우기 */
    const ctx = await ensureRunning()

    /* 2) 첫 번째 비프 즉시 재생 */
    playTones(ctx)

    /* 3) 1.2초마다 반복 */
    intervalRef.current = setInterval(beep, 1200)

    /* 4) 진동 — Android 지원, iOS 미지원 */
    if (navigator.vibrate) {
      navigator.vibrate([500, 150, 500, 150, 500])
      vibrateRef.current = setInterval(() => {
        navigator.vibrate([500, 150, 500, 150, 500])
      }, 1400)
    }
  }, [beep])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    clearInterval(vibrateRef.current)
    intervalRef.current = null
    vibrateRef.current  = null
    if (navigator.vibrate) navigator.vibrate(0)
  }, [])

  return { start, stop }
}
