import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { AlarmService } from './alarm.service'

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  // 알람 등록
  @Post('register')
  register(
    @Body() body: {
      userId: string
      phoneNumber: string
      hour: number
      minute: number
      label: string
    },
  ) {
    const alarm = this.alarmService.register(body)
    return { success: true, alarm }
  }

  // 기상 확인 핑 (앱에서 호출)
  @Post('wake-confirm')
  wakeConfirm(@Body() body: { alarmId: string }) {
    const alarm = this.alarmService.confirmWake(body.alarmId)
    if (!alarm) return { success: false, message: '알람을 찾을 수 없습니다' }
    return { success: true, alarm }
  }

  // 유저 알람 목록 조회
  @Get('user/:userId')
  getByUser(@Param('userId') userId: string) {
    return { alarms: this.alarmService.getByUserId(userId) }
  }

  // 알람 삭제
  @Delete(':alarmId')
  delete(@Param('alarmId') alarmId: string) {
    const ok = this.alarmService.deleteAlarm(alarmId)
    return { success: ok }
  }
}
