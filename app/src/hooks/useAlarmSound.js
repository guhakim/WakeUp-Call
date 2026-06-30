import { useRef, useCallback } from 'react'

/* ── WAV 비프음 생성 (AudioContext 없이 — iOS 최대 호환) ── */
function buildBeepWAV() {
  const rate       = 22050
  const duration   = 0.55
  const n          = Math.floor(rate * duration)
  const buf        = new ArrayBuffer(44 + n * 2)
  const v          = new DataView(buf)
  const str        = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }

  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true)
  str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true); v.setUint16(20, 1, true)  // PCM
  v.setUint16(22, 1, true)                              // mono
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true)
  v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  str(36, 'data'); v.setUint32(40, n * 2, true)

  // 두 톤 square wave: 0~0.22s → 880Hz / 0.3~0.52s → 1100Hz
  const tones = [[0, 0.22, 880], [0.3, 0.52, 1100]]
  for (let i = 0; i < n; i++) {
    const t = i / rate
    let val = 0
    for (const [s, e, hz] of tones) {
      if (t >= s && t < e) {
        const phase = (t * hz) % 1
        const raw   = phase < 0.5 ? 22000 : -22000
        const rel   = (t - s) / (e - s)
        const env   = rel < 0.05 ? rel / 0.05 : rel > 0.93 ? (1 - rel) / 0.07 : 1
        val = Math.round(raw * env)
        break
      }
    }
    v.setInt16(44 + i * 2, val, true)
  }
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
}

/* 모듈 단위로 한 번만 생성 */
let _url = null
const beepURL = () => { if (!_url) _url = buildBeepWAV(); return _url }

/* ── Hook ── */
export function useAlarmSound() {
  const audioRef    = useRef(null)
  const intervalRef = useRef(null)
  const vibrateRef  = useRef(null)

  /* Audio 요소 — 사용자 제스처로 play() 시 iOS 허용됨 */
  function audio() {
    if (!audioRef.current) audioRef.current = new Audio(beepURL())
    return audioRef.current
  }

  /* 비프 한 번 — 화면 터치 핸들러에서 직접 호출 */
  const tryPlay = useCallback(() => {
    const a = audio()
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  /* 알람 시작 */
  const start = useCallback(() => {
    tryPlay()                                        // 즉시 1회
    if (!intervalRef.current) {
      intervalRef.current = setInterval(tryPlay, 1200)  // 1.2초마다 반복
    }
    if (navigator.vibrate && !vibrateRef.current) {
      navigator.vibrate([500, 150, 500, 150, 500])
      vibrateRef.current = setInterval(
        () => navigator.vibrate([500, 150, 500, 150, 500]), 1400
      )
    }
  }, [tryPlay])

  /* 알람 정지 */
  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    clearInterval(vibrateRef.current)
    intervalRef.current = null
    vibrateRef.current  = null
    audioRef.current?.pause()
    if (navigator.vibrate) navigator.vibrate(0)
  }, [])

  return { start, stop, tryPlay }
}
