import { useState, useCallback } from 'react'
import { useAlarmTimer } from '../hooks/useAlarmTimer'
import './Home.css'

const fmt = (n) => String(n).padStart(2, '0')

export default function Home({ onNavigate, onAlarmFired, rewards }) {
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(30)
  const [alarms, setAlarms] = useState([
    { id: 1, hour: 7, minute: 30, label: '출근' },
  ])

  const handleAlarmTrigger = useCallback((alarm) => {
    onAlarmFired(alarm)
    onNavigate('ring')
  }, [onAlarmFired, onNavigate])

  const { now, getNextAlarm } = useAlarmTimer(alarms, handleAlarmTrigger)

  const addAlarm = () => {
    setAlarms([...alarms, { id: Date.now(), hour, minute, label: '알람' }])
  }

  const removeAlarm = (id) => setAlarms(alarms.filter(a => a.id !== id))

  const nextInfo = getNextAlarm()

  return (
    <div className="screen home-screen">

      {/* 헤더 */}
      <div className="home-header">
        <span className="home-logo">웨이크업 콜 ☀️</span>
        <button className="home-points" onClick={() => onNavigate('rewards')}>
          🌟 {rewards?.points ?? 0}pt
        </button>
      </div>

      {/* 현재 시각 + 다음 알람 */}
      <div className="clock-area">
        <div className="clock-circle">
          <span className="clock-time">
            {fmt(now.getHours())}:{fmt(now.getMinutes())}
          </span>
          <span className="clock-seconds">{fmt(now.getSeconds())}</span>
          {nextInfo && (
            <span className="clock-label">
              다음 알람까지 {nextInfo.minutesLeft}분
            </span>
          )}
        </div>
      </div>

      {/* 시간 설정 */}
      <div className="time-picker card">
        <div className="picker-row">
          <div className="picker-col">
            <button className="picker-btn" onClick={() => setHour((hour + 1) % 24)}>▲</button>
            <span className="picker-val">{fmt(hour)}</span>
            <button className="picker-btn" onClick={() => setHour((hour - 1 + 24) % 24)}>▼</button>
          </div>
          <span className="picker-sep">:</span>
          <div className="picker-col">
            <button className="picker-btn" onClick={() => setMinute((minute + 5) % 60)}>▲</button>
            <span className="picker-val">{fmt(minute)}</span>
            <button className="picker-btn" onClick={() => setMinute((minute - 5 + 60) % 60)}>▼</button>
          </div>
        </div>
      </div>

      <button className="btn" style={{ marginTop: 16 }} onClick={addAlarm}>
        + 알람 추가하기
      </button>

      <hr className="divider" />

      {/* 알람 목록 */}
      <div className="alarm-list">
        {alarms.map((a) => (
          <div key={a.id} className="alarm-item card">
            <div className="alarm-item-left">
              <span className="alarm-emoji">😴</span>
              <div>
                <div className="alarm-time">{fmt(a.hour)}:{fmt(a.minute)}</div>
                <div className="alarm-sublabel">{a.label}</div>
              </div>
            </div>
            <div className="alarm-item-right">
              {/* 테스트용: 알람 즉시 발동 */}
              <button
                className="alarm-test-btn"
                onClick={() => handleAlarmTrigger(a)}
                title="테스트"
              >
                ▶
              </button>
              <button className="alarm-del" onClick={() => removeAlarm(a.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="home-footer">📞 못 일어나면 서버에서 전화드려요</div>
    </div>
  )
}
