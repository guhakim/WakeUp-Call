import { useState } from 'react'
import './PhoneSetup.css'

export default function PhoneSetup({ onDone }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const cleaned = phone.replace(/\s|-/g, '')
    // 한국 번호: 010으로 시작, 10~11자리
    if (!/^01[0-9]{8,9}$/.test(cleaned)) {
      setError('올바른 휴대폰 번호를 입력해주세요 (예: 01012345678)')
      return
    }
    // 국제 형식으로 변환 (+82)
    const intl = '+82' + cleaned.slice(1)
    onDone(intl)
  }

  return (
    <div className="screen setup-screen">
      <div className="setup-top">
        <div className="setup-emoji">📞</div>
        <div className="setup-title">웨이크업 콜</div>
        <div className="setup-sub">
          못 일어나면 이 번호로<br />직접 전화해드릴게요!
        </div>
      </div>

      <div className="setup-card card">
        <label className="setup-label">내 휴대폰 번호</label>
        <input
          className="setup-input"
          type="tel"
          placeholder="01012345678"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          maxLength={11}
        />
        {error && <div className="setup-error">{error}</div>}

        <div className="setup-notice">
          📋 자동 전화 수신에 동의하고 시작합니다
        </div>
      </div>

      <button className="btn" onClick={handleSubmit}>
        시작하기 →
      </button>
    </div>
  )
}
