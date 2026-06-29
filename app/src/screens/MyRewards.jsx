import BottomNav from '../components/BottomNav'
import './MyRewards.css'

const GIFTICONS = [
  { name: '스타벅스 아메리카노', pts: 500, emoji: '☕' },
  { name: 'CU 편의점 3천원권', pts: 300, emoji: '🏪' },
  { name: 'GS25 2천원권',       pts: 200, emoji: '🏬' },
]

export default function MyRewards({ onNavigate, rewards }) {
  return (
    <div className="screen rewards-screen">

      <div className="rewards-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← 뒤로</button>
        <span className="rewards-title">포인트 내역</span>
        <button className="reset-btn" onClick={rewards.resetForDemo}>초기화</button>
      </div>

      {/* 총 포인트 */}
      <div className="points-hero card">
        <div className="points-hero-label">내 포인트</div>
        <div className="points-hero-value">{rewards.points} pt</div>
        <div className="points-hero-streak">🔥 {rewards.streak}일 연속 기상</div>

        <div className="reward-bar-wrap">
          <div className="reward-bar">
            <div className="reward-bar-fill" style={{ width: `${rewards.progressPercent}%` }} />
          </div>
          <div className="reward-bar-labels">
            <span>{rewards.points}pt</span>
            <span>목표 {rewards.goalPoints}pt</span>
          </div>
        </div>
      </div>

      {/* 기프티콘 교환 */}
      <div className="section-title">🎁 기프티콘 교환</div>
      <div className="gifticon-list">
        {GIFTICONS.map((g) => (
          <div key={g.name} className="gifticon-item card">
            <span className="gifticon-emoji">{g.emoji}</span>
            <div className="gifticon-info">
              <div className="gifticon-name">{g.name}</div>
              <div className="gifticon-pts">{g.pts} pt</div>
            </div>
            <button
              className={`gifticon-btn ${rewards.points >= g.pts ? 'active' : 'disabled'}`}
              disabled={rewards.points < g.pts}
            >
              {rewards.points >= g.pts ? '교환' : '부족'}
            </button>
          </div>
        ))}
      </div>

      {/* 적립 내역 */}
      <div className="section-title">📋 적립 내역</div>
      <div className="history-list">
        {rewards.history.length === 0 ? (
          <div className="history-empty">아직 적립 내역이 없어요 😴</div>
        ) : (
          rewards.history.map((h) => (
            <div key={h.id} className="history-item">
              <div className="history-left">
                <div className="history-reason">{h.reason}</div>
                <div className="history-date">{h.date}</div>
              </div>
              <span className="history-amount">+{h.amount} pt</span>
            </div>
          ))
        )}
      </div>
      <BottomNav current="rewards" onNavigate={onNavigate} />
    </div>
  )
}
