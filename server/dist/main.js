"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'https://guhakim.github.io',
        ],
        methods: ['GET', 'POST', 'DELETE'],
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`WakeUp Call 서버 실행 중: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map