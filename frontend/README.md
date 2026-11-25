# LearningMate Frontend

Vue 3 + Vite + Vue Router + Pinia + Axios

## 실행

```sh
npm install     # 처음 한 번, 또는 package.json 이 바뀌었을 때
npm run dev     # 개발 서버 → http://localhost:5173
npm run lint    # 코드 검사
npm run format  # 코드 정렬
npm run build   # 배포용 빌드 → dist/
```

`/api` 요청은 Vite 프록시가 `http://localhost:8080`(Spring)으로 넘겨요.

## 화면 (와이어프레임 v0.3)

| 화면 | 주소 | 파일 |
| --- | --- | --- |
| PC01 강호 입문 (소셜 로그인) | `/login` | `src/views/LoginView.vue` |
| PC05 폐관 준비 | `/focus/new?plan=318` | `src/views/FocusSetupView.vue` |
| PC06 폐관 수련 (몰입 화면) | `/focus/:sessionId` | `src/views/FocusSessionView.vue` |

## 폴더

```
src/
├─ api/          백엔드 호출 (client.js = 공통 Axios)
├─ assets/       전역 CSS (main.css = 색·글꼴 토큰, 공통 버튼·카드·폼)
├─ components/   재사용 컴포넌트 (아이콘, 산수화 장면, 진행 링, 사이드바 …)
├─ composables/  재사용 로직 (useCamera)
├─ constants/    고정 데이터 (과목)
├─ layouts/      사이드바가 있는 화면의 틀
├─ router/       주소 ↔ 화면 연결
├─ stores/       Pinia 스토어 (폐관 수련 세션)
├─ utils/        시간 포맷 등 작은 함수
└─ views/        화면(페이지)
```
