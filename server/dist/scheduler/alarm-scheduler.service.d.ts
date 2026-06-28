import { AlarmService } from '../alarm/alarm.service';
import { VoipService } from '../voip/voip.service';
export declare class AlarmSchedulerService {
    private readonly alarmService;
    private readonly voipService;
    private readonly logger;
    constructor(alarmService: AlarmService, voipService: VoipService);
    checkOverdueAlarms(): Promise<void>;
}
