<script setup>
// PC05 폐관 준비 — /focus/new?plan=318
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import FocusScene from '@/components/FocusScene.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCamera } from '@/composables/useCamera'
import { SUBJECTS, findSubject } from '@/constants/subjects'
import { PLACES, PLANS, TRACKS, useFocusStore } from '@/stores/focus'

const route = useRoute()
const router = useRouter()
const focus = useFocusStore()
const setup = focus.setup

/* ---------- ① 세션 정보 ---------- */
// <select> 값은 문자열이라 '' = 선택 안 함
const planValue = computed({
  get: () => (setup.planId === null ? '' : String(setup.planId)),
  set: (v) => focus.applyPlan(v === '' ? null : Number(v)),
})
const planLabel = (plan) => `오늘 ${plan.time} · ${findSubject(plan.subjectId).name} · ${plan.goal}`

const newTag = ref('')
function addTag() {
  const tag = newTag.value.trim().replace(/^#/, '')
  if (tag && !setup.tags.includes(tag)) setup.tags.push(tag)
  newTag.value = ''
}
function removeTag(tag) {
  setup.tags = setup.tags.filter((t) => t !== tag)
}

/* ---------- ② 측정 방식 · ④ 카메라 ---------- */
const camera = useCamera()

watch(
  () => setup.mode,
  async (mode) => {
    if (mode === 'AI') {
      await nextTick() // <video> 가 화면에 생긴 뒤 시작
      camera.start()
    } else {
      camera.stop()
    }
  },
)

const checks = computed(() => {
  if (camera.status.value === 'requesting') {
    return [{ ok: null, text: '카메라 권한을 요청하고 있어요' }]
  }
  if (camera.status.value === 'denied') {
    return [
      { ok: false, text: '카메라 권한이 거부됐어요 — 주소창의 카메라 아이콘에서 허용해 주세요' },
    ]
  }
  if (camera.status.value === 'unsupported') {
    return [{ ok: false, text: '이 브라우저에서는 카메라를 쓸 수 없어요 (HTTPS 주소 필요)' }]
  }
  const list = [{ ok: true, text: '카메라 권한 허용됨' }]
  // TODO(AI 파트): MediaPipe 얼굴 검출 결과로 교체
  list.push({ ok: null, text: '얼굴 위치 확인은 AI 감지를 연결한 뒤에 표시돼요' })
  const b = camera.brightness.value
  if (b !== null && b < 60) {
    list.push({
      ok: false,
      text: '조명이 조금 어두워요 — 판정 불가가 늘 수 있어요',
      action: '조명 켜기',
    })
  } else if (b !== null) {
    list.push({ ok: true, text: '조명이 충분해요' })
  }
  return list
})

/* ---------- ③ 수련 환경 ---------- */
const timelapseLength = computed(() => {
  const minutes = PLANS.find((p) => p.id === setup.planId)?.minutes ?? 60
  const frames = (minutes * 60) / setup.timelapseInterval
  const seconds = Math.round(frames / 10) // 10fps 로 재생
  const hours = minutes / 60
  return `약 ${Number.isInteger(hours) ? hours : hours.toFixed(1)}시간 → ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} 영상`
})

// TODO: 배경음 파일이 준비되면 Audio 로 재생 (브라우저 정책상 사용자 클릭 후에만 재생 가능)
const previewing = ref(false)

/* ---------- ⑦ 폐관 시작 ---------- */
const summary = computed(() =>
  [
    findSubject(setup.subjectId).name,
    setup.mode === 'AI' ? 'AI 감지' : '수동',
    setup.bgmOn && '배경음',
    setup.timelapseOn && '타임랩스',
  ]
    .filter(Boolean)
    .join(' · '),
)

function startSession() {
  const id = focus.start()
  router.push({ name: 'focus-session', params: { sessionId: id } })
}

function onKeydown(e) {
  const typing = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)
  if (e.key === 'Enter' && !typing) startSession()
}

onMounted(() => {
  if (route.query.plan) focus.applyPlan(Number(route.query.plan))
  if (setup.mode === 'AI') camera.start()
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <PageHeader title="폐관 준비" :crumbs="['폐관 수련', '새 세션']">
    <button type="button" class="btn btn-ghost" @click="router.back()">취소</button>
  </PageHeader>

  <div class="content">
    <div class="left">
      <!-- ① 세션 정보 -->
      <section class="card">
        <div class="card-head"><h3>세션 정보</h3></div>
        <div class="stack">
          <label class="field">
            <span class="label">연결된 계획</span>
            <select v-model="planValue" class="input">
              <option v-for="plan in PLANS" :key="plan.id" :value="String(plan.id)">
                {{ planLabel(plan) }}
              </option>
              <option value="">선택 안 함</option>
            </select>
            <span class="help">계획 없이 시작하려면 '선택 안 함' — 과목·목표는 직접 정해요</span>
          </label>

          <div class="field">
            <span class="label">과목 <span class="req">*</span></span>
            <div class="chips">
              <button
                v-for="s in SUBJECTS"
                :key="s.id"
                type="button"
                :class="setup.subjectId === s.id ? 'subj' : 'chip'"
                :style="setup.subjectId === s.id ? { background: s.bg, color: s.color } : null"
                @click="setup.subjectId = s.id"
              >
                <i v-if="setup.subjectId === s.id"></i>
                {{ s.name }}
              </button>
              <button type="button" class="chip chip-dash" title="과목 관리(M03)는 준비 중이에요">
                <AppIcon name="plus" :size="12" />새 과목
              </button>
            </div>
          </div>

          <div class="goal-row">
            <label class="field">
              <span class="label">목표</span>
              <input v-model="setup.goal" class="input" placeholder="이번 수련의 목표" />
            </label>
            <div class="field">
              <span class="label">태그</span>
              <div class="input tags">
                <button
                  v-for="tag in setup.tags"
                  :key="tag"
                  type="button"
                  class="chip chip-sand"
                  title="눌러서 삭제"
                  @click="removeTag(tag)"
                >
                  #{{ tag }}
                </button>
                <input v-model="newTag" placeholder="추가" @keydown.enter.prevent="addTag" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ② 측정 방식 -->
      <section class="card">
        <div class="card-head">
          <h3>측정 방식</h3>
          <span class="sub">세션 중에도 바꿀 수 있어요</span>
        </div>
        <div class="modes">
          <label class="mode" :class="{ on: setup.mode === 'AI' }">
            <input v-model="setup.mode" type="radio" value="AI" />
            <span class="radio"></span>
            <span class="mode-text">
              <span class="mode-title"
                ><b>AI 카메라 감지</b><span class="badge badge-red">권장</span></span
              >
              <span class="muted"
                >얼굴 검출로 자리 이탈을 자동 기록하고 재실 구간만 순공에 합산</span
              >
            </span>
          </label>
          <label class="mode" :class="{ on: setup.mode === 'MANUAL' }">
            <input v-model="setup.mode" type="radio" value="MANUAL" />
            <span class="radio"></span>
            <span class="mode-text">
              <b>수동</b>
              <span class="muted">카메라 없이 직접 시작·일시정지·종료</span>
            </span>
          </label>
        </div>
      </section>

      <!-- ③ 수련 환경 -->
      <section class="card env">
        <div class="card-head">
          <h3>수련 환경</h3>
          <span class="sub">장소는 경지가 오르면 열려요</span>
        </div>

        <div class="env-row">
          <AppIcon name="sun" class="env-icon" />
          <div class="env-label">
            <b>수련 장소</b>
            <span>하늘은 실제 시각을 따라감</span>
          </div>
          <div class="places">
            <div v-for="place in PLACES" :key="place.id" class="place">
              <button
                v-if="!place.unlock"
                type="button"
                class="thumb"
                :class="{ on: setup.placeId === place.id }"
                @click="setup.placeId = place.id"
              >
                <FocusScene :progress="0.4" :hour="14.3" />
              </button>
              <div v-else class="thumb locked" :title="`${place.unlock} 경지에 열려요`">
                <AppIcon name="lock" :size="12" />{{ place.unlock }}
              </div>
              <span :class="{ muted: place.unlock }">{{ place.name }}</span>
            </div>
          </div>
        </div>

        <div class="env-row">
          <AppIcon name="music" class="env-icon" />
          <div class="env-label">
            <b>배경음</b>
            <span>사용자 클릭 후 재생</span>
          </div>
          <select v-model="setup.track" class="input auto" :disabled="!setup.bgmOn">
            <option v-for="track in TRACKS" :key="track">{{ track }}</option>
          </select>
          <button
            type="button"
            class="icon-btn"
            :title="previewing ? '미리듣기 정지' : '미리듣기'"
            :disabled="!setup.bgmOn"
            @click="previewing = !previewing"
          >
            <AppIcon :name="previewing ? 'pause' : 'play'" :size="13" />
          </button>
          <AppIcon name="volume" :size="16" class="muted" />
          <input
            v-model.number="setup.volume"
            type="range"
            min="0"
            max="100"
            class="range volume"
            :style="{ '--fill': `${setup.volume}%` }"
            aria-label="배경음 볼륨"
          />
          <button
            type="button"
            class="toggle"
            :class="{ on: setup.bgmOn }"
            aria-label="배경음 켜기"
            @click="setup.bgmOn = !setup.bgmOn"
          ></button>
        </div>

        <div class="env-row">
          <AppIcon name="video" class="env-icon" />
          <div class="env-label">
            <b>타임랩스</b>
            <span>이 브라우저에만 저장</span>
          </div>
          <select
            v-model.number="setup.timelapseInterval"
            class="input auto"
            :disabled="!setup.timelapseOn"
          >
            <option :value="5">5초 간격</option>
            <option :value="10">10초 간격</option>
            <option :value="30">30초 간격</option>
          </select>
          <span class="muted grow">{{ timelapseLength }}</span>
          <button
            type="button"
            class="toggle"
            :class="{ on: setup.timelapseOn }"
            aria-label="타임랩스 켜기"
            @click="setup.timelapseOn = !setup.timelapseOn"
          ></button>
        </div>
      </section>
    </div>

    <!-- ④ 카메라 확인 -->
    <section class="card right">
      <div class="card-head">
        <h3><AppIcon name="camera" :size="17" />카메라 확인</h3>
        <select
          v-if="setup.mode === 'AI' && camera.devices.value.length"
          class="input auto small"
          :value="camera.deviceId.value"
          @change="camera.switchDevice($event.target.value)"
        >
          <option v-for="(d, i) in camera.devices.value" :key="d.deviceId" :value="d.deviceId">
            {{ d.label || `카메라 ${i + 1}` }}
          </option>
        </select>
      </div>

      <div class="preview">
        <template v-if="setup.mode === 'AI'">
          <video
            v-show="camera.status.value === 'granted'"
            :ref="(el) => (camera.videoEl.value = el)"
            autoplay
            playsinline
            muted
          ></video>
          <div class="face-guide"></div>
          <span v-if="camera.status.value !== 'granted'" class="preview-label">
            {{ camera.status.value === 'requesting' ? '카메라 켜는 중…' : '미리보기 없음' }}
          </span>
        </template>
        <span v-else class="preview-label">수동 모드에서는 카메라를 쓰지 않아요</span>
      </div>

      <ul v-if="setup.mode === 'AI'" class="checks">
        <li
          v-for="c in checks"
          :key="c.text"
          :class="{ warn: c.ok === false, pending: c.ok === null }"
        >
          <AppIcon
            :name="c.ok === false ? 'alert' : c.ok ? 'check' : 'clock'"
            :size="16"
            :stroke-width="2.5"
          />
          <span class="grow">{{ c.text }}</span>
          <span v-if="c.action" class="muted small-text">{{ c.action }}</span>
        </li>
      </ul>

      <p class="privacy">
        <AppIcon name="shield" :size="16" />
        프레임은 이 브라우저 안에서만 분석하고 서버로 전송·저장하지 않아요
      </p>

      <div class="divider"></div>

      <div class="start-row">
        <span class="muted">{{ summary }}</span>
        <button type="button" class="btn btn-lg" :disabled="!setup.subjectId" @click="startSession">
          <AppIcon name="play" :size="15" />
          폐관 시작
          <span class="kbd enter">Enter</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 540px);
  gap: 18px;
  padding: 22px 32px 24px;
}
.left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.req {
  color: var(--cinnabar);
}
.grow {
  flex: 1;
}

/* ① 세션 정보 */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips .chip:hover {
  border-color: var(--muted-2);
}
.goal-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 12px;
}
.tags {
  display: flex;
  align-items: center;
  gap: 6px;
}
.tags input {
  flex: 1;
  min-width: 40px;
  border: none;
  outline: none;
  font-size: 13px;
}

/* ② 측정 방식 */
.modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.mode {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  cursor: pointer;
}
.mode.on {
  border: 1.5px solid var(--cinnabar);
  background: var(--rose);
}
.mode input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.radio {
  width: 18px;
  height: 18px;
  flex: none;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: #fff;
}
.mode.on .radio {
  border: 5px solid var(--cinnabar);
}
.mode input:focus-visible + .radio {
  box-shadow: 0 0 0 3px rgba(168, 50, 42, 0.25);
}
.mode-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.mode-text .muted {
  font-size: 12px;
  line-height: 1.5;
}
.mode-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ③ 수련 환경 */
.env {
  flex: 1;
}
.env-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line-2);
}
.env-row:first-of-type {
  padding-top: 0;
}
.env-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.env-icon {
  color: var(--jade);
}
.env-label {
  width: 112px;
  flex: none;
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.env-label span {
  font-size: 11px;
  color: var(--muted);
}
.places {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 92px));
  gap: 10px;
}
.place {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
}
.thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 92 / 54;
  border-radius: 8px;
  overflow: hidden;
}
.thumb.on {
  box-shadow: 0 0 0 2.5px var(--cinnabar);
}
.thumb.locked {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1.5px dashed var(--line);
  background: var(--paper);
  color: var(--muted);
  font-weight: 500;
}
.input.auto {
  width: auto;
  min-width: 140px;
}
.input.small {
  height: 34px;
  font-size: 12px;
  min-width: 0;
  max-width: 220px;
}
.volume {
  width: 100px;
}
.icon-btn:disabled,
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ④ 카메라 */
.right {
  display: flex;
  flex-direction: column;
}
.preview {
  position: relative;
  height: 280px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--paper);
}
.preview video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* 거울처럼 보이게 */
}
.face-guide {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24%;
  aspect-ratio: 3 / 4;
  transform: translate(-50%, -50%);
  border: 2px dashed var(--cinnabar);
  border-radius: 50%;
  pointer-events: none;
}
.preview-label {
  position: relative;
  padding: 2px 8px;
  border-radius: 6px;
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}
.checks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}
.checks li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--line-2);
  background: var(--paper);
  font-size: 13px;
  color: var(--cinnabar);
}
.checks li span {
  color: var(--ink);
}
.checks li.pending {
  color: var(--muted-2);
}
.checks li.pending span {
  color: var(--muted);
}
.checks li.warn {
  border-color: var(--ink);
  background: #fff;
  color: var(--ink);
  font-weight: 700;
}
.small-text {
  font-size: 11px;
  font-weight: 400;
}
.privacy {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
}
.privacy :deep(svg) {
  color: var(--cinnabar);
}
.divider {
  height: 1px;
  margin: 16px 0;
  background: var(--line-2);
}
.start-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
}
.enter {
  margin-left: 4px;
  background: transparent;
  color: var(--sand);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
