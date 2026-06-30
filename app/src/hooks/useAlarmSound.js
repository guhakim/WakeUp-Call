import { useRef, useCallback } from 'react'

let _ctx = null

function getCtx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return _ctx
}

/* 컨텍스트 unlock 후 즉시 실행할 콜백 (iOS 대응) */
let _pendingPlay = null

function tryUnlock() {
  const c = getCtx()
  c.resume()
    .then(() => {
      if (c.state === 'running' && _pendingPlay) {
        _pendingPlay()         // 터치 즉시 소리 재생
        _pendingPlay = null
      }
    })
    .catch(() => {})
}

if (typeof window !== 'undefined') {
  ['touchstart', 'pointerdown', 'click'].forEach((e) =>
    window.addEventListener(e, tryUnlock, { passive: true })
  )
}

/* 삐-삐 두 음 재생 */
function playTones(c) {
  if (c.state !== 'running') return   // suspended면 건너뜀 — interval이 재시도
  const t = c.currentTime
  const gain = c.createGain()
  gain.connect(c.destination)

  [[0, 0.2], [0.32, 0.52]].forEach(([s, e]) => {
    const osc = c.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(880, t + s)
    osc.frequency.linearRampToValueAtTime(1200, t + (s + e) / 2)
    osc.frequency.linearRampToValueAtTime(880, t + e)
    osc.connect(gain)
    osc.start(t + s)
    osc.stop(t + e + 0.01)
  })

  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(1.0, t + 0.03)
  gain.gain.setValueAtTime(1.0, t + 0.5)
  gain.gain.linearRampToValueAtTime(0, t + 0.56)
}

export function useAlarmSound() {
  const intervalRef = useRef(null)
  const vibrateRef  = useRef(null)

  const start = useCallback(() => {
    if (intervalRef.current) return   // 이미 재생 중 — 중복 방지

    const c = getCtx()
    c.resume().catch(() => {})        // 비동기 — 결과 무관하게 진행

    if (c.state === 'running') {
      // 컨텍스트가 이미 활성 → 즉시 소리 재생
      playTones(c)
    } else {
      // suspended → 다음 사용자 터치 때 즉시 재생하도록 등록
      _pendingPlay = () => playTones(getCtx())
    }

    // 1.2초마다 재시도 (컨텍스트가 나중에 활성화돼도 소리 남)
    intervalRef.current = setInterval(() => playTones(getCtx()), 1200)

    // 진동 (Android)
    if (navigator.vibrate) {
      navigator.vibrate([500, 150, 500, 150, 500])
      vibrateRef.current = setInterval(
        () => navigator.vibrate([500, 150, 500, 150, 500]),
        1400
      )
    }
  }, [])

  const stop = useCallback(() => {
    _pendingPlay = null
    clearInterval(intervalRef.current)
    clearInterval(vibrateRef.current)
    intervalRef.current = null
    vibrateRef.current  = null
    if (navigator.vibrate) navigator.vibrate(0)
  }, [])

  return { start, stop }
}
