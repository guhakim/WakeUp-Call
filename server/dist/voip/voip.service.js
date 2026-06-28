"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var VoipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = __importDefault(require("twilio"));
let VoipService = VoipService_1 = class VoipService {
    config;
    logger = new common_1.Logger(VoipService_1.name);
    client = null;
    fromNumber;
    constructor(config) {
        this.config = config;
        const sid = config.get('TWILIO_ACCOUNT_SID');
        const token = config.get('TWILIO_AUTH_TOKEN');
        this.fromNumber = config.get('TWILIO_PHONE_NUMBER') ?? '';
        if (sid && token && sid !== 'your_account_sid') {
            this.client = (0, twilio_1.default)(sid, token);
            this.logger.log('Twilio 클라이언트 초기화 완료');
        }
        else {
            this.logger.warn('Twilio 인증 정보 없음 — 개발 모드 (실제 전화 발신 안 됨)');
        }
    }
    async makeCall(toNumber, userName = '사용자') {
        if (!this.client) {
            this.logger.log(`[MOCK] 전화 발신 → ${toNumber}`);
            return {
                success: true,
                callSid: `MOCK-${Date.now()}`,
                message: `[개발 모드] ${toNumber} 로 전화를 발신했습니다 (실제 발신 안 됨)`,
            };
        }
        try {
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
      `.trim();
            const call = await this.client.calls.create({
                to: toNumber,
                from: this.fromNumber,
                twiml,
            });
            this.logger.log(`전화 발신 성공: ${call.sid} → ${toNumber}`);
            return { success: true, callSid: call.sid, message: '전화 발신 성공' };
        }
        catch (err) {
            this.logger.error(`전화 발신 실패: ${err.message}`);
            return { success: false, message: `전화 발신 실패: ${err.message}` };
        }
    }
};
exports.VoipService = VoipService;
exports.VoipService = VoipService = VoipService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VoipService);
//# sourceMappingURL=voip.service.js.map