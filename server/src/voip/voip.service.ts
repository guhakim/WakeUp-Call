import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import twilio from 'twilio'

@Injectable()
export class VoipService {
  private readonly logger = new Logger(VoipService.name)
  private client: twilio.Twilio | null = null
  private fromNumber: string

  constructor(private config: ConfigService) {
    const sid   = config.get<string>('TWILIO_ACCOUNT_SID')
    const token = config.get<string>('TWILIO_AUTH_TOKEN')
    this.fromNumber = config.get<string>('TWILIO_PHONE_NUMBER') ?? ''

    if (sid && token && sid !== 'your_account_sid') {
      this.client = twilio(sid, token)
      this.logger.log('Twilio 클라이언트 초기화 완료')
    } else {
      this.logger.warn('Twilio 인증 정보 없음 — 개발 모드 (실제 전화 발신 안 됨)')
    }
  }

  async makeCall(toNumber: string, userName: string = '사용자'): Promise<{
    success: boolean
    callSid?: string
    message: string
  }> {
    // 개발 모드: Twilio 미설정 시 mock 응답
    if (!this.client) {
      this.logger.log(`[MOCK] 전화 발신 → ${toNumber}`)
      return {
        success: true,
        callSid: `MOCK-${Date.now()}`,
        message: `[개발 모드] ${toNumber} 로 전화를 발신했습니다 (실제 발신 안 됨)`,
      }
    }

    try {
      // TwiML: 수신 시 안내 음성 재생
      const twiml = `
        <Response>
          <Say language="ko-KR" voice="Polly.Seoyeon">
            안녕하세요. 웨이크업 콜입니다.
            ${userName}님, 지금 즉시 일어나세요!
            출근 시간이 지났습니다. 빨리 일어나세요!
          </Say>
          <Pause length="1"/>
          <Say language="ko-KR" voice="Polly.Seoyeon">
            지금 바로 일어나세요!
          </Say>
        </Response>
      `.trim()

      const call = await this.client.calls.create({
        to: toNumber,
        from: this.fromNumber,
        twiml,
      })

      this.logger.log(`전화 발신 성공: ${call.sid} → ${toNumber}`)
      return { success: true, callSid: call.sid, message: '전화 발신 성공' }
    } catch (err: any) {
      this.logger.error(`전화 발신 실패: ${err.message}`)
      return { success: false, message: `전화 발신 실패: ${err.message}` }
    }
  }
}
