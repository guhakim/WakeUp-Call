import BottomNav from '../components/BottomNav'
import './MyRewards.css'

/* 손그림 SVG 아이콘 */
function IconCoffee() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 김 */}
      <path d="M15 6 C15 4 16.5 3 16.5 5 C16.5 7 18 8 18 6" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M21 5 C21 3 22.5 2 22.5 4 C22.5 6 24 7 24 5" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 컵 몸통 */}
      <path d="M9 14 C9.5 13.5 34 13.5 34.5 14 C34 22 32 30 30.5 32 C28 34 15.5 34 13.5 32 C11.5 30 9.5 22 9 14Z"
        stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 손잡이 */}
      <path d="M34.5 17 C38 17.5 40 19.5 40 22 C40 24.5 38 26.5 34.5 27"
        stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
      {/* 받침 */}
      <path d="M6 36 C10 35 34 35 38 36" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconConvenience() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 건물 몸통 */}
      <path d="M6 38 C6 37.5 6.5 18 6.5 18 C9 16 35 16 37.5 18 C37.5 18 38 37.5 38 38"
        stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 지붕/처마 */}
      <path d="M4 18 C8 14.5 36 14.5 40 18" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
      {/* 간판 */}
      <rect x="11" y="20" width="22" height="8" rx="2" stroke="#2D2D2D" strokeWidth="1.8"/>
      <path d="M14 24 L20 24" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M23 24 L30 24" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 문 */}
      <path d="M17 38 C17 33 17.5 31 22 31 C26.5 31 27 33 27 38"
        stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 바닥선 */}
      <path d="M4 38 C14 38.5 30 38.5 40 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 건물 */}
      <path d="M7 38 L7.5 20 L36.5 20 L37 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 지붕 삼각형 */}
      <path d="M4 20 L22 8 L40 20" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 창문 왼쪽 */}
      <rect x="9" y="24" width="9" height="8" rx="1.5" stroke="#2D2D2D" strokeWidth="1.8"/>
      {/* 창문 오른쪽 */}
      <rect x="26" y="24" width="9" height="8" rx="1.5" stroke="#2D2D2D" strokeWidth="1.8"/>
      {/* 문 */}
      <path d="M18 38 L18 33 C18 31.5 19 31 22 31 C25 31 26 31.5 26 33 L26 38"
        stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 바닥선 */}
      <path d="M4 38 C14 38.5 30 38.5 40 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

const GIFTICONS = [
  { name: '스타벅스 아메리카노', pts: 500, Icon: IconCoffee },
  { name: 'CU 편의점 3천원권',   pts: 300, Icon: IconConvenience },
  { name: 'GS25 2천원권',        pts: 200, Icon: IconStore },
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
        {GIFTICONS.map(({ name, pts, Icon }) => (
          <div key={name} className="gifticon-item card">
            <div className="gifticon-icon"><Icon /></div>
            <div className="gifticon-info">
              <div className="gifticon-name">{name}</div>
              <div className="gifticon-pts">{pts} pt</div>
            </div>
            <button
              className={`gifticon-btn ${rewards.points >= pts ? 'active' : 'disabled'}`}
              disabled={rewards.points < pts}
            >
              {rewards.points >= pts ? '교환' : '부족'}
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
