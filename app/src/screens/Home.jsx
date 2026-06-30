import { useState, useCallback, useEffect } from 'react'
import { useAlarmTimer } from '../hooks/useAlarmTimer'
import { addToCalendar } from '../utils/icsGenerator'
import BottomNav from '../components/BottomNav'
import './Home.css'

const fmt = (n) => String(n).padStart(2, '0')

const ALARMS_KEY = 'wakeup_alarms'
const DEFAULT_ALARMS = [{ id: 1, hour: 7, minute: 30, label: '출근' }]

const loadAlarms = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(ALARMS_KEY))
    return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_ALARMS
  } catch {
    return DEFAULT_ALARMS
  }
}

export default function Home({ onNavigate, onAlarmFired, rewards }) {
  const [alarms, setAlarms]       = useState(loadAlarms)
  // mode: null | 'add' | 'edit'
  const [mode, setMode]           = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [hour, setHour]           = useState(7)
  const [minute, setMinute]       = useState(30)
  const [memo, setMemo]           = useState('')

  useEffect(() => {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms))
  }, [alarms])

  const handleAlarmTrigger = useCallback((alarm) => {
    onAlarmFired(alarm)
    onNavigate('ring')
  }, [onAlarmFired, onNavigate])

  const { now, getNextAlarm } = useAlarmTimer(alarms, handleAlarmTrigger)

  /* ── 추가 ── */
  const openAdd = () => {
    setHour(7); setMinute(0); setMemo(''); setEditingId(null); setMode('add')
  }

  const confirmAdd = () => {
    setAlarms(prev => [...prev, { id: Date.now(), hour, minute, memo }])
    setMode(null)
  }

  /* ── 수정 ── */
  const openEdit = (a) => {
    setHour(a.hour); setMinute(a.minute); setMemo(a.memo ?? ''); setEditingId(a.id); setMode('edit')
  }

  const confirmEdit = () => {
    setAlarms(prev => prev.map(a =>
      a.id === editingId ? { ...a, hour, minute, memo } : a
    ))
    setMode(null)
  }

  /* ── 삭제 ── */
  const removeAlarm = (id, e) => {
    e.stopPropagation()
    setAlarms(prev => prev.filter(a => a.id !== id))
  }

  const closeSheet = () => setMode(null)

  const nextInfo = getNextAlarm()
  const isEdit   = mode === 'edit'

  return (
    <div className="screen home-screen">

      {/* ── 상단 헤더 ── */}
      <div className="home-header">
        <span className="home-logo">
          웨이크업 콜
          <svg className="logo-sun" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="8.5" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="20"   y1="3"    x2="20.5" y2="8"    stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="20"   y1="32"   x2="19.5" y2="37"   stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="3"    y1="20"   x2="8"    y2="20.5" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="32"   y1="20"   x2="37"   y2="19.5" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="7"    y1="7.5"  x2="11"   y2="11.5" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="29"   y1="29.5" x2="33"   y2="33"   stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="32.5" y1="7.5"  x2="28.5" y2="11.5" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="7.5"  y1="32"   x2="11.5" y2="28"   stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </span>
        <button className="home-points" onClick={() => onNavigate('rewards')}>
          🌟 {rewards?.points ?? 0}pt
        </button>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="home-content">

        {/* 현재 시각 */}
        <div className="clock-area">
          <div className="clock-circle">
            <span className="clock-time">
              {fmt(now.getHours())}:{fmt(now.getMinutes())}
            </span>
            <span className="clock-seconds">{fmt(now.getSeconds())}</span>
            <span className="clock-label">
              {nextInfo ? `다음 알람까지 ${nextInfo.minutesLeft}분` : '알람 없음'}
            </span>
          </div>
        </div>

        {/* 알람 목록 */}
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
              <div key={a.id} className="alarm-item card" onClick={() => openEdit(a)}>
                <div className="alarm-item-left">
                  <div className="alarm-time">{fmt(a.hour)}:{fmt(a.minute)}</div>
                  {a.memo ? <div className="alarm-sublabel">{a.memo}</div> : null}
                  <button
                    className="alarm-cal-btn"
                    onClick={(e) => { e.stopPropagation(); addToCalendar(a) }}
                  >
                    + 캘린더 추가
                  </button>
                </div>
                <div className="alarm-item-right">
                  <button className="alarm-del" onClick={(e) => removeAlarm(a.id, e)}>✕</button>
                  <span className="alarm-edit-hint">수정하기</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-notice">📞 못 일어나면 서버에서 전화드려요</div>
      </div>

      {/* ── FAB ── */}
      <button className="fab" onClick={openAdd}>
        + 알람 추가
      </button>

      {/* ── 바텀시트 (추가 / 수정 공용) ── */}
      {mode && (
        <div className="sheet-overlay" onClick={closeSheet}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              {isEdit ? '알람 수정' : '알람 추가'}
            </div>
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

            <input
              className="memo-input"
              type="text"
              placeholder="메모 (예: 25일 오전 미팅 중요 !!)"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              maxLength={30}
            />

            <div className="sheet-preview">
              {fmt(hour)}:{fmt(minute)} {memo ? `· ${memo}` : '알람이 ' + (isEdit ? '수정' : '추가') + '됩니다'}
            </div>

            <button className="btn" onClick={isEdit ? confirmEdit : confirmAdd}>
              {isEdit ? '수정하기 ✓' : '추가하기 ✓'}
            </button>

            {isEdit && (
              <button className="btn sky sheet-del-btn" onClick={() => {
                setAlarms(prev => prev.filter(a => a.id !== editingId))
                setMode(null)
              }}>
                이 알람 삭제하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 하단 네비게이션 ── */}
      <BottomNav current="home" onNavigate={onNavigate} />
    </div>
  )
}
