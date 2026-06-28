export interface AlarmEntry {
    id: string;
    userId: string;
    phoneNumber: string;
    hour: number;
    minute: number;
    label: string;
    createdAt: Date;
    wakeConfirmedAt?: Date;
    callSentAt?: Date;
}
export declare class AlarmService {
    private readonly logger;
    private alarms;
    register(dto: {
        userId: string;
        phoneNumber: string;
        hour: number;
        minute: number;
        label: string;
    }): AlarmEntry;
    confirmWake(alarmId: string): AlarmEntry | null;
    markCallSent(alarmId: string): void;
    getOverdueAlarms(): AlarmEntry[];
    getByUserId(userId: string): AlarmEntry[];
    deleteAlarm(alarmId: string): boolean;
}
