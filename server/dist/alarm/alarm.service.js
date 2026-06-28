"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AlarmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmService = void 0;
const common_1 = require("@nestjs/common");
let AlarmService = AlarmService_1 = class AlarmService {
    logger = new common_1.Logger(AlarmService_1.name);
    alarms = new Map();
    register(dto) {
        const id = `${dto.userId}-${Date.now()}`;
        const entry = { ...dto, id, createdAt: new Date() };
        this.alarms.set(id, entry);
        this.logger.log(`알람 등록: ${dto.label} ${dto.hour}:${String(dto.minute).padStart(2, '0')} (${dto.phoneNumber})`);
        return entry;
    }
    confirmWake(alarmId) {
        const alarm = this.alarms.get(alarmId);
        if (!alarm)
            return null;
        alarm.wakeConfirmedAt = new Date();
        this.logger.log(`기상 확인: ${alarmId}`);
        return alarm;
    }
    markCallSent(alarmId) {
        const alarm = this.alarms.get(alarmId);
        if (alarm)
            alarm.callSentAt = new Date();
    }
    getOverdueAlarms() {
        const now = new Date();
        const results = [];
        for (const alarm of this.alarms.values()) {
            if (alarm.wakeConfirmedAt || alarm.callSentAt)
                continue;
            const alarmTime = new Date();
            alarmTime.setHours(alarm.hour, alarm.minute, 0, 0);
            const diffMs = now.getTime() - alarmTime.getTime();
            const diffMin = diffMs / 1000 / 60;
            if (diffMin >= 3 && diffMin <= 60) {
                results.push(alarm);
            }
        }
        return results;
    }
    getByUserId(userId) {
        return [...this.alarms.values()].filter(a => a.userId === userId);
    }
    deleteAlarm(alarmId) {
        return this.alarms.delete(alarmId);
    }
};
exports.AlarmService = AlarmService;
exports.AlarmService = AlarmService = AlarmService_1 = __decorate([
    (0, common_1.Injectable)()
], AlarmService);
//# sourceMappingURL=alarm.service.js.map