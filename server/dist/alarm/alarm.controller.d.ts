import { AlarmService } from './alarm.service';
export declare class AlarmController {
    private readonly alarmService;
    constructor(alarmService: AlarmService);
    register(body: {
        userId: string;
        phoneNumber: string;
        hour: number;
        minute: number;
        label: string;
    }): {
        success: boolean;
        alarm: import("./alarm.service").AlarmEntry;
    };
    wakeConfirm(body: {
        alarmId: string;
    }): {
        success: boolean;
        message: string;
        alarm?: undefined;
    } | {
        success: boolean;
        alarm: import("./alarm.service").AlarmEntry;
        message?: undefined;
    };
    getByUser(userId: string): {
        alarms: import("./alarm.service").AlarmEntry[];
    };
    delete(alarmId: string): {
        success: boolean;
    };
}
