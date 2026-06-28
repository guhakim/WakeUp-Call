import { VoipService } from './voip.service';
export declare class VoipController {
    private readonly voipService;
    constructor(voipService: VoipService);
    trigger(body: {
        phoneNumber: string;
        userName?: string;
    }): Promise<{
        success: boolean;
        callSid?: string;
        message: string;
    }>;
}
