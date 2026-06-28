import { ConfigService } from '@nestjs/config';
export declare class VoipService {
    private config;
    private readonly logger;
    private client;
    private fromNumber;
    constructor(config: ConfigService);
    makeCall(toNumber: string, userName?: string): Promise<{
        success: boolean;
        callSid?: string;
        message: string;
    }>;
}
