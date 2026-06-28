import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AlarmModule } from './alarm/alarm.module'
import { VoipModule } from './voip/voip.module'
import { AlarmSchedulerService } from './scheduler/alarm-scheduler.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AlarmModule,
    VoipModule,
  ],
  providers: [AlarmSchedulerService],
})
export class AppModule {}
