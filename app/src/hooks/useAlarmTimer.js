import { useState, useEffect, useRef, useCallback } from 'react'

export function useAlarmTimer(alarms, onAlarmTrigger) {
  const [now, setNow] = useState(new Date())
  const firedRef = useRef(new Set())
  const tickRef = useRef(null)

  // 1초마다 현재 시간 갱신
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tickRef.current)
  }, [])

  // 알람 체크
  useEffect(() => {
    const nowH     = now.getHours()
    const nowM     = now.getMinutes()
    const nowS     = now.getSeconds()
    const nowTotal = nowH * 60 + nowM

    for (const alarm of alarms) {
      const key = `${alarm.id}-${now.toDateString()}`
      if (firedRef.current.has(key)) continue

      const alarmTotal = alarm.hour * 60 + alarm.minute
      const diff = nowTotal - alarmTotal  // 양수 = 알람 시간 경과 (분 단위)

      // diff === 0 : 해당 분 전체 (초 0~59) — 핵심 발동 조건
      // diff === 1 && nowS < 30 : 1분 경과했지만 30초 이내 — 백그라운드 스로틀링 대비
      if (diff === 0 || (diff === 1 && nowS < 30)) {
        firedRef.current.add(key)
        onAlarmTrigger(alarm)
        break
      }
    }
  }, [now, alarms, onAlarmTrigger])

  // 다음 알람까지 남은 시간 계산
  const getNextAlarm = useCallback(() => {
    if (!alarms.length) return null
    const nowTotal = now.getHours() * 60 + now.getMinutes()
    let min = Infinity
    let next = null
    for (const a of alarms) {
      let diff = a.hour * 60 + a.minute - nowTotal
      if (diff <= 0) diff += 24 * 60
      if (diff < min) { min = diff; next = a }
    }
    return { alarm: next, minutesLeft: min }
  }, [alarms, now])

  return { now, getNextAlarm }
}
