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
var AlarmSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const alarm_service_1 = require("../alarm/alarm.service");
const voip_service_1 = require("../voip/voip.service");
let AlarmSchedulerService = AlarmSchedulerService_1 = class AlarmSchedulerService {
    alarmService;
    voipService;
    logger = new common_1.Logger(AlarmSchedulerService_1.name);
    constructor(alarmService, voipService) {
        this.alarmService = alarmService;
        this.voipService = voipService;
    }
    async checkOverdueAlarms() {
        const overdueAlarms = this.alarmService.getOverdueAlarms();
        if (overdueAlarms.length === 0)
            return;
        this.logger.log(`미기상 알람 ${overdueAlarms.length}건 감지 — 전화 발신 시작`);
        for (const alarm of overdueAlarms) {
            this.alarmService.markCallSent(alarm.id);
            const result = await this.voipService.makeCall(alarm.phoneNumber, alarm.userId);
            this.logger.log(`[${alarm.id}] ${alarm.phoneNumber} → ${result.success ? '✅ 발신 성공' : '❌ 발신 실패'}: ${result.message}`);
        }
    }
};
exports.AlarmSchedulerService = AlarmSchedulerService;
__decorate([
    (0, schedule_1.Cron)('*/30 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlarmSchedulerService.prototype, "checkOverdueAlarms", null);
exports.AlarmSchedulerService = AlarmSchedulerService = AlarmSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alarm_service_1.AlarmService,
        voip_service_1.VoipService])
], AlarmSchedulerService);
//# sourceMappingURL=alarm-scheduler.service.js.map