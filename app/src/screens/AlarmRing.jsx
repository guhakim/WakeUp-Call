import { useEffect } from 'react'
import { useAlarmSound } from '../hooks/useAlarmSound'
import { useMotionDetect } from '../hooks/useMotionDetect'
import './AlarmRing.css'

const fmt = (n) => String(n).padStart(2, '0')
const fmtTime = (s) => `${fmt(Math.floor(s / 60))}:${fmt(s % 60)}`

export default function AlarmRing({ alarm: _alarm, onNavigate, onVoipTrigger }) {
  const { start: soundStart, stop: soundStop, tryPlay } = useAlarmSound()

  const {
    noMotionSeconds,
    timeUntilCall,
    isCallImminent,
    shouldTriggerCall,
    motionPermission,
    requestPermission,
    confirmAwake,
  } = useMotionDetect(true)

  // 알람음 + 진동 시작
  useEffect(() => {
    soundStart()          // async — 내부에서 ctx.resume() await 처리
    return () => soundStop()
  }, []) // eslint-disable-line

  // VoIP 트리거
  useEffect(() => {
    if (shouldTriggerCall) {
      soundStop()
      onVoipTrigger?.()
    }
  }, [shouldTriggerCall, soundStop, onVoipTrigger])

  const handleAwake = () => {
    soundStop()
    confirmAwake()
    onNavigate('complete')
  }

  const handleSnooze = () => {
    soundStop()
    onNavigate('home')
  }

  const now = new Date()
  const progress = Math.min((noMotionSeconds / 60) * 100, 100)

  return (
    <div className="screen ring-screen" onTouchStart={tryPlay} onClick={tryPlay}>

      {/* 알람 박스 */}
      <div className={`ring-box ${isCallImminent ? 'urgent' : ''}`}>
        <div className="ring-emoji">
          {isCallImminent ? '😱' : 'ヽ(°〇°)ﾉ'}
        </div>
        <div className="ring-time">
          {fmt(now.getHours())}:{fmt(now.getMinutes())}
        </div>
        <div className="ring-msg">
          {isCallImminent ? '!! 전화 곧 옵니다 !!' : '!! 일어나세요 !!'}
        </div>
      </div>

      {/* 기상 감지 상태 */}
      <div className="motion-status card">
        <div className="motion-label">
          {noMotionSeconds < 5
            ? '📳 움직임 감지 중...'
            : `😴 ${noMotionSeconds}초째 미기상 감지`}
        </div>

        {/* 프로그레스 바 */}
        <div className="motion-bar-wrap">
          <div className="motion-bar">
            <div
              className={`motion-bar-fill ${isCallImminent ? 'urgent' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="motion-bar-labels">
            <span>0</span>
            <span className={isCallImminent ? 'urgent-text' : ''}>
              {isCallImminent
                ? `📞 ${fmtTime(timeUntilCall)} 후 전화!`
                : `전화까지 ${fmtTime(timeUntilCall)}`}
            </span>
            <span>1분</span>
          </div>
        </div>

        {/* iOS 권한 요청 */}
        {motionPermission === 'unknown' && (
          <button className="permission-btn" onClick={requestPermission}>
            자이로 센서 권한 허용하기
          </button>
        )}
      </div>

      {/* 버튼 */}
      <div className="ring-actions">
        <button className="btn green" onClick={handleAwake}>
          나 일어났어요! ✓
        </button>
        <button className="btn sky" onClick={handleSnooze}>
          5분만 더... 😴
        </button>
      </div>

      <div className="ring-warning">
        {shouldTriggerCall
          ? '📞 서버에서 전화 연결 중...'
          : '움직임이 없으면 1분 후 전화드려요'}
      </div>
    </div>
  )
}
