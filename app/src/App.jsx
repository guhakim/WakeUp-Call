import { useState, useCallback } from 'react'
import { useRewards } from './hooks/useRewards'
import { alarmApi } from './api/alarmApi'
import Home from './screens/Home'
import AlarmRing from './screens/AlarmRing'
import WakeComplete from './screens/WakeComplete'
import MyRewards from './screens/MyRewards'
import PhoneSetup from './screens/PhoneSetup'

// 간단한 userId (실제 서비스에서는 로그인 연동)
const USER_ID = localStorage.getItem('wakeup_user_id') || (() => {
  const id = `user-${Date.now()}`
  localStorage.setItem('wakeup_user_id', id)
  return id
})()

export default function App() {
  const [screen, setScreen] = useState(() =>
    localStorage.getItem('wakeup_phone') ? 'home' : 'setup'
  )
  const [activeAlarm, setActiveAlarm] = useState(null)
  const [serverAlarmId, setServerAlarmId] = useState(null)
  const rewards = useRewards()

  const phoneNumber = localStorage.getItem('wakeup_phone') ?? ''

  // 알람 발동 → 서버에서도 등록
  const handleAlarmFired = useCallback(async (alarm) => {
    setActiveAlarm(alarm)
    const result = await alarmApi.register({
      userId: USER_ID,
      phoneNumber,
      hour: alarm.hour,
      minute: alarm.minute,
      label: alarm.label,
    })
    if (result?.alarm?.id) setServerAlarmId(result.alarm.id)
  }, [phoneNumber])

  // 기상 확인 → 서버에 핑
  const handleWakeConfirm = useCallback(async () => {
    if (serverAlarmId) {
      await alarmApi.confirmWake(serverAlarmId)
      setServerAlarmId(null)
    }
  }, [serverAlarmId])

  // VoIP 트리거
  const handleVoipTrigger = useCallback(async () => {
    const result = await alarmApi.triggerVoip({ phoneNumber })
    if (result.success) {
      console.log('[VoIP] 전화 발신 요청 완료')
    } else if (result.noToken) {
      alert('📞 GitHub Token이 설정되지 않았습니다.\nVITE_GITHUB_TOKEN 환경변수를 설정해주세요.')
    } else if (result.noPhone) {
      alert('📞 전화번호가 저장되지 않았습니다.')
    } else {
      alert('📞 전화 발신 요청 실패\n잠시 후 다시 시도됩니다.')
    }
  }, [phoneNumber])

  const handlePhoneSetupDone = (phone) => {
    localStorage.setItem('wakeup_phone', phone)
    setScreen('home')
  }

  return (
    <>
      {screen === 'setup' && (
        <PhoneSetup onDone={handlePhoneSetupDone} />
      )}
      {screen === 'home' && (
        <Home onNavigate={setScreen} onAlarmFired={handleAlarmFired} rewards={rewards} />
      )}
      {screen === 'ring' && (
        <AlarmRing
          alarm={activeAlarm}
          onNavigate={(s) => {
            if (s === 'complete') handleWakeConfirm()
            setScreen(s)
          }}
          onVoipTrigger={handleVoipTrigger}
        />
      )}
      {screen === 'complete' && (
        <WakeComplete onNavigate={setScreen} rewards={rewards} />
      )}
      {screen === 'rewards' && (
        <MyRewards onNavigate={setScreen} rewards={rewards} />
      )}
    </>
  )
}
