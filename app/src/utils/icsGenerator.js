const pad = (n) => String(n).padStart(2, '0')

function fmtLocal(date) {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

export function addToCalendar(alarm) {
  const { hour, minute, memo, id } = alarm

  // 오늘 알람 시간 — 이미 지났으면 내일로
  const alarmDate = new Date()
  alarmDate.setHours(hour, minute, 0, 0)
  if (alarmDate <= new Date()) {
    alarmDate.setDate(alarmDate.getDate() + 1)
  }

  const endDate = new Date(alarmDate.getTime() + 5 * 60 * 1000) // 5분 뒤 종료
  const title   = memo || `웨이크업 콜 ${pad(hour)}:${pad(minute)}`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WakeUp Call//KR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wakeup-${id}-${Date.now()}@wakeupcall`,
    `DTSTART:${fmtLocal(alarmDate)}`,
    `DTEND:${fmtLocal(endDate)}`,
    `SUMMARY:${title}`,
    'RRULE:FREQ=DAILY',          // 매일 반복 (일반 알람처럼)
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',             // 이벤트 시작 시 즉시 알람
    'ACTION:AUDIO',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url  = URL.createObjectURL(blob)

  // iOS Safari: <a> 클릭 → MIME type 'text/calendar' 인식 → 캘린더 앱 연결
  const a = document.createElement('a')
  a.href     = url
  a.download = `wakeup-${pad(hour)}${pad(minute)}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
