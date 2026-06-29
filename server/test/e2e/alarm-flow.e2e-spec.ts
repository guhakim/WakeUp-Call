import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

/**
 * TSK-007: 알람 누락 시나리오 E2E 테스트
 * 시나리오: 알람 등록 → 기상 미확인 → 스케줄러 감지 → VoIP 트리거
 */
describe('알람 누락 E2E 시나리오', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('1) 알람 등록 → 성공 응답', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/alarm/register')
      .send({
        userId: 'test-user',
        phoneNumber: '+821012345678',
        hour: 7,
        minute: 30,
        label: '출근',
      })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.alarm.id).toBeDefined()
  })

  it('2) 기상 확인 핑 → 성공 응답', async () => {
    // 알람 먼저 등록
    const reg = await request(app.getHttpServer())
      .post('/api/alarm/register')
      .send({ userId: 'test-user', phoneNumber: '+821012345678', hour: 6, minute: 0, label: '테스트' })

    const alarmId = reg.body.alarm.id

    const res = await request(app.getHttpServer())
      .post('/api/alarm/wake-confirm')
      .send({ alarmId })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.alarm.wakeConfirmedAt).toBeDefined()
  })

  it('3) VoIP 트리거 → 성공 응답 (mock 모드)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/voip/trigger')
      .send({ phoneNumber: '+821012345678', userName: 'test-user' })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.callSid).toBeDefined()
  })

  it('4) 유저 알람 목록 조회', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/alarm/user/test-user')
      .expect(200)

    expect(Array.isArray(res.body.alarms)).toBe(true)
  })
})
