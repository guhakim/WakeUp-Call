import { useState, useCallback } from 'react'
import Home from './screens/Home'
import AlarmRing from './screens/AlarmRing'
import WakeComplete from './screens/WakeComplete'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeAlarm, setActiveAlarm] = useState(null)

  const handleAlarmFired = useCallback((alarm) => {
    setActiveAlarm(alarm)
  }, [])

  const handleVoipTrigger = useCallback(() => {
    // TODO: 백엔드 API 호출 (NestJS → Twilio)
    console.log('[VoIP] 서버 트리거 — 전화 발신 요청')
    alert('📞 서버에서 전화를 거는 중입니다...\n(백엔드 연동 후 실제 전화 발신)')
  }, [])

  return (
    <>
      {screen === 'home' && (
        <Home
          onNavigate={setScreen}
          onAlarmFired={handleAlarmFired}
        />
      )}
      {screen === 'ring' && (
        <AlarmRing
          alarm={activeAlarm}
          onNavigate={setScreen}
          onVoipTrigger={handleVoipTrigger}
        />
      )}
      {screen === 'complete' && (
        <WakeComplete onNavigate={setScreen} />
      )}
    </>
  )
}
