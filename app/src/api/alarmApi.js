const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export const alarmApi = {
  // 알람 서버 등록
  register: async ({ userId, phoneNumber, hour, minute, label }) => {
    try {
      const res = await fetch(`${BASE}/alarm/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneNumber, hour, minute, label }),
      })
      return await res.json()
    } catch {
      console.warn('[API] 서버 연결 실패 — 로컬 전용 모드로 동작')
      return { success: false, offline: true }
    }
  },

  // 기상 확인 핑
  confirmWake: async (alarmId) => {
    try {
      const res = await fetch(`${BASE}/alarm/wake-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alarmId }),
      })
      return await res.json()
    } catch {
      return { success: false, offline: true }
    }
  },

  // VoIP 즉시 트리거 (프론트에서 직접 호출)
  triggerVoip: async ({ phoneNumber, userName }) => {
    try {
      const res = await fetch(`${BASE}/voip/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, userName }),
      })
      return await res.json()
    } catch {
      return { success: false, offline: true }
    }
  },
}
