import { useRef, useCallback } from 'react'

/* ── 비프음 재생 (컨텍스트가 running일 때만) ── */
function playBeep(ctx) {
  if (!ctx || ctx.state !== 'running') return
  const t = ctx.currentTime
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(1.0, t + 0.02)
  gain.gain.setValueAtTime(1.0, t + 0.42)
  gain.gain.linearRampToValueAtTime(0, t + 0.48)

  [[0, 0.48], [0.6, 1.08]].forEach(([s, e]) => {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, t + s)
    osc.frequency.linearRampToValueAtTime(1200, t + (s + e) / 2)
    osc.frequency.linearRampToValueAtTime(880, t + e)
    osc.connect(gain)
    osc.start(t + s)
    osc.stop(t + e + 0.01)
  })
}

export function useAlarmSound() {
  const ctxRef      = useRef(null)
  const intervalRef = useRef(null)
  const vibrateRef  = useRef(null)

  /* AudioContext 생성 — 사용자 제스처 안에서 호출 시 iOS도 running 상태 */
  function ensureCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }

  /* 터치/클릭 핸들러에서 직접 호출 — resume + 즉시 재생 */
  const tryPlay = useCallback(() => {
    const ctx = ensureCtx()
    // resume은 사용자 제스처 컨텍스트 안에서 동기 호출 → iOS 허용
    ctx.resume().then(() => {
      playBeep(ctx)
    }).catch(() => {})
    // resume 전이라도 시도 (Android / 이미 running인 경우)
    playBeep(ctx)
  }, [])

  /* 알람 시작 — useEffect에서 한 번 호출 */
  const start = useCallback(() => {
    tryPlay()

    // 1.2초마다 재시도 (컨텍스트가 나중에 활성화돼도 울림)
    if (!intervalRef.current) {
      intervalRef.current = setInterval(tryPlay, 1200)
    }

    // 진동 (Android)
    if (navigator.vibrate && !vibrateRef.current) {
      navigator.vibrate([500, 150, 500, 150, 500])
      vibrateRef.current = setInterval(
        () => navigator.vibrate([500, 150, 500, 150, 500]),
        1400
      )
    }
  }, [tryPlay])

  /* 알람 정지 */
  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    clearInterval(vibrateRef.current)
    intervalRef.current = null
    vibrateRef.current  = null
    if (navigator.vibrate) navigator.vibrate(0)
    // 컨텍스트 일시정지 (배터리 절약)
    ctxRef.current?.suspend().catch(() => {})
  }, [])

  return { start, stop, tryPlay }
}
