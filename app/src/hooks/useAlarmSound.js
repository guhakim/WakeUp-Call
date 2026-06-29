import { useRef, useCallback } from 'react'

/*
 * 전역 AudioContext 싱글톤.
 * iOS Safari는 사용자 터치/클릭 이전에 AudioContext가 suspended 상태이므로
 * 첫 번째 사용자 상호작용에서 unlock 처리한다.
 */
let sharedCtx = null

function getCtx() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return sharedCtx
}

function unlockCtx() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  // 무음 버퍼 재생으로 iOS AudioContext 완전 활성화
  const buf = ctx.createBuffer(1, 1, 22050)
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', unlockCtx, { once: true, passive: true })
  window.addEventListener('click',      unlockCtx, { once: true, passive: true })
}

export function useAlarmSound() {
  const intervalRef = useRef(null)
  const vibrateRef  = useRef(null)

  const beep = useCallback(() => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const t = ctx.currentTime
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    // "삐삐" 두 번 패턴 — square파로 알람다운 소리
    [[0, 0.18], [0.28, 0.46]].forEach(([start, end]) => {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(1000, t + start)
      osc.frequency.linearRampToValueAtTime(1300, t + (start + end) / 2)
      osc.frequency.linearRampToValueAtTime(1000, t + end)
      osc.connect(gain)
      osc.start(t + start)
      osc.stop(t + end)
    })

    // 볼륨 엔벨로프
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.9, t + 0.02)
    gain.gain.setValueAtTime(0.9, t + 0.44)
    gain.gain.linearRampToValueAtTime(0,   t + 0.5)
  }, [])

  const start = useCallback(() => {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    beep()
    intervalRef.current = setInterval(beep, 1200)

    // 진동 API (Android 지원, iOS는 무시)
    if (navigator.vibrate) {
      navigator.vibrate([400, 200, 400])
      vibrateRef.current = setInterval(() => {
        navigator.vibrate([400, 200, 400])
      }, 1200)
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
