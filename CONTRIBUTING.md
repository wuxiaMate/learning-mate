# Contributing Guide

LearningMate 협업 규칙입니다. 브랜치를 만들거나 커밋, PR을 올리기 전에 한 번 읽어주세요.

## 1. 브랜치 전략

| 브랜치 | 역할 | 직접 push |
| --- | --- | --- |
| `main` | 배포 가능한 안정 버전 | ❌ (PR로만 머지) |
| `develop` | 다음 배포를 위한 통합 브랜치 | ❌ (PR로만 머지) |
| `타입/작업-설명` | 기능·문서·디자인 등 개별 작업 | ⭕ |

### 작업 브랜치 이름

```
<type>/<짧은-설명>
```

- `type`은 아래 [커밋 타입](#커밋-타입)과 같은 값을 씁니다.
- 설명은 **영문 소문자 + 하이픈(kebab-case)** 으로 씁니다.

```
feat/social-login
fix/timer-reset-bug
docs/mvp-plan-wireframe
design/wireframe-v0.3-wuxia
```

### 작업 흐름

1. 최신 `develop`에서 작업 브랜치를 만듭니다.
   ```bash
   git switch develop
   git pull origin develop
   git switch -c feat/social-login
   ```
2. 작업하고 커밋합니다.
3. 원격에 push한 뒤 **`develop`을 대상으로 PR**을 엽니다.
4. 리뷰 승인 후 머지하고, 머지된 작업 브랜치는 삭제합니다.
5. 배포 시점에 `develop` → `main` PR을 열어 머지합니다.

## 2. 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 형식을 따릅니다.

```
<type>(<scope>): <제목>

<본문 (선택)>

<꼬리말 (선택)>
```

### 커밋 타입

| type | 언제 쓰나요 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 추가·수정 (기획서, 명세, README 등) |
| `design` | 와이어프레임, UI 디자인, 스타일 변경 |
| `refactor` | 동작 변화 없는 코드 구조 개선 |
| `style` | 포맷팅, 세미콜론 등 코드 의미에 영향 없는 변경 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드 설정, 패키지, 기타 잡무 |

### scope (선택)

변경된 영역을 괄호 안에 적습니다. 한 영역만 바뀌었을 때 붙이고, 여러 영역에 걸치면 생략해도 됩니다.

- `frontend`, `backend`, `docs`, `wireframe` 등

### 제목 작성 규칙

- **한글**로, 무엇을 했는지 간결하게 씁니다.
- 50자 이내로 쓰고, 끝에 마침표를 붙이지 않습니다.
- 한 커밋에는 하나의 목적만 담습니다.

### 본문 / 꼬리말 (선택)

- 본문에는 **무엇을, 왜** 바꿨는지 적습니다. 제목과 본문 사이는 한 줄 띄웁니다.
- 관련 이슈가 있으면 꼬리말에 적습니다. (`Closes #12`, `Refs #7`)

### 예시

```
feat(frontend): Vue 초기 세팅 및 PC01·PC05·PC06 화면 1차 구현
docs: 백엔드 명세 초안 추가 (소셜 로그인, 폐관 수련 세션)
fix(backend): 수련 세션 종료 시 누적 시간이 0으로 저장되는 문제 수정
```

## 3. Pull Request 규칙

- PR 제목은 **커밋 메시지 제목과 같은 형식**으로 씁니다.
  - 예: `feat(frontend): 폐관 수련 타이머 화면 구현`
- PR 본문은 [PR 템플릿](.github/PULL_REQUEST_TEMPLATE.md)을 채워서 작성합니다.
- 기본 대상 브랜치는 `develop`입니다.
- **최소 1명의 리뷰 승인** 후 머지합니다.
- 머지 전에 `develop`의 최신 변경을 반영해 충돌을 해결합니다.
- PR은 가능한 한 작게 나눕니다. 하나의 PR에는 하나의 주제만 담습니다.

## 4. 기타

- `.env`, 키 파일 등 비밀 정보는 절대 커밋하지 않습니다.
- 폴더·파일 이름에는 공백 대신 하이픈(`-`)을 사용합니다.
