import { useState, useCallback } from 'react'
import { useAlarmTimer } from '../hooks/useAlarmTimer'
import BottomNav from '../components/BottomNav'
import './Home.css'

const fmt = (n) => String(n).padStart(2, '0')

export default function Home({ onNavigate, onAlarmFired, rewards }) {
  const [alarms, setAlarms] = useState([
    { id: 1, hour: 7, minute: 30, label: '출근' },
  ])
  const [showPicker, setShowPicker] = useState(false)
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(30)

  const handleAlarmTrigger = useCallback((alarm) => {
    onAlarmFired(alarm)
    onNavigate('ring')
  }, [onAlarmFired, onNavigate])

  const { now, getNextAlarm } = useAlarmTimer(alarms, handleAlarmTrigger)

  const addAlarm = () => {
    setAlarms([...alarms, { id: Date.now(), hour, minute, label: '알람' }])
    setShowPicker(false)
  }

  const removeAlarm = (id) => setAlarms(alarms.filter(a => a.id !== id))

  const nextInfo = getNextAlarm()

  return (
    <div className="screen home-screen">

      {/* ── 상단 헤더 ── */}
      <div className="home-header">
        <span className="home-logo">웨이크업 콜 ☀️</span>
        <button className="home-points" onClick={() => onNavigate('rewards')}>
          🌟 {rewards?.points ?? 0}pt
        </button>
      </div>

      {/* ── 스크롤 가능한 메인 콘텐츠 ── */}
      <div className="home-content">

        {/* 현재 시각 */}
        <div className="clock-area">
          <div className="clock-circle">
            <span className="clock-time">
              {fmt(now.getHours())}:{fmt(now.getMinutes())}
            </span>
            <span className="clock-seconds">{fmt(now.getSeconds())}</span>
            <span className="clock-label">
              {nextInfo
                ? `다음 알람까지 ${nextInfo.minutesLeft}분`
                : '알람 없음'}
            </span>
          </div>
        </div>

        {/* 알람 목록 섹션 */}
        <div className="alarm-section">
          <div className="alarm-section-header">
            <span className="alarm-section-title">내 알람</span>
            <span className="alarm-count">{alarms.length}개</span>
          </div>

          {alarms.length === 0 && (
            <div className="alarm-empty">
              알람이 없어요.<br />아래 + 버튼으로 추가해보세요!
            </div>
          )}

          <div className="alarm-list">
            {alarms.map((a) => (
              <div key={a.id} className="alarm-item card">
                <div className="alarm-item-left">
                  <div className="alarm-time">{fmt(a.hour)}:{fmt(a.minute)}</div>
                  <div className="alarm-sublabel">{a.label}</div>
                </div>
                <div className="alarm-item-right">
                  <button className="alarm-del" onClick={() => removeAlarm(a.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-notice">📞 못 일어나면 서버에서 전화드려요</div>
      </div>

      {/* ── 알람 추가 FAB ── */}
      <button className="fab" onClick={() => setShowPicker(true)}>
        + 알람 추가
      </button>

      {/* ── 시간 선택 바텀시트 ── */}
      {showPicker && (
        <div className="sheet-overlay" onClick={() => setShowPicker(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">알람 시간 설정</div>
            <hr className="divider" style={{ width: '100%' }} />

            <div className="picker-row">
              <div className="picker-col">
                <button className="picker-btn" onClick={() => setHour((hour + 1) % 24)}>▲</button>
                <span className="picker-val">{fmt(hour)}</span>
                <button className="picker-btn" onClick={() => setHour((hour - 1 + 24) % 24)}>▼</button>
              </div>
              <span className="picker-sep">:</span>
              <div className="picker-col">
                <button className="picker-btn" onClick={() => setMinute((minute + 1) % 60)}>▲</button>
                <span className="picker-val">{fmt(minute)}</span>
                <button className="picker-btn" onClick={() => setMinute((minute - 1 + 60) % 60)}>▼</button>
              </div>
            </div>

            <div className="sheet-preview">
              {fmt(hour)}:{fmt(minute)} 알람이 추가됩니다
            </div>

            <button className="btn" onClick={addAlarm}>
              추가하기 ✓
            </button>
          </div>
        </div>
      )}

      {/* ── 하단 네비게이션 ── */}
      <BottomNav current="home" onNavigate={onNavigate} />
    </div>
  )
}
