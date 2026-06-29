import './BottomNav.css'

const tabs = [
  { key: 'home',    icon: '🏠', label: '홈' },
  { key: 'rewards', icon: '🌟', label: '리워드' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`bottom-nav-btn ${current === t.key ? 'active' : ''}`}
          onClick={() => onNavigate(t.key)}
        >
          <span className="bottom-nav-icon">{t.icon}</span>
          <span className="bottom-nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
