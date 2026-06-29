import { useState, useEffect, useRef, useCallback } from 'react'

const MOTION_THRESHOLD = 3       // 가속도 변화 임계값 (m/s²)
const NO_MOTION_LIMIT = 1 * 60   // 미기상 판정 시간 (초)
const CHECK_INTERVAL = 1000

export function useMotionDetect(active) {
  const [isAwake, setIsAwake] = useState(false)
  const [noMotionSeconds, setNoMotionSeconds] = useState(0)
  const [motionPermission, setMotionPermission] = useState('unknown') // unknown | granted | denied
  const lastMotionRef = useRef(Date.now())
  const intervalRef = useRef(null)
  const listenerRef = useRef(null)

  // 터치 감지 (iOS/Android 공통)
  const onTouch = useCallback(() => {
    lastMotionRef.current = Date.now()
  }, [])

  // 자이로/가속도 감지
  const onMotion = useCallback((e) => {
    const a = e.accelerationIncludingGravity
    if (!a) return
    const magnitude = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
    // 중력(약 9.8) 제외 후 임계값 초과 시 움직임 인식
    if (Math.abs(magnitude - 9.8) > MOTION_THRESHOLD) {
      lastMotionRef.current = Date.now()
    }
  }, [])

  const requestPermission = useCallback(async () => {
    // iOS 13+ 권한 요청
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      const result = await DeviceMotionEvent.requestPermission()
      setMotionPermission(result)
      return result === 'granted'
    }
    // Android / 기타: 권한 불필요
    setMotionPermission('granted')
    return true
  }, [])

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('devicemotion', onMotion)
      return
    }

    lastMotionRef.current = Date.now()

    // 터치 이벤트는 항상 등록
    window.addEventListener('touchstart', onTouch, { passive: true })

    // 자이로 이벤트 등록 (권한 있을 때만)
    if (motionPermission === 'granted') {
      window.addEventListener('devicemotion', onMotion)
      listenerRef.current = onMotion
    }

    // 1초마다 미기상 시간 누적
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastMotionRef.current) / 1000)
      setNoMotionSeconds(elapsed)

      if (elapsed >= NO_MOTION_LIMIT) {
        setIsAwake(false) // 미기상 확정 → 부모에서 VoIP 트리거
      }
    }, CHECK_INTERVAL)

    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('touchstart', onTouch)
      if (listenerRef.current) {
        window.removeEventListener('devicemotion', listenerRef.current)
      }
    }
  }, [active, motionPermission, onTouch, onMotion])

  const confirmAwake = useCallback(() => {
    lastMotionRef.current = Date.now()
    setIsAwake(true)
    setNoMotionSeconds(0)
  }, [])

  const timeUntilCall = Math.max(0, NO_MOTION_LIMIT - noMotionSeconds)
  const isCallImminent = timeUntilCall <= 30 && timeUntilCall > 0
  const shouldTriggerCall = noMotionSeconds >= NO_MOTION_LIMIT

  return {
    isAwake,
    noMotionSeconds,
    timeUntilCall,
    isCallImminent,
    shouldTriggerCall,
    motionPermission,
    requestPermission,
    confirmAwake,
  }
}
