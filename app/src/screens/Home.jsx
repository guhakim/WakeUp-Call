import { useState } from 'react'
import './Home.css'

export default function Home({ onNavigate }) {
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(30)
  const [alarms, setAlarms] = useState([
    { id: 1, hour: 7, minute: 30, label: '출근' },
  ])

  const addAlarm = () => {
    const newAlarm = { id: Date.now(), hour, minute, label: '알람' }
    setAlarms([...alarms, newAlarm])
  }

  const removeAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id))
  }

  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <div className="screen home-screen">
      {/* 헤더 */}
      <div className="home-header">
        <span className="home-logo">웨이크업 콜 ☀️</span>
        <span className="home-points">🌟 320pt</span>
      </div>

      {/* 시계 */}
      <div className="clock-area">
        <div className="clock-circle">
          <span className="clock-time">{fmt(hour)}:{fmt(minute)}</span>
          <span className="clock-label">내일 기상 시간</span>
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

      {/* 알람 추가 버튼 */}
      <button className="btn" style={{ marginTop: 16 }} onClick={addAlarm}>
        + 알람 추가하기
      </button>

      <hr className="divider" />

      {/* 알람 목록 */}
      <div className="alarm-list">
        {alarms.map((a) => (
          <div key={a.id} className="alarm-item card" onClick={() => onNavigate('ring')}>
            <div className="alarm-item-left">
              <span className="alarm-emoji">😴</span>
              <div>
                <div className="alarm-time">{fmt(a.hour)}:{fmt(a.minute)}</div>
                <div className="alarm-sublabel">{a.label}</div>
              </div>
            </div>
            <button className="alarm-del" onClick={(e) => { e.stopPropagation(); removeAlarm(a.id) }}>✕</button>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="home-footer">
        📞 못 일어나면 서버에서 전화드려요
      </div>
    </div>
  )
}
