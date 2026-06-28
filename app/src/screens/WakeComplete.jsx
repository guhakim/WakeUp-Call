import './WakeComplete.css'

export default function WakeComplete({ onNavigate }) {
  return (
    <div className="screen complete-screen">
      <div className="complete-top">
        <div className="complete-emoji">＼(^o^)／</div>
        <div className="complete-title">오늘도 해냈어요!</div>
        <div className="complete-subtitle">연속 기상 7일째 🔥</div>
      </div>

      <div className="reward-card card">
        <div className="reward-row">
          <span className="reward-label">오늘 적립</span>
          <span className="reward-pts green-text">+10 포인트</span>
        </div>
        <hr className="divider" style={{ width: '100%', margin: '12px 0' }} />
        <div className="reward-row">
          <span className="reward-label">총 포인트</span>
          <span className="reward-pts">330 pt</span>
        </div>
        <div className="reward-bar-wrap">
          <div className="reward-bar">
            <div className="reward-bar-fill" style={{ width: '66%' }} />
          </div>
          <span className="reward-bar-label">기프티콘까지 170pt</span>
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="ad-area">
        <span className="ad-label">광고</span>
        <div className="ad-placeholder">[ 광고 영역 ]</div>
      </div>

      <button
        className="btn"
        style={{ marginTop: 'auto', marginBottom: 32 }}
        onClick={() => onNavigate('home')}
      >
        홈으로 돌아가기
      </button>
    </div>
  )
}
