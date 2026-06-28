import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AlarmService } from '../alarm/alarm.service'
import { VoipService } from '../voip/voip.service'

@Injectable()
export class AlarmSchedulerService {
  private readonly logger = new Logger(AlarmSchedulerService.name)

  constructor(
    private readonly alarmService: AlarmService,
    private readonly voipService: VoipService,
  ) {}

  // 30초마다 미기상 알람 체크 (PRD: 딜레이 10초 이내 요구)
  @Cron('*/30 * * * * *')
  async checkOverdueAlarms() {
    const overdueAlarms = this.alarmService.getOverdueAlarms()

    if (overdueAlarms.length === 0) return

    this.logger.log(`미기상 알람 ${overdueAlarms.length}건 감지 — 전화 발신 시작`)

    for (const alarm of overdueAlarms) {
      // 전화 발송 표시 먼저 (중복 발송 방지)
      this.alarmService.markCallSent(alarm.id)

      const result = await this.voipService.makeCall(
        alarm.phoneNumber,
        alarm.userId,
      )

      this.logger.log(
        `[${alarm.id}] ${alarm.phoneNumber} → ${result.success ? '✅ 발신 성공' : '❌ 발신 실패'}: ${result.message}`,
      )
    }
  }
}
