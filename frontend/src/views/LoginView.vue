<script setup>
// PC01 강호 입문 (소셜 로그인) — /login
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import AppLogo from '@/components/AppLogo.vue'
import FocusScene from '@/components/FocusScene.vue'
import { errorMessage, getAuthorizeUrl } from '@/api/auth'

// 실제 버튼 모양은 각 제공자의 공식 디자인 가이드 리소스로 바꿔야 해요
const PROVIDERS = [
  { id: 'google', label: 'Google로 계속하기' },
  { id: 'kakao', label: '카카오로 계속하기' },
  { id: 'naver', label: '네이버로 계속하기' },
  // Instagram 은 비즈니스·크리에이터 계정만 가능해서 채택 여부를 팀이 결정해야 해요 (기획서 5장)
  { id: 'instagram', label: 'Instagram으로 계속하기', review: true },
]

const FEATURES = [
  { icon: 'calendar', text: '날짜별 계획과 비무 D-Day' },
  { icon: 'timer', text: '폐관 수련 · 자리 이탈 자동 기록' },
  { icon: 'trophy', text: '내공을 쌓아 삼류에서 생사경까지' },
  { icon: 'users', text: '초대 코드로 함께하는 문파 합동 수련' },
]

// 마지막에 쓴 제공자는 서버와 관계없이 브라우저에 저장해요 (01-auth.md)
const RECENT_KEY = 'lm:lastProvider'
const recentProvider = ref(localStorage.getItem(RECENT_KEY))

const loadingProvider = ref(null)
const error = ref('')

// TODO(API 연결): GET /api/sessions/active 로 진행 중인 세션 확인. 지금은 목업이에요.
const activeSession = { subject: '데이터베이스', elapsed: '00:42:10' }

async function login(provider) {
  if (loadingProvider.value) return
  error.value = ''
  loadingProvider.value = provider
  try {
    const url = await getAuthorizeUrl(provider)
    localStorage.setItem(RECENT_KEY, provider)
    location.href = url
  } catch (e) {
    error.value = errorMessage(e)
    loadingProvider.value = null
  }
}
</script>

<template>
  <div class="login">
    <!-- 왼쪽: 소개 -->
    <section class="intro">
      <AppLogo :size="20" />
      <h1 class="serif">매일의 순공이<br />내공이 된다.</h1>
      <p class="lead">폐관 수련으로 쌓은 순공만큼 경지가 오르는 학습 메이트</p>

      <ul class="features">
        <li v-for="f in FEATURES" :key="f.text">
          <span class="feature-icon"><AppIcon :name="f.icon" /></span>
          {{ f.text }}
        </li>
      </ul>

      <div class="spacer"></div>
      <div class="art">
        <FocusScene :progress="0.55" :hour="17.4" />
      </div>
    </section>

    <!-- 오른쪽: 로그인 -->
    <section class="panel">
      <div v-if="activeSession" class="toast">
        <AppIcon name="clock" :size="16" class="gold" />
        <div>
          <b>진행 중인 세션이 있어요</b>
          <span>
            {{ activeSession.subject }} · {{ activeSession.elapsed }} — 로그인하면 이어서 측정해요
          </span>
        </div>
      </div>

      <div class="box">
        <h2 class="serif">강호 입문</h2>
        <p class="muted">자주 쓰는 계정으로 바로 시작하세요 · 처음이면 자동으로 가입돼요</p>

        <div class="providers">
          <button
            v-for="p in PROVIDERS"
            :key="p.id"
            type="button"
            class="oauth"
            :class="p.id"
            :disabled="loadingProvider !== null"
            @click="login(p.id)"
          >
            <span class="oauth-icon">
              <template v-if="p.id === 'google'">G</template>
              <svg v-else-if="p.id === 'kakao'" width="22" height="22" viewBox="0 0 24 24">
                <ellipse cx="12" cy="11" rx="9" ry="7" fill="#191919" />
                <path d="M8 16.5 L7 21 L11.5 17.5 Z" fill="#191919" />
              </svg>
              <template v-else-if="p.id === 'naver'">N</template>
              <svg
                v-else
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C13584"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.3" cy="6.7" r="1" fill="#C13584" stroke="none" />
              </svg>
            </span>
            <b>{{ loadingProvider === p.id ? '이동하는 중…' : p.label }}</b>
            <span v-if="p.review" class="badge badge-line review">검토 필요</span>
            <span v-if="recentProvider === p.id" class="recent">최근 사용</span>
          </button>
        </div>

        <p v-if="error" class="error" role="alert">
          <AppIcon name="alert" :size="15" />
          {{ error }}
        </p>

        <div class="notice">
          <AppIcon name="info" :size="16" />
          <span>
            LearningMate는 <b>별도 아이디·비밀번호 없이</b> 소셜 계정으로만 로그인해요. 처음
            로그인하면 무호(닉네임)만 정하고 바로 시작해요.
          </span>
        </div>

        <div class="terms">
          <span>
            계속하면 <a href="#" @click.prevent>이용약관</a>과
            <a href="#" @click.prevent>개인정보 처리방침</a>에 동의하게 돼요
          </span>
          <span class="https">
            <AppIcon name="shield" :size="14" />
            로그인·카메라는 HTTPS 주소에서만 동작해요
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  min-height: 100%;
  background: #fff;
}

/* ---------- 왼쪽 소개 ---------- */
.intro {
  width: 44%;
  max-width: 640px;
  min-width: 460px;
  display: flex;
  flex-direction: column;
  padding: 56px 60px;
  background: var(--jade);
  color: #fff;
}
.intro h1 {
  margin-top: 56px;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -1px;
}
.lead {
  margin-top: 14px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--sand);
}
.features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 44px;
  font-size: 15px;
}
.features li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.feature-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}
.spacer {
  flex: 1;
  min-height: 28px;
}
.art {
  position: relative;
  height: 190px;
  border-radius: 12px;
  overflow: hidden;
}

/* ---------- 오른쪽 로그인 ---------- */
.panel {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 40px 40px;
}
.toast {
  position: absolute;
  top: 24px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--ink);
  color: #fff;
  font-size: 13px;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, 0.45);
}
.toast div {
  display: flex;
  flex-direction: column;
}
.toast span {
  font-size: 11px;
  color: #bfb3a0;
}
.gold {
  color: var(--gold);
}
.box {
  width: 400px;
  display: flex;
  flex-direction: column;
}
.box h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.6px;
}
.box > .muted {
  margin-top: 6px;
}
.providers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 26px;
}
.oauth {
  position: relative;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #dadce0;
  background: #fff;
  color: #1f1f1f;
  transition: filter 0.15s;
}
.oauth:hover:not(:disabled) {
  filter: brightness(0.97);
}
.oauth:disabled {
  cursor: wait;
}
.oauth b {
  flex: 1;
  margin-right: 32px;
  text-align: center;
  font-size: 14.5px;
}
.oauth-icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-family: Arial, sans-serif;
  font-weight: 900;
}
.google .oauth-icon {
  border-radius: 50%;
  border: 1.5px solid #dadce0;
  font-size: 13px;
  color: #4285f4;
}
.kakao {
  background: #fee500;
  border-color: #fee500;
  color: rgba(0, 0, 0, 0.85);
}
.naver {
  background: #03c75a;
  border-color: #03c75a;
  color: #fff;
}
.naver .oauth-icon {
  font-size: 17px;
}
.review {
  position: absolute;
  right: 10px;
}
.recent {
  position: absolute;
  right: -8px;
  top: -10px;
  padding: 1px 7px;
  border-radius: 6px;
  background: var(--ink);
  color: var(--paper);
  font-size: 11px;
  font-weight: 700;
}
.error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 13px;
  font-weight: 700;
  color: var(--cinnabar);
}
.notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 22px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--jade);
  font-size: 12px;
  line-height: 1.55;
}
.notice span {
  color: var(--ink);
}
.terms {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
  text-align: center;
}
.terms a {
  text-decoration: underline;
}
.https {
  display: flex;
  align-items: center;
  gap: 6px;
}
.https :deep(svg) {
  color: var(--cinnabar);
}
</style>
