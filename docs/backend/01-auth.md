# 01. 소셜 로그인(OAuth 2.0)·인증 명세 (v0.2 초안)

> 관련 화면: PC01 강호 입문(소셜 로그인) · 기획서 v0.2 5장 "계정과 저장 범위"
> 처음 읽을 때는 **한눈에 보기 → 2. 로그인 흐름 → 6. API 목록 → 10. 구현 순서**만 보면 돼요.

## 한눈에 보기

- 로그인은 **Google·카카오·네이버 소셜 로그인만** 있어요. 서비스 자체 아이디·비밀번호, 회원가입 폼, 비밀번호 찾기는 없고, **비밀번호를 저장하지 않아요.**
- 사용자는 **(제공자, 제공자 사용자 ID)** 로 알아봐요. 처음 들어온 계정이면 무호(닉네임)만 받고 가입시켜요.
- 로그인이 끝나면 서버가 **세션 쿠키(JSESSIONID)** 를 발급해요. 이후 API는 01 v0.1과 똑같이 이 쿠키로 사용자를 확인해요.
- 제공자의 액세스 토큰은 **프로필을 한 번 읽는 데만 쓰고 버려요.** 저장하지 않아요.

---

## 1. 결정한 것과 이유

| 항목 | 결정 | 이유 |
|---|---|---|
| 제공자 | Google · 카카오 · 네이버 | Instagram은 비즈니스·크리에이터 계정에서만 로그인할 수 있어 **팀 결정 전까지 제외**예요. 구조상 클래스 하나만 추가하면 붙일 수 있게 만들어요. |
| 코드 교환 위치 | 제공자가 **프론트 라우트** `/auth/callback/:provider`로 돌려보내면, 프론트가 code를 Spring에 넘기고 **Spring이 서버에서 교환**해요 | 와이어프레임 흐름 그대로예요. `client_secret`은 서버에만 있어요. |
| Spring Security | **쓰지 않아요.** `RestClient`로 토큰 교환을 직접 구현해요 | `oauth2-client`를 쓰면 설정 몇 줄로 끝나지만 안에서 무슨 일이 일어나는지 안 보여요. 제공자 3개를 직접 붙여 보면 OAuth 흐름이 확실히 이해돼요. |
| 서비스 토큰 | **서버 세션 + HttpOnly 쿠키** (기획서의 "토큰 방식" 팀 결정 항목) | 갱신 로직 없이 세션 만료 시간이 요청마다 자동으로 연장돼요. 로그아웃은 세션 삭제로 끝나요. JWT로 바꾸면 7장만 달라져요. |
| 같은 이메일, 다른 제공자 | **자동으로 합치지 않아요** (기획서 기본안) | 카카오는 이메일 동의가 선택이라 이메일이 없을 수도 있어요. 계정 연결은 설정 화면에서 해요 (→ 12. 나중에). |
| 이메일 | **필수 아님.** 받으면 참고용으로만 저장 | 카카오에서 이메일 동의를 거부해도 가입할 수 있어요 (기획서 팀 결정 항목에 대한 제안). |
| 프론트 연결 | Vite proxy로 `/api` → `http://localhost:8080` | 같은 출처가 되어 CORS·쿠키 설정이 필요 없어요. |

## 2. 로그인 흐름

```
[브라우저]                [Spring]                         [제공자(카카오 등)]
 1. 카카오 버튼 클릭
    ─ GET /api/auth/oauth/kakao/authorize-url ─▶
                          state 생성 → 세션에 저장
    ◀─────────── { url } ─────────────────────
 2. url로 이동 ─────────────────────────────────────────────▶ 동의 화면
 3. ◀──── /auth/callback/kakao?code=...&state=... 로 리디렉트 ────
 4. ─ POST /api/auth/oauth/kakao/callback {code, state} ─▶
                          ① state 확인
                          ② code → 액세스 토큰 ────────────▶ 토큰 API
                          ③ 토큰 → 프로필 ─────────────────▶ 사용자 API
                          ④ (KAKAO, 12345) 계정 찾기
    ◀─ 있으면 LOGGED_IN (세션 쿠키 발급)
    ◀─ 없으면 SIGNUP_REQUIRED
 5. (처음이면) 무호 입력
    ─ POST /api/auth/signup {nickname} ─▶ 가입 + 로그인
```

- **state**는 CSRF 방지용 일회용 난수예요. 서버가 만들어 세션에 저장하고, 돌아왔을 때 같은지 확인한 뒤 바로 지워요.
- 사용자가 동의 화면에서 **취소**하면 제공자가 `?error=access_denied`로 돌려보내요. 프론트는 Spring을 부르지 않고 로그인 화면으로 돌아가 안내해요.
- PC01의 "최근 사용" 표시는 프론트가 `localStorage`에 마지막 제공자를 저장해서 처리해요. 서버와는 관계없어요.

## 3. 제공자별 정보

> 아래 주소는 구현 전에 각 제공자 개발자 문서에서 **한 번 더 확인**하세요.

| | Google | 카카오 | 네이버 |
|---|---|---|---|
| 앱 등록 | Google Cloud Console | Kakao Developers | NAVER Developers |
| 인가 URL | `accounts.google.com/o/oauth2/v2/auth` | `kauth.kakao.com/oauth/authorize` | `nid.naver.com/oauth2.0/authorize` |
| 토큰 URL | `oauth2.googleapis.com/token` | `kauth.kakao.com/oauth/token` | `nid.naver.com/oauth2.0/token` |
| 프로필 URL | `openidconnect.googleapis.com/v1/userinfo` | `kapi.kakao.com/v2/user/me` | `openapi.naver.com/v1/nid/me` |
| scope | `openid email profile` | 닉네임(필수), 이메일(선택) | 앱 설정에서 선택 |
| 사용자 ID 필드 | `sub` | `id` (숫자 → 문자열로 저장) | `response.id` |

**리디렉션 URI 등록** (제공자마다 전부 등록해야 해요):
- 로컬: `http://localhost:5173/auth/callback/{google|kakao|naver}`
- 폰 테스트(터널): `https://<터널 주소>/auth/callback/...` — 주소가 바뀌면 다시 등록해야 해요
- 데모 배포: `https://<배포 주소>/auth/callback/...`

**비밀값 관리:** `client-id`와 `client-secret`은 **절대 git에 올리지 않아요.** 환경변수나 `.gitignore`된 `application-local.yml`에 둬요.

```yaml
oauth:
  base-redirect-uri: ${APP_BASE_URL}/auth/callback   # 예: http://localhost:5173/auth/callback
  google: { client-id: ${GOOGLE_CLIENT_ID}, client-secret: ${GOOGLE_CLIENT_SECRET} }
  kakao:  { client-id: ${KAKAO_CLIENT_ID},  client-secret: ${KAKAO_CLIENT_SECRET} }
  naver:  { client-id: ${NAVER_CLIENT_ID},  client-secret: ${NAVER_CLIENT_SECRET} }
```

## 4. 공통 응답 형식 (모든 API 공통 — v0.1과 같아요)

```json
{ "success": true,  "data": { "...": "..." }, "error": null }
{ "success": false, "data": null, "error": { "code": "INVALID_OAUTH_STATE", "message": "로그인을 처음부터 다시 시도해 주세요" } }
```
- HTTP 상태 코드도 함께 맞춰요. `code`는 프론트 분기용이고 `message`는 화면에 그대로 띄워도 되는 문장이에요. 204는 body가 없어요.

## 5. DB

### `users` — 서비스 사용자

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| nickname | VARCHAR(20) | NOT NULL | 무호. 중복 허용 (MVP) |
| timezone | VARCHAR(40) | NOT NULL, 기본 `Asia/Seoul` | 통계·D-Day 계산용 |
| terms_agreed_at | TIMESTAMPTZ | NOT NULL | 가입 시 약관 동의 시각 |
| created_at | TIMESTAMPTZ | NOT NULL | |

v0.1에 있던 `email`, `password_hash`는 **없어졌어요.**

### `social_accounts` — 사용자에 연결된 소셜 계정

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| user_id | BIGINT | FK → users, NOT NULL | |
| provider | VARCHAR(20) | NOT NULL | `GOOGLE` / `KAKAO` / `NAVER` |
| provider_user_id | VARCHAR(100) | NOT NULL | 제공자가 준 사용자 ID |
| email | VARCHAR(255) | NULL | 받았으면 참고용 |
| created_at | TIMESTAMPTZ | NOT NULL | |
| last_login_at | TIMESTAMPTZ | NOT NULL | |

- **UNIQUE (provider, provider_user_id)**: 같은 소셜 계정은 한 사용자에게만 연결돼요.
- **UNIQUE (user_id, provider)**: 한 사용자는 제공자마다 계정을 하나만 연결해요.
- 테이블을 나눠 두는 이유: 나중에 "계정 연결"을 하면 한 사용자에 소셜 계정이 여러 개 붙어요.

## 6. API 목록

| 메서드 | 경로 | 설명 | 로그인 필요 |
|---|---|---|---|
| GET | `/api/auth/oauth/{provider}/authorize-url` | 제공자 동의 화면 주소 받기 | X |
| POST | `/api/auth/oauth/{provider}/callback` | code 교환 → 로그인 또는 가입 필요 | X |
| POST | `/api/auth/signup` | 처음 온 사용자 무호 입력·가입 | X (대기 중인 가입 정보 필요) |
| POST | `/api/auth/logout` | 로그아웃 | O |
| GET | `/api/auth/me` | 내 정보 | O |
| POST | `/api/dev/login` | **로컬 전용** 테스트 로그인 | X |

`{provider}`는 소문자 `google`, `kakao`, `naver`예요. 그 외 값(예: `instagram`)은 `400 UNSUPPORTED_PROVIDER`예요.

## 7. API 상세

### 7-1. `GET /api/auth/oauth/{provider}/authorize-url`

서버 동작:
1. 난수 state를 만들어요 (`UUID` 또는 `SecureRandom`).
2. 세션에 `OAUTH_STATE = { provider, state }`로 저장해요.
3. 제공자 인가 URL에 `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`를 붙여요.

응답 `200`:
```json
{ "success": true, "error": null,
  "data": { "url": "https://kauth.kakao.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&state=..." } }
```
프론트는 `location.href = url`로 이동해요.

### 7-2. `POST /api/auth/oauth/{provider}/callback`

요청 (프론트가 콜백 URL의 쿼리를 그대로 옮겨요):
```json
{ "code": "AbC123...", "state": "9f1d..." }
```

서버 동작:

| # | 단계 | 실패 시 |
|---|---|---|
| 1 | 세션의 `OAUTH_STATE`가 같은 provider, 같은 state인가. 확인 후 **바로 삭제**(일회용) | 400 `INVALID_OAUTH_STATE` |
| 2 | 토큰 URL에 `code`, `client_id`, `client_secret`, `redirect_uri`(, 네이버는 `state`)를 보내 액세스 토큰 받기 | 401 `OAUTH_FAILED` (code 만료·재사용 등) |
| 3 | 액세스 토큰으로 프로필 URL 호출 → 사용자 ID, 이메일(있으면), 닉네임 후보 | 502 `OAUTH_PROVIDER_ERROR` (제공자 장애) |
| 4 | `(provider, provider_user_id)`로 `social_accounts` 조회 | — |

4번 결과에 따라:

**있으면 → 로그인**: `request.changeSessionId()`(세션 고정 공격 방지) → 세션에 `LOGIN_USER_ID` 저장 → `last_login_at` 갱신
```json
{ "success": true, "error": null,
  "data": { "status": "LOGGED_IN",
            "user": { "id": 1, "nickname": "청운검객", "timezone": "Asia/Seoul", "providers": ["KAKAO"] } } }
```

**없으면 → 가입 대기**: 세션에 `PENDING_SIGNUP = { provider, providerUserId, email }`을 저장하고, 아직 users에는 **아무것도 만들지 않아요.**
```json
{ "success": true, "error": null,
  "data": { "status": "SIGNUP_REQUIRED", "suggestedNickname": "김싸피" } }
```
프론트는 무호 입력 화면을 띄워요. 입력칸의 기본값이 `suggestedNickname`이에요.

> 두 경우 모두 HTTP 200이에요. "처음 온 사용자"는 오류가 아니라 정상 흐름이라서, `status` 값으로 구분해요.

### 7-3. `POST /api/auth/signup`

요청:
```json
{ "nickname": "청운검객" }
```
- nickname: 필수, 앞뒤 공백 제거 후 2~12자
- 약관은 PC01 문구("계속하면 동의하게 돼요")대로 이 요청을 동의로 보고, `terms_agreed_at`을 기록해요.

서버 동작:
1. 세션의 `PENDING_SIGNUP`을 꺼내요. 없으면 400이에요.
2. 같은 트랜잭션에서 `users`와 `social_accounts`를 저장해요.
3. `PENDING_SIGNUP`을 지우고, 7-2와 같은 방식으로 로그인 처리해요.

응답 `201`: 7-2의 `user` 객체

| 상황 | 상태 | code |
|---|---|---|
| nickname 형식 오류 | 400 | `VALIDATION_FAILED` |
| 대기 중인 가입 정보 없음 (세션 만료, 직접 호출) | 400 | `SIGNUP_SESSION_EXPIRED` |
| 그 사이 같은 소셜 계정이 이미 가입됨 (탭 두 개) | 409 | `SOCIAL_ACCOUNT_ALREADY_LINKED` |

### 7-4. `POST /api/auth/logout`

- 우리 서비스 세션만 invalidate하고 `204`를 줘요. 제공자 쪽 로그아웃은 하지 않아요.
- 이미 로그아웃된 상태에서 불러도 `204`예요.

### 7-5. `GET /api/auth/me`

- 로그인 상태: `200` + 7-2의 `user` 객체 (`providers`는 연결된 제공자 목록)
- 비로그인 상태: `401 UNAUTHENTICATED`

### 7-6. `POST /api/dev/login` — 로컬 전용

요청:
```json
{ "userId": 1 }
```
- **`local` 프로필에서만 등록되는 컨트롤러예요** (`@Profile("local")`). 다른 프로필에서는 주소 자체가 없어서 404가 나요.
- 용도: Postman에서 OAuth 없이 로그인해서 02 세션 API 등을 테스트해요. OAuth가 완성되기 전에도 다른 기능 개발을 막지 않아요.
- `local` 프로필로 시작할 때 테스트 사용자 2명(`테스트 계정 A`, `테스트 계정 B`)이 없으면 만들어요. 소셜 계정 연결은 없어요.
- 데모와 그룹 시연은 기획서대로 **실제 소셜 계정 두 개**로 해요.

## 8. 로그인 확인 규칙 (인터셉터 — v0.1과 같아요)

- `/api/**` 중 `/api/auth/oauth/**`, `/api/auth/signup`, `/api/dev/**`를 뺀 모든 요청은 로그인이 필요해요.
- 세션에 `LOGIN_USER_ID`가 없으면 `401 UNAUTHENTICATED`예요.
- 컨트롤러에서는 `@LoginUser Long userId`로 현재 사용자를 받아요.
- `server.servlet.session.timeout=12h`로 설정해요. AI 모드에서 상태 변화 없이 30분 넘게 공부해도 출관 요청이 실패하지 않게 하려는 거예요.

## 9. 코드 구조 제안

제공자마다 다른 부분은 **인터페이스 하나로 감싸요.** Instagram을 붙이게 되면 구현 클래스 하나만 추가하면 돼요.

```
auth/
  AuthController, AuthService, LoginInterceptor, LoginUser(어노테이션), LoginUserArgumentResolver
  DevAuthController            (@Profile("local"))
  oauth/
    OAuthProvider (enum: GOOGLE, KAKAO, NAVER)
    OAuthClient   (interface)
      ├─ String authorizeUrl(String state)
      └─ OAuthProfile fetchProfile(String code, String state)   // 토큰 교환 + 프로필 조회
    GoogleOAuthClient / KakaoOAuthClient / NaverOAuthClient
    OAuthProfile  (record: provider, providerUserId, email, nickname)
    OAuthProperties (@ConfigurationProperties("oauth"))
user/
  User, SocialAccount, UserRepository, SocialAccountRepository
```
- `AuthService`는 `Map<OAuthProvider, OAuthClient>`를 주입받아 provider로 골라 써요. `AuthService` 안에 `if (kakao) ... else if (naver)`를 쓰지 않는 게 목표예요.
- 제공자 HTTP 호출은 Spring의 `RestClient`를 써요. 카카오와 네이버의 토큰 요청은 JSON이 아니라 **form(`application/x-www-form-urlencoded`)** 이에요.

## 10. 구현 순서 (한 단계씩 확인하며)

1. **의존성:** `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `postgresql`. 비밀번호가 없어서 `spring-security-crypto`는 빠졌어요.
2. **엔티티와 Repository:** `User`, `SocialAccount`. `findByProviderAndProviderUserId`
3. **공통 응답과 예외 처리:** `ApiResponse<T>`, `ErrorCode`, `BusinessException`, `@RestControllerAdvice`
4. **인터셉터 + `@LoginUser` + dev login + me/logout.** 여기까지 되면 **02 세션 개발을 병행할 수 있어요.**
5. **제공자 앱 하나만 먼저 등록해요 (카카오 추천).** 리디렉션 URI와 비밀값을 설정해요.
6. **authorize-url:** 응답 url을 브라우저에 붙여 넣어 동의 화면이 뜨는지 확인해요.
7. **callback:** 동의 후 주소창의 `code`, `state`를 복사해 Postman으로 보내요. state가 세션에 있어야 하므로 6번과 **같은 쿠키**로 호출해야 해요.
8. **signup:** `PENDING_SIGNUP` → 가입 → 로그인
9. **Google, 네이버 추가:** `OAuthClient` 구현만 추가하면 돼요.
10. **프론트 연결:** `/auth/callback/:provider` 페이지, Vite proxy

막히면 **"01 명세 7단계"** 처럼 단계 번호로 물어보세요.

## 11. 완료 체크 (기획서 v0.2 7장 "소셜 로그인과 계정 연결" 포함)

- [ ] 카카오 첫 로그인 → `SIGNUP_REQUIRED` → 무호 입력 → `/me` 200
- [ ] 같은 카카오 계정으로 다시 로그인 → `LOGGED_IN`, **같은 user id**
- [ ] Google, 네이버로 각각 가입하면 각각 다른 사용자 (같은 이메일이어도 합쳐지지 않음)
- [ ] 카카오 이메일 동의를 거부해도 가입 가능
- [ ] 동의 화면에서 취소하면 로그인 화면으로 돌아와 안내 (프론트)
- [ ] state를 바꾸거나, 같은 code·state로 두 번 보내면 실패
- [ ] `instagram` 요청 → 400 `UNSUPPORTED_PROVIDER`
- [ ] 서로 다른 소셜 계정 두 개로 동시에 로그인하면 각자 본인 기록만 조회
- [ ] `local`이 아닌 프로필에서 `/api/dev/login` → 404
- [ ] `client-secret`이 git 이력 어디에도 없음
- [ ] `users`, `social_accounts` 어디에도 비밀번호·제공자 토큰 없음

## 12. 나중에 (이번 범위 아님)

- **계정 연결 (설정 화면, PC14):** 로그인한 상태에서 다른 제공자로 OAuth를 한 번 더 진행해 `social_accounts`에 추가해요. 예: `POST /api/auth/oauth/{provider}/link`. 이미 다른 사용자에게 연결된 계정이면 409예요.
- **Instagram:** 팀 결정 후 `InstagramOAuthClient`를 추가해요.
- **JWT 전환:** 팀이 JWT로 정하면 7-2·7-3 응답에 토큰을 추가하고 8장을 헤더 검사로 바꿔요. state 저장 위치도 다시 정해야 해요.
- **회원 탈퇴:** 카카오 등은 탈퇴 시 제공자 연결 끊기(unlink) API 호출이 권장돼요.
- **무호 변경, 시간대 변경 API (PC14)**
- **배포 환경 쿠키 `Secure` 옵션 (HTTPS)**
