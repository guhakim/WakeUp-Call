# ☀️ WakeUp Call

> **어떤 상황에서도 당신을 깨운다** — 스마트폰 알람 오류 방지 & 비상 통화 서비스

라이브 데모: [guhakim.github.io/WakeUp-Call](https://guhakim.github.io/WakeUp-Call/)

---

## 프로젝트 개요

스마트폰 자체 알람이 무음·배터리 방전·OS 오류 등으로 울리지 않아 지각하는 문제를 해결합니다.  
알람 시간이 지나도 기상이 확인되지 않으면 **외부 서버에서 실제 전화(VoIP)를 걸어** 확실하게 깨워주는 리워드형 알람 서비스입니다.

- **타겟**: 출근 지각에 민감한 2030 직장인
- **핵심 가치**: "알람이 안 울려서 지각"은 이제 없다

---

## 핵심 기능

| 기능 | 설명 |
|---|---|
| ⏰ 스마트 알람 | 알람 추가·수정·삭제, 기상 여부 모니터링 |
| 📞 서버 비상 통화 | 1분 미기상 감지 시 서버에서 VoIP 전화 발신 |
| 🌟 리워드 포인트 | 정시 기상 시 포인트 적립 → 기프티콘 교환 |
| 🔔 알람 소리 + 진동 | Web Audio API (square파) + Vibration API |
| 📢 광고 수익화 | 기상 확인 시 AdMob 광고 영역 |

---

## 화면 구성

```
홈 (알람 목록 + 시계)
  └─ 알람 울림 화면
        ├─ 기상 완료 → 포인트 적립 + 광고
        └─ 5분 더 → 재알람 (1분 미기상 시 서버 전화)

리워드 화면
  └─ 포인트 내역 + 기프티콘 교환
```

---

## 기술 스택

### Frontend
- **React + Vite** — 모바일웹
- **Gaegu** (Google Fonts) — 손그림 스타일 폰트
- Web Audio API — 알람 소리 (square파)
- Vibration API — 진동 (Android)
- DeviceMotionEvent API — 자이로/가속도 기상 감지
- localStorage — 알람 목록·포인트 영속화
- GitHub Pages 배포

### Backend
- **NestJS** + TypeScript
- **Twilio** — VoIP 전화 발신
- @nestjs/schedule — 30초 간격 알람 스케줄러
- PostgreSQL + Redis (Docker Compose)

### Infrastructure
- GitHub Actions CI/CD
- AWS ECR + ECS 배포 파이프라인
- Flutter (모노레포 구성)

---

## 디자인 시스템

손그림 스케치 컨셉 — "잠이 덜 깬 아침의 노트 감성"

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg-paper` | `#FDFBF4` | 도화지 배경 |
| `--ink-dark` | `#2D2D2D` | 텍스트·선 |
| `--point-orange` | `#F4A228` | 주요 버튼·포인트 |
| `--point-green` | `#7EC8A4` | 성공·기상 완료 |
| `--point-sky` | `#A8C9F0` | 수면·취침 |

모든 아이콘은 SVG 손그림 스타일로 직접 제작 (이모지 미사용)

---

## 로컬 실행

```bash
# 프론트엔드
cd app
npm install
npm run dev
# → http://localhost:5173/WakeUp-Call/

# 백엔드 (Docker 필요)
docker-compose up -d
cd server
npm install
npm run start:dev
```

---

## 비즈니스 모델

```
무료      → 알람 기능 + 비상통화 월 3회 + 광고 노출
유료      → 월 2,900원 / 비상통화 무제한 + 광고 제거
프리미엄  → 월 5,900원 / 통화 커스텀 + 지인 대신 전화
```

---

## 개발 로드맵

- [x] MVP 기획 및 분석
- [x] UX/UI 디자인 방향 확정 (손그림 스케치 스타일)
- [x] 모바일웹 화면 구현 (홈 / 알람 / 기상완료 / 리워드 / 전화번호 설정)
- [x] 알람 타이머 + 자이로 기상 감지
- [x] 포인트·리워드 시스템
- [x] NestJS 백엔드 + Twilio VoIP 연동
- [x] GitHub Pages 배포
- [x] AWS ECR + ECS CI/CD 파이프라인
- [x] Flutter 모노레포 구성
- [ ] 사용자 인증 (소셜 로그인)
- [ ] AdMob 실 연동
- [ ] iOS/Android 앱스토어 배포

---

## 변경 이력

### 기능

| 내용 | 비고 |
|---|---|
| 알람 추가·수정·삭제 기능 | 카드 탭 → 바텀시트에서 시간 수정 |
| 알람 목록 영속화 | localStorage 저장, 화면 이동 후에도 유지 |
| 알람 소리 개선 | square파·볼륨 강화·진동(Android), iOS AudioContext unlock |
| 분 단위 피커 1분 단위 | 기존 5분 → 0~59 전체 선택 가능 |
| 미기상 판정 시간 단축 | 3분 → 1분 |
| 포인트 리워드 시스템 | 정시 기상 +10pt, 연속 기상 보너스, 기프티콘 교환 |
| NestJS 백엔드 + Twilio VoIP | 미기상 시 실제 전화 발신 (mock 모드 지원) |
| 알람 타이머 + 자이로 기상 감지 | DeviceMotionEvent, 터치 감지 병행 |

### UI/디자인

| 내용 | 비고 |
|---|---|
| 전체 아이콘 손그림 SVG 교체 | 로고, 탭바, 기프티콘, 리워드 섹션 이모지 → SVG |
| 하단 탭 네비게이션 | 홈 / 리워드 탭, 손그림 집·별 아이콘 |
| 알람 추가 바텀시트 | FAB 버튼 → 슬라이드업 시트 |
| 전체 폰트 크기 확대 | 소중간 텍스트 20~25% 증가 |
| 모바일 뷰포트 수정 | `body fixed` 패턴으로 iOS Safari URL bar 대응 |
| 홈 화면 UI 정렬 | 시계 클리핑, 버튼 텍스트 줄바꿈 해결 |

---

## 주의사항

- 한국 스팸 방지법에 따라 자동 발신 ARS는 **사용자 사전 동의** 필수
- iOS 백그라운드 제한으로 알람 감지는 **서버 사이드 타이머** 방식으로 구현
- 브라우저 정책상 알람 소리는 **첫 화면 터치 이후** 활성화됨 (iOS 정책)
- Twilio VoIP 비용 구조를 감안한 수익 모델 설계 필요

---

## License

MIT
