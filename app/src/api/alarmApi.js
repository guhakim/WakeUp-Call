const BASE      = import.meta.env.VITE_API_URL      ?? 'http://localhost:3001/api'
const GH_TOKEN  = import.meta.env.VITE_GITHUB_TOKEN ?? ''
const GH_OWNER  = 'guhakim'
const GH_REPO   = 'WakeUp-Call'

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

  // VoIP 트리거 — GitHub Actions workflow_dispatch → Twilio
  triggerVoip: async ({ phoneNumber }) => {
    if (!GH_TOKEN) {
      console.warn('[VoIP] VITE_GITHUB_TOKEN 미설정')
      return { success: false, noToken: true }
    }
    if (!phoneNumber) {
      return { success: false, noPhone: true }
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions/workflows/voip-call.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GH_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ref: 'main', inputs: { phone: phoneNumber } }),
        }
      )
      // 204 No Content = 성공
      if (res.status === 204) return { success: true }
      console.warn('[VoIP] GitHub API 오류:', res.status)
      return { success: false, status: res.status }
    } catch (e) {
      console.warn('[VoIP] 네트워크 오류:', e)
      return { success: false, offline: true }
    }
  },
}
