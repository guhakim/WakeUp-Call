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

  // VoIP 트리거 — 백엔드 서버 경유
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
