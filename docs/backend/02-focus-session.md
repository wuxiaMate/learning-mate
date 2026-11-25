# 02. 폐관 수련(집중 세션) + 카메라 감지 명세 (v0.1 초안)

> 관련 화면: PC05 폐관 준비 · PC06 폐관 수련 · PC07 상태 정의 · PC08 수련 결과
> 관련 기능: M01 순공 타이머 · M05 카메라 상태 감지
> 처음 읽을 때는 **한눈에 보기 → 2. 상태 → 4. 시간 계산 → 6. API 목록**만 보면 돼요.

## 한눈에 보기

- 폐관(세션)을 시작하면, **상태가 바뀔 때마다** 프론트가 이벤트를 보내요. 출관(종료)할 때 서버가 그 이벤트들로 순공 시간을 계산해서 확정해요.
- **카메라 영상과 프레임은 서버로 오지 않아요.** 얼굴 검출은 브라우저(MediaPipe)가 하고, 서버는 "몇 시에 어떤 상태가 됐다"만 받아요.
- 서버가 하는 일은 두 가지예요: **이벤트 검증·저장**과 **시간 계산**.

## 1. 화면 용어 ↔ 코드 이름

| 화면 | 코드 | 의미 |
|---|---|---|
| 폐관 수련 | `FocusSession` | 집중 세션 1회 |
| 입관 / 출관 | start / end | 시작 / 종료 |
| 순공 | `focusSeconds` | 집중으로 인정된 시간 |
| 수련 일지 | `SessionEvent` | 상태 변화 기록 |

---

## 2. 모드와 상태 (PC07)

**모드(mode)** 는 측정 방식이에요: `AI`(카메라 감지) 또는 `MANUAL`(수동). 세션 중에도 바뀔 수 있어요.

**상태(state)** 는 지금 무엇을 하고 있는지예요:

| 화면 | state | 언제 | 순공에 합산 |
|---|---|---|---|
| 수련 중 (재실) | `FOCUS` | 시작·재개 시, AI가 재실로 판정 시 | **O** |
| 자리 이탈 | `AWAY` | AI: 얼굴 미검출이 30초를 넘음 | X |
| 판정 불가 | `UNKNOWN` | AI: 저조도·가림·카메라 끊김 | X |
| 일시정지 | `PAUSED` | 사용자가 일시정지 (Space) | X |

- PC07의 "수동 수련"은 **mode=MANUAL, state=FOCUS** 인 상태예요.
- **규칙은 하나예요: 순공 = FOCUS였던 시간의 합.**

## 3. 이벤트

| type | 바뀌는 상태 | 보내는 곳 | 허용 모드 |
|---|---|---|---|
| `START` | FOCUS | 서버가 시작 API에서 자동 기록 | 모두 |
| `FOCUS` | FOCUS | 재개 버튼, AI 재실 판정, "수동으로 계속" | 모두 |
| `AWAY` | AWAY | AI 판정 | AI만 |
| `UNKNOWN` | UNKNOWN | AI 판정 (`reason` 필수) | AI만 |
| `PAUSE` | PAUSED | 일시정지 버튼 | 모두 |
| `MODE_CHANGE` | 상태는 그대로, mode만 바뀜 (`mode` 필수) | 카메라 켜기/끄기, 수동 전환 | 모두 |
| `END` | — | 서버가 종료 API에서 자동 기록 | 모두 |

`UNKNOWN`의 `reason`: `LOW_LIGHT`(저조도) · `OCCLUDED`(가림) · `CAMERA_LOST`(카메라 끊김) · `OTHER`

예) 판정 불가 화면에서 "수동으로 계속"을 누르면 `MODE_CHANGE(MANUAL)` → `FOCUS` 이렇게 **이벤트 두 개**를 보내요.

### 프론트·AI 파트와 합의할 것

- 감지는 5fps로 돌지만, **이벤트는 상태가 바뀔 때만 한 번** 보내요. 프레임마다 API를 부르면 안 돼요.
- `AWAY`의 `occurredAt`은 **얼굴이 처음 안 보인 시각**이에요. 이탈 확정은 30초 뒤에 되지만, 이탈 구간은 사라진 순간부터 계산해요.
- 복귀는 얼굴이 2초 연속 검출되면 `FOCUS`로 보내요. `occurredAt`은 다시 보인 시각이에요.
- `eventId`는 프론트가 `crypto.randomUUID()`로 만들어요. 응답을 못 받으면 **같은 eventId로 재시도**해요.
- 이벤트는 **순서대로 하나씩** 보내요. 앞 요청의 응답을 받은 뒤에 다음 요청을 보내요.
- 시각은 오프셋을 포함한 ISO-8601로 보내요. 예: `2026-11-24T14:00:00+09:00`
- **모든 시각은 프론트 시계 기준이에요.** 한 세션 안에서는 같은 시계를 써야 구간 계산이 맞아요. 서버는 "지금보다 1분 넘게 미래인 시각"만 막아요.

## 4. 시간 계산 (서버의 핵심 로직)

1. 세션의 이벤트를 `occurredAt` 순서로 정렬해요.
2. 각 이벤트부터 **다음 상태 변경 이벤트**(또는 종료 시각)까지를 한 구간으로 봐요.
3. 구간의 상태별로 초를 더해요. `MODE_CHANGE`는 상태를 바꾸지 않으므로 구간을 나누지 않고 건너뛰어요.
4. `awayCount` = AWAY 구간 수

**예시 1 — M01 완료 기준**

| 시각 | 이벤트 | 다음 이벤트까지 | 순공 |
|---|---|---|---|
| 14:00:00 | START | FOCUS 60초 | +60 |
| 14:01:00 | PAUSE | PAUSED 30초 | 0 |
| 14:01:30 | FOCUS | FOCUS 30초 | +30 |
| 14:02:00 | END | | **90초** |

**예시 2 — M05 완료 기준**

| 시각 | 이벤트 | 다음 이벤트까지 | 결과 |
|---|---|---|---|
| 14:00:00 | START | FOCUS 10분 | focus +600 |
| 14:10:00 | AWAY (14:10:30에 확정되어 전송됨) | AWAY 2분 | away +120, awayCount 1 |
| 14:12:00 | FOCUS | FOCUS 8분 | focus +480 |
| 14:20:00 | END | | **focus 1080 / away 120 / awayCount 1** |

> 이 계산은 `SessionTimeCalculator` 같은 **DB와 무관한 순수 클래스**로 만들어요. 그러면 위 두 표를 그대로 JUnit 테스트로 옮길 수 있어요. 가장 중요한 로직을 DB 없이 먼저 검증하는 거예요.

진행 중인 세션은 마지막 구간의 끝을 "지금"으로 놓고 같은 방식으로 계산해요 (7-2의 `focusSecondsSoFar`).

## 5. DB

### `focus_sessions`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users, NOT NULL | |
| status | VARCHAR(10) | `ACTIVE` / `ENDED` |
| mode | VARCHAR(10) | 현재 모드 `AI` / `MANUAL` |
| current_state | VARCHAR(10) | 현재 상태 (새로고침 복구용) |
| goal | VARCHAR(100) NULL | 목표 |
| started_at | TIMESTAMPTZ NOT NULL | |
| ended_at | TIMESTAMPTZ NULL | |
| focus_seconds / away_seconds / unknown_seconds / paused_seconds | INT NULL | 종료 시 확정 |
| away_count | INT NULL | 종료 시 확정 |
| created_at | TIMESTAMPTZ | |

인덱스: `(user_id, status)` — 진행 중인 세션 조회용

### `session_events`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGSERIAL PK | |
| session_id | BIGINT FK → focus_sessions | |
| event_id | UUID **UNIQUE** NOT NULL | 프론트가 만든 ID (중복 방지) |
| type | VARCHAR(20) | 3장의 type |
| mode | VARCHAR(10) NULL | MODE_CHANGE일 때만 |
| reason | VARCHAR(20) NULL | UNKNOWN일 때만 |
| occurred_at | TIMESTAMPTZ NOT NULL | 상태가 바뀐 시각 (프론트 기준) |
| created_at | TIMESTAMPTZ | 서버가 받은 시각 |

> 이미지·영상 컬럼은 **만들지 않아요** (기획서 M05: 프레임은 저장 대상에서 제외).
> Java에서는 `Instant`(또는 `OffsetDateTime`)를 쓰고, `spring.jpa.properties.hibernate.jdbc.time_zone=UTC`로 설정해요.

## 6. API 목록

모든 API는 로그인이 필요해요 (01 명세 8장의 인터셉터와 `@LoginUser`). **다른 사람의 세션에 접근하면 404**예요 (세션이 있는지조차 알려주지 않아요).

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/sessions` | 입관 (시작) |
| GET | `/api/sessions/active` | 진행 중인 세션 (새로고침·로그인 직후 복구) |
| POST | `/api/sessions/{id}/events` | 상태 변화 기록 |
| POST | `/api/sessions/{id}/end` | 출관 (종료, 순공 확정) |
| GET | `/api/sessions/{id}` | 결과 + 수련 일지 |

## 7. API 상세

### 7-1. `POST /api/sessions` — 입관

요청:
```json
{ "mode": "AI", "goal": "정규화 개념 정리 (1NF~BCNF)", "startedAt": "2026-11-24T14:00:00+09:00" }
```
- 과목·계획(`subjectId`, `planId`)은 M03·M06 명세에서 추가해요.

서버 동작:
1. 진행 중인 세션이 있으면 409를 줘요.
2. 세션을 저장해요 (`ACTIVE`, `current_state=FOCUS`).
3. `START` 이벤트를 저장해요 (`occurredAt = startedAt`).

응답 `201`:
```json
{ "id": 2482, "status": "ACTIVE", "mode": "AI", "currentState": "FOCUS",
  "goal": "정규화 개념 정리 (1NF~BCNF)", "startedAt": "2026-11-24T14:00:00+09:00" }
```

| 상황 | 상태 | code |
|---|---|---|
| mode 누락, startedAt이 1분 넘게 미래 | 400 | `VALIDATION_FAILED` |
| 이미 진행 중인 세션 있음 | 409 | `SESSION_ALREADY_ACTIVE` |

### 7-2. `GET /api/sessions/active` — 진행 중인 세션

- 있으면 `200` + 7-1 응답에 `"focusSecondsSoFar": 2352`를 더해서 줘요. 프론트는 이 값으로 타이머를 이어가요.
- 없으면 `200` + `data: null`이에요. 세션이 없는 것도 정상 상황이라 404가 아니에요.

### 7-3. `POST /api/sessions/{id}/events` — 상태 변화 기록

요청:
```json
{ "eventId": "6f1c2a9e-0d3b-4a7e-9c55-2b1f0e8d7a10", "type": "AWAY", "occurredAt": "2026-11-24T14:10:00+09:00" }
```
- UNKNOWN이면 `"reason": "LOW_LIGHT"`를, MODE_CHANGE면 `"mode": "MANUAL"`을 추가해요.

**검증 순서** (위에서부터 하나씩 구현하면 돼요):

| # | 확인 | 실패 시 |
|---|---|---|
| 1 | 내 세션인가 | 404 `SESSION_NOT_FOUND` |
| 2 | 이미 저장된 eventId인가 | 저장하지 않고 **200 그대로** (재시도 허용) |
| 3 | ACTIVE인가 | 409 `SESSION_ALREADY_ENDED` |
| 4 | type에 맞는 필드가 있나 (reason / mode) | 400 `VALIDATION_FAILED` |
| 5 | 마지막 이벤트 시각 ≤ occurredAt ≤ 지금 + 1분 | 400 `INVALID_EVENT_TIME` |
| 6 | AWAY·UNKNOWN인데 현재 mode가 MANUAL | 400 `EVENT_NOT_ALLOWED_IN_MODE` |

저장한 뒤에는 세션의 `current_state`와 `mode`를 갱신해요.

응답 `200`:
```json
{ "eventId": "6f1c2a9e-...", "currentState": "AWAY", "mode": "AI" }
```

### 7-4. `POST /api/sessions/{id}/end` — 출관

요청:
```json
{ "endedAt": "2026-11-24T14:39:12+09:00" }
```

서버 동작:
1. 이미 `ENDED`면 **저장된 결과를 그대로 200**으로 줘요. 재시도해도 기록은 한 건이에요 (기획서 7장 "재시도와 보상").
2. `END` 이벤트를 저장해요 (endedAt도 7-3의 5번 규칙으로 검증).
3. 4장 방식으로 계산해서 결과 컬럼에 저장하고 `ENDED`로 바꿔요.

응답 `200`:
```json
{ "id": 2482, "status": "ENDED",
  "startedAt": "2026-11-24T14:00:00+09:00", "endedAt": "2026-11-24T14:39:12+09:00",
  "focusSeconds": 2232, "awaySeconds": 120, "unknownSeconds": 0, "pausedSeconds": 0, "awayCount": 1 }
```
- 보상(내공 +39)은 M12 명세에서 이 응답에 필드를 추가해요.

| 상황 | 상태 | code |
|---|---|---|
| 내 세션 아님 | 404 | `SESSION_NOT_FOUND` |
| endedAt이 마지막 이벤트보다 이전 | 400 | `INVALID_EVENT_TIME` |

### 7-5. `GET /api/sessions/{id}` — 결과 + 수련 일지

- 7-4 응답에 `"events": [ { "eventId", "type", "mode", "reason", "occurredAt" }, ... ]`를 더해서 줘요.
- 진행 중인 세션도 조회할 수 있어요 (PC06 ⑥ 수련 일지 패널). 이때 결과 필드는 `null`이에요.

## 8. 구현 순서

1. **Enum 만들기:** `SessionMode`, `SessionState`, `SessionStatus`, `EventType`, `UnknownReason`
2. **엔티티와 Repository:** `FocusSession`, `SessionEvent`
3. **`SessionTimeCalculator` + JUnit 테스트를 먼저 작성:** 4장의 예시 두 개를 그대로 테스트로 옮겨요
4. **start / active**
5. **events:** 7-3 검증 표를 한 줄씩 구현
6. **end:** 멱등 처리 포함
7. **detail**
8. **시나리오 재현:** Postman으로 9장 시나리오를 먼저 돌려 보고, 그다음 프론트·AI 파트와 실제 흐름을 맞춰요

> 로그인은 [01 명세](01-auth.md) 7-6의 **로컬 전용 `POST /api/dev/login`** 으로 해요. 소셜 로그인이 완성되기 전에도 이 명세를 개발할 수 있어요. "B 계정으로 A의 세션 접근" 같은 테스트는 `userId` 1과 2로 각각 로그인해서 확인해요.

막히면 **"02 명세 5단계"** 처럼 단계 번호로 물어보세요.

## 9. 완료 체크 (기획서 완료 기준)

- [ ] **M01:** 60초 집중 → 30초 정지 → 30초 집중 → 종료하면 `focusSeconds` 90, 기록 한 건
- [ ] **M05:** 30초 넘게 자리를 비웠다 돌아오면 `awayCount` 1
- [ ] MANUAL로 시작해도 (카메라 권한 거부 상황) 시작·정지·종료가 정상 동작
- [ ] 같은 eventId를 두 번 보내도 이벤트는 1건
- [ ] end를 두 번 불러도 같은 결과, 세션 1건
- [ ] 진행 중인데 새로 시작하면 409
- [ ] B 계정으로 A의 세션을 조회하거나 이벤트를 보내면 404
- [ ] 새로고침 후 `/active`로 타이머가 이어짐
- [ ] DB 어디에도 이미지·영상 데이터 없음

## 10. 나중에 (이번 범위 아님)

- **과목·계획 연결 (M03, M06):** start 요청에 `subjectId`, `planId` 추가
- **탭 이탈 기록 (M09):** `TAB_HIDDEN` / `TAB_VISIBLE` 이벤트. 순공에는 영향 없이 기록만 해요 (PC07: 탭 복귀는 안내만, 타이머 유지)
- **보상 지급 (M12):** end에서 세션당 한 번만 지급
- **자정을 넘는 세션의 일간 통계 분리:** M02 통계 명세에서
- **브라우저를 닫아 출관하지 못한 세션 처리** (예: 12시간 지난 ACTIVE를 자동 종료) — 팀 결정 필요
- **네트워크 끊김 중 쌓인 이벤트 한꺼번에 보내기:** 지금은 순서대로 재시도만 해요
