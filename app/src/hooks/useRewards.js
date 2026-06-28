import { useState, useCallback } from 'react'

const STORAGE_KEY = 'wakeup_rewards'
const GIFTICON_GOAL = 500

const loadData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      points: 0,
      streak: 0,
      lastWakeDate: null,
      history: [],
    }
  } catch {
    return { points: 0, streak: 0, lastWakeDate: null, history: [] }
  }
}

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const todayStr = () => new Date().toISOString().slice(0, 10)

export function useRewards() {
  const [data, setData] = useState(loadData)

  const addPoints = useCallback((amount, reason) => {
    setData((prev) => {
      const today = todayStr()
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

      // 스트릭 계산
      const newStreak = prev.lastWakeDate === yesterday
        ? prev.streak + 1
        : prev.lastWakeDate === today
          ? prev.streak        // 오늘 이미 기상함 — 스트릭 유지
          : 1                  // 연속 끊김 — 리셋

      // 연속 기상 보너스
      let bonus = 0
      if (newStreak === 3)  bonus = 10
      if (newStreak === 7)  bonus = 30
      if (newStreak === 30) bonus = 100

      const entries = [
        { date: today, reason, amount, id: Date.now() },
        ...(bonus > 0
          ? [{ date: today, reason: `🔥 ${newStreak}일 연속 보너스`, amount: bonus, id: Date.now() + 1 }]
          : []),
      ]

      const next = {
        points: prev.points + amount + bonus,
        streak: newStreak,
        lastWakeDate: today,
        history: [...entries, ...prev.history].slice(0, 50), // 최대 50건
      }
      saveData(next)
      return next
    })
  }, [])

  const resetForDemo = useCallback(() => {
    const fresh = { points: 0, streak: 0, lastWakeDate: null, history: [] }
    saveData(fresh)
    setData(fresh)
  }, [])

  const progressPercent = Math.min((data.points / GIFTICON_GOAL) * 100, 100)
  const pointsLeft = Math.max(GIFTICON_GOAL - data.points, 0)

  return {
    points: data.points,
    streak: data.streak,
    history: data.history,
    lastWakeDate: data.lastWakeDate,
    progressPercent,
    pointsLeft,
    goalPoints: GIFTICON_GOAL,
    addPoints,
    resetForDemo,
  }
}
