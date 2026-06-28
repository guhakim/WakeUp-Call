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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmController = void 0;
const common_1 = require("@nestjs/common");
const alarm_service_1 = require("./alarm.service");
let AlarmController = class AlarmController {
    alarmService;
    constructor(alarmService) {
        this.alarmService = alarmService;
    }
    register(body) {
        const alarm = this.alarmService.register(body);
        return { success: true, alarm };
    }
    wakeConfirm(body) {
        const alarm = this.alarmService.confirmWake(body.alarmId);
        if (!alarm)
            return { success: false, message: '알람을 찾을 수 없습니다' };
        return { success: true, alarm };
    }
    getByUser(userId) {
        return { alarms: this.alarmService.getByUserId(userId) };
    }
    delete(alarmId) {
        const ok = this.alarmService.deleteAlarm(alarmId);
        return { success: ok };
    }
};
exports.AlarmController = AlarmController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlarmController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('wake-confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlarmController.prototype, "wakeConfirm", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlarmController.prototype, "getByUser", null);
__decorate([
    (0, common_1.Delete)(':alarmId'),
    __param(0, (0, common_1.Param)('alarmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AlarmController.prototype, "delete", null);
exports.AlarmController = AlarmController = __decorate([
    (0, common_1.Controller)('alarm'),
    __metadata("design:paramtypes", [alarm_service_1.AlarmService])
], AlarmController);
//# sourceMappingURL=alarm.controller.js.map