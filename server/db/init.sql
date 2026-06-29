-- TSK-002: WakeUp Call PostgreSQL 스키마

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number  VARCHAR(20) NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 알람 테이블
CREATE TABLE IF NOT EXISTS alarms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hour            SMALLINT NOT NULL CHECK (hour BETWEEN 0 AND 23),
  minute          SMALLINT NOT NULL CHECK (minute BETWEEN 0 AND 59),
  label           VARCHAR(50) NOT NULL DEFAULT '알람',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  wake_confirmed_at  TIMESTAMPTZ,
  call_sent_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 알람 로그 테이블 (이력 관리)
CREATE TABLE IF NOT EXISTS alarm_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alarm_id    UUID NOT NULL REFERENCES alarms(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type  VARCHAR(30) NOT NULL,  -- 'fired' | 'wake_confirmed' | 'call_sent' | 'snoozed'
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 포인트 테이블
CREATE TABLE IF NOT EXISTS reward_points (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  reason      VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_alarms_user_id    ON alarms(user_id);
CREATE INDEX IF NOT EXISTS idx_alarms_active     ON alarms(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_alarm_logs_alarm  ON alarm_logs(alarm_id);
CREATE INDEX IF NOT EXISTS idx_reward_user       ON reward_points(user_id);
