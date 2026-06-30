import { useEffect } from 'react'
import './WakeComplete.css'

const EARN_AMOUNT = 10

export default function WakeComplete({ onNavigate, rewards }) {
  useEffect(() => {
    rewards.addPoints(EARN_AMOUNT, '⏰ 정시 기상')
  }, []) // eslint-disable-line

  const streakEmoji = rewards.streak >= 30 ? '🏆' : rewards.streak >= 7 ? '🔥' : rewards.streak >= 3 ? '✨' : '😊'

  return (
    <div className="screen complete-screen">

      <div className="complete-top">
        <div className="complete-emoji">＼(^o^)／</div>
        <div className="complete-title">오늘도 해냈어요!</div>
        <div className="complete-streak">
          {streakEmoji} {rewards.streak}일 연속 기상 중
        </div>
      </div>

      {/* 리워드 카드 */}
      <div className="reward-card card">
        <div className="reward-row">
          <span className="reward-label">오늘 적립</span>
          <span className="reward-earn">+{EARN_AMOUNT} pt</span>
        </div>
        <hr className="divider" style={{ width: '100%', margin: '10px 0' }} />
        <div className="reward-row">
          <span className="reward-label">총 포인트</span>
          <span className="reward-total">{rewards.points + EARN_AMOUNT} pt</span>
        </div>

        {/* 프로그레스 */}
        <div className="reward-bar-wrap">
          <div className="reward-bar">
            <div
              className="reward-bar-fill"
              style={{ width: `${rewards.progressPercent}%` }}
            />
          </div>
          <span className="reward-bar-label">
            기프티콘(500pt)까지 {rewards.pointsLeft}pt 남음
          </span>
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="ad-area">
        <span className="ad-label">광고</span>
        <div className="ad-placeholder">[ AdMob 광고 영역 ]</div>
      </div>

      <div className="complete-btns">
        <button className="btn green" onClick={() => onNavigate('rewards')}>
          포인트 내역 보기
        </button>
        <button className="btn" onClick={() => onNavigate('home')}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}
