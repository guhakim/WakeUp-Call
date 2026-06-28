import { Body, Controller, Post } from '@nestjs/common'
import { VoipService } from './voip.service'

@Controller('voip')
export class VoipController {
  constructor(private readonly voipService: VoipService) {}

  // 프론트에서 직접 VoIP 트리거 (미기상 3분 경과 시)
  @Post('trigger')
  async trigger(@Body() body: { phoneNumber: string; userName?: string }) {
    const result = await this.voipService.makeCall(body.phoneNumber, body.userName)
    return result
  }
}
