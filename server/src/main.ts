import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 프론트엔드(localhost:5173, GitHub Pages) CORS 허용
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://guhakim.github.io',
    ],
    methods: ['GET', 'POST', 'DELETE'],
  })

  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`WakeUp Call 서버 실행 중: http://localhost:${port}/api`)
}
bootstrap()
