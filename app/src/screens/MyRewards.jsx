import BottomNav from '../components/BottomNav'
import './MyRewards.css'

/* ── 손그림 SVG 아이콘 ── */

function IconClipboard() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 클립 */}
      <path d="M10 4 C10 2.5 11 2 14 2 C17 2 18 2.5 18 4 L18 6 L10 6 Z"
        stroke="#2D2D2D" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* 보드 */}
      <path d="M6 5.5 C5 5.8 4.5 6.5 4.5 7.5 L4.5 24 C4.5 25.2 5.3 26 6.5 26 L21.5 26 C22.7 26 23.5 25.2 23.5 24 L23.5 7.5 C23.5 6.5 23 5.8 22 5.5"
        stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 줄 3개 */}
      <path d="M8.5 13 L19.5 13" stroke="#2D2D2D" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8.5 17 L19.5 17" stroke="#2D2D2D" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8.5 21 L15 21"   stroke="#2D2D2D" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function IconGift() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 상자 뚜껑 */}
      <rect x="3" y="10" width="22" height="5" rx="1.5" stroke="#2D2D2D" strokeWidth="1.8"/>
      {/* 상자 몸통 */}
      <path d="M5 15 L5 25 C5 25.5 5.5 26 6 26 L22 26 C22.5 26 23 25.5 23 25 L23 15"
        stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 리본 세로 */}
      <line x1="14" y1="10" x2="14" y2="26" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 리본 고리 왼쪽 */}
      <path d="M14 10 C13 7 10 4.5 9.5 6 C9 7.5 11.5 9.5 14 10Z"
        stroke="#2D2D2D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 리본 고리 오른쪽 */}
      <path d="M14 10 C15 7 18 4.5 18.5 6 C19 7.5 16.5 9.5 14 10Z"
        stroke="#2D2D2D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconAlarm() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 종 왼쪽 */}
      <path d="M7 11 C9 8.5 7.5 5 6 6" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 종 오른쪽 */}
      <path d="M25 11 C23 8.5 24.5 5 26 6" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      {/* 시계 원 */}
      <circle cx="16" cy="19" r="10.5" stroke="#2D2D2D" strokeWidth="2"/>
      {/* 시침 */}
      <path d="M16 19 L16 13.5" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
      {/* 분침 */}
      <path d="M16 19 L20.5 22" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
      {/* 중심 점 */}
      <circle cx="16" cy="19" r="1.2" fill="#2D2D2D"/>
    </svg>
  )
}

function IconFire() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3 C14 3 17 7 16 11 C18 9 18.5 6 18 4 C22 7 24 12 22 17 C20.5 21 17 23.5 14 24 C11 23.5 7.5 21 6 17 C4 12 6 7 10 4 C9.5 6 10 9 12 11 C11 7 14 3 14 3Z"
        stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* 기프티콘 SVG */
function IconCoffee() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 6 C15 4 16.5 3 16.5 5 C16.5 7 18 8 18 6" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M21 5 C21 3 22.5 2 22.5 4 C22.5 6 24 7 24 5" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 14 C9.5 13.5 34 13.5 34.5 14 C34 22 32 30 30.5 32 C28 34 15.5 34 13.5 32 C11.5 30 9.5 22 9 14Z"
        stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34.5 17 C38 17.5 40 19.5 40 22 C40 24.5 38 26.5 34.5 27" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M6 36 C10 35 34 35 38 36" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconConvenience() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 38 C6 37.5 6.5 18 6.5 18 C9 16 35 16 37.5 18 C37.5 18 38 37.5 38 38"
        stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 18 C8 14.5 36 14.5 40 18" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
      <rect x="11" y="20" width="22" height="8" rx="2" stroke="#2D2D2D" strokeWidth="1.8"/>
      <path d="M14 24 L20 24" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M23 24 L30 24" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 38 C17 33 17.5 31 22 31 C26.5 31 27 33 27 38"
        stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 38 C14 38.5 30 38.5 40 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 38 L7.5 20 L36.5 20 L37 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 20 L22 8 L40 20" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="9" y="24" width="9" height="8" rx="1.5" stroke="#2D2D2D" strokeWidth="1.8"/>
      <rect x="26" y="24" width="9" height="8" rx="1.5" stroke="#2D2D2D" strokeWidth="1.8"/>
      <path d="M18 38 L18 33 C18 31.5 19 31 22 31 C25 31 26 31.5 26 33 L26 38"
        stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 38 C14 38.5 30 38.5 40 38" stroke="#2D2D2D" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

const GIFTICONS = [
  { name: '스타벅스 아메리카노', pts: 500, Icon: IconCoffee },
  { name: 'CU 편의점 3천원권',   pts: 300, Icon: IconConvenience },
  { name: 'GS25 2천원권',        pts: 200, Icon: IconStore },
]

/* reason 텍스트에서 앞 이모지 제거 후 아이콘 결정 */
function HistoryIcon({ reason }) {
  if (reason.includes('연속') || reason.includes('🔥')) return <IconFire />
  return <IconAlarm />
}

function cleanReason(reason) {
  return reason.replace(/^[\u{1F300}-\u{1FAFF}⏰🔥🎁📋✨🏆😊\s]+/u, '').trim()
}

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
      <div className="section-title">
        <IconGift /> 기프티콘 교환
      </div>
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
      <div className="section-title">
        <IconClipboard /> 적립 내역
      </div>
      <div className="history-list">
        {rewards.history.length === 0 ? (
          <div className="history-empty">아직 적립 내역이 없어요</div>
        ) : (
          rewards.history.map((h) => (
            <div key={h.id} className="history-item">
              <div className="history-icon-wrap">
                <HistoryIcon reason={h.reason} />
              </div>
              <div className="history-left">
                <div className="history-reason">{cleanReason(h.reason)}</div>
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
