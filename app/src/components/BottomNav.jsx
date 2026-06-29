import './BottomNav.css'

/* 손그림 스케치 스타일 SVG 아이콘 */
function IconHome({ active }) {
  const color = active ? '#2D2D2D' : '#AAAAAA'
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 지붕 */}
      <path
        d="M5 18 C6 17.5 10 12 17.5 6.5 C25 12 30 17.5 31 18"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* 집 몸통 왼쪽 */}
      <path
        d="M8 16.5 C7.8 20 7.5 26.5 7.5 29.5"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 집 몸통 오른쪽 */}
      <path
        d="M28 16.5 C28.2 20 28.5 26.5 28.5 29.5"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 집 바닥 */}
      <path
        d="M7.5 29.5 C12 30 24 30 28.5 29.5"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 문 */}
      <path
        d="M15 29.5 C14.8 25.5 15 22 15.5 21.5 C16.5 20.8 19.5 20.8 20.5 21.5 C21 22 21.2 25.5 21 29.5"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRewards({ active }) {
  const color = active ? '#2D2D2D' : '#AAAAAA'
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 별 - 손그림 스타일로 약간 삐뚤하게 */}
      <path
        d="M18 5 C18.3 8.5 18.5 11 19.5 12.5 C21 13 24.5 13 28 13.5 C25.5 16 23.5 18 22.5 19.5 C23.5 22.5 24.5 26 25 30 C22.5 28 20.5 26.5 18 25 C15.5 26.5 13.5 28 11 30 C11.5 26 12.5 22.5 13.5 19.5 C12.5 18 10.5 16 8 13.5 C11.5 13 15 13 16.5 12.5 C17.5 11 17.7 8.5 18 5Z"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? '#F4A228' : 'none'}
        fillOpacity={active ? 0.3 : 0}
      />
    </svg>
  )
}

const tabs = [
  { key: 'home',    Icon: IconHome,    label: '홈' },
  { key: 'rewards', Icon: IconRewards, label: '리워드' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ key, Icon, label }) => (
        <button
          key={key}
          className={`bottom-nav-btn ${current === key ? 'active' : ''}`}
          onClick={() => onNavigate(key)}
        >
          <Icon active={current === key} />
          <span className="bottom-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
