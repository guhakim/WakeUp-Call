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
    for (const alarm of alarms) {
      const key = `${alarm.id}-${now.toDateString()}`
      if (firedRef.current.has(key)) continue

      const alarmH = alarm.hour
      const alarmM = alarm.minute
      const nowH = now.getHours()
      const nowM = now.getMinutes()
      const nowS = now.getSeconds()

      // 알람 시간 정각 ±30초 이내
      const alarmTotal = alarmH * 60 + alarmM
      const nowTotal = nowH * 60 + nowM
      const diff = nowTotal - alarmTotal

      if (diff === 0 && nowS < 30) {
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
