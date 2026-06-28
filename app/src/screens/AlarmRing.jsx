import { useEffect, useState } from 'react'
import './AlarmRing.css'

export default function AlarmRing({ onNavigate }) {
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <div className="screen ring-screen">
      <div className={`ring-box ${shake ? 'shake' : ''}`}>
        <div className="ring-emoji">ヽ(°〇°)ﾉ</div>
        <div className="ring-time">{fmt(now.getHours())}:{fmt(now.getMinutes())}</div>
        <div className="ring-msg">!! 일어나세요 !!</div>
      </div>

      <div className="ring-actions">
        <button
          className="btn green"
          style={{ marginBottom: 14 }}
          onClick={() => onNavigate('complete')}
        >
          나 일어났어요! ✓
        </button>

        <button
          className="btn sky"
          onClick={() => onNavigate('home')}
        >
          5분만 더... 😴
        </button>
      </div>

      <div className="ring-warning">
        5분 후에 전화 드릴게요 📞
      </div>
    </div>
  )
}
