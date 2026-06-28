import { Injectable, Logger } from '@nestjs/common'

export interface AlarmEntry {
  id: string
  userId: string
  phoneNumber: string
  hour: number
  minute: number
  label: string
  createdAt: Date
  wakeConfirmedAt?: Date   // 기상 확인 시각
  callSentAt?: Date        // 전화 발송 시각
}

@Injectable()
export class AlarmService {
  private readonly logger = new Logger(AlarmService.name)
  // MVP: 인메모리 스토어 (추후 Firebase/DB로 교체)
  private alarms: Map<string, AlarmEntry> = new Map()

  register(dto: {
    userId: string
    phoneNumber: string
    hour: number
    minute: number
    label: string
  }): AlarmEntry {
    const id = `${dto.userId}-${Date.now()}`
    const entry: AlarmEntry = { ...dto, id, createdAt: new Date() }
    this.alarms.set(id, entry)
    this.logger.log(`알람 등록: ${dto.label} ${dto.hour}:${String(dto.minute).padStart(2,'0')} (${dto.phoneNumber})`)
    return entry
  }

  confirmWake(alarmId: string): AlarmEntry | null {
    const alarm = this.alarms.get(alarmId)
    if (!alarm) return null
    alarm.wakeConfirmedAt = new Date()
    this.logger.log(`기상 확인: ${alarmId}`)
    return alarm
  }

  markCallSent(alarmId: string): void {
    const alarm = this.alarms.get(alarmId)
    if (alarm) alarm.callSentAt = new Date()
  }

  // 스케줄러용: 현재 시각 기준 3분 이상 지났지만 기상 미확인 + 전화 미발송 알람
  getOverdueAlarms(): AlarmEntry[] {
    const now = new Date()
    const results: AlarmEntry[] = []

    for (const alarm of this.alarms.values()) {
      if (alarm.wakeConfirmedAt || alarm.callSentAt) continue

      const alarmTime = new Date()
      alarmTime.setHours(alarm.hour, alarm.minute, 0, 0)

      const diffMs = now.getTime() - alarmTime.getTime()
      const diffMin = diffMs / 1000 / 60

      // 알람 시간 +3분 초과 시 전화 대상
      if (diffMin >= 3 && diffMin <= 60) {
        results.push(alarm)
      }
    }
    return results
  }

  getByUserId(userId: string): AlarmEntry[] {
    return [...this.alarms.values()].filter(a => a.userId === userId)
  }

  deleteAlarm(alarmId: string): boolean {
    return this.alarms.delete(alarmId)
  }
}
