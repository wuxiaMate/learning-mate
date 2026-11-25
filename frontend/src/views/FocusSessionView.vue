<script setup>
// PC06 폐관 수련 (몰입 화면) — /focus/:sessionId
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import FocusScene from '@/components/FocusScene.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import { findSubject } from '@/constants/subjects'
import { TRACKS, useFocusStore } from '@/stores/focus'
import {
  decimalHour,
  formatClock,
  formatDuration,
  formatDurationShort,
  formatKoreanDate,
  sijin,
} from '@/utils/time'

const route = useRoute()
const router = useRouter()
const focus = useFocusStore()

focus.ensureSession(String(route.params.sessionId))
const session = computed(() => focus.session)
const subject = computed(() => findSubject(session.value?.subjectId))
const paused = computed(() => session.value?.state === 'PAUSED')

/* ---------- ① 현재 시각 ---------- */
const nowDate = computed(() => new Date(focus.now))

/* ---------- ③ 해의 궤적 라벨 = 입관 ~ 출관 예정 ---------- */
const arcLabels = computed(() => {
  const s = session.value
  if (!s) return null
  const start = new Date(s.startedAt)
  const end = new Date(s.startedAt + s.plannedSeconds * 1000)
  return [`${formatClock(start)} 입관`, `${formatClock(end)} 출관 예정`]
})

/* ---------- ④ 타이머 ---------- */
const plannedLabel = computed(() => formatDurationShort(session.value?.plannedSeconds ?? 0))
const timerProgress = computed(() =>
  session.value ? focus.focusSeconds / session.value.plannedSeconds : 0,
)

function togglePause() {
  if (paused.value) focus.resume()
  else focus.pause()
}

/* ---------- ⑥ 접어 둔 도구 (오른쪽 패널) ---------- */
const panel = ref(null) // null | 'plan' | 'log' | 'camera'
const PANEL_TITLES = { plan: '수련 계획', log: '수련 일지', camera: '카메라' }
const EVENT_LABELS = {
  START: '입관',
  PAUSE: '일시정지',
  FOCUS: '재개',
  AWAY: '자리 이탈',
  UNKNOWN: '판정 불가',
}
function togglePanel(name) {
  panel.value = panel.value === name ? null : name
}

/* ---------- ⑧ 배경음 ---------- */
// TODO: 배경음 파일이 준비되면 Audio 로 재생. 지금은 화면 상태만 바뀌어요.
const trackIndex = ref(Math.max(TRACKS.indexOf(session.value?.track), 0))
const bgmPlaying = ref(session.value?.bgmOn ?? true)
const volume = ref(session.value?.volume ?? 60)
function changeTrack(step) {
  trackIndex.value = (trackIndex.value + step + TRACKS.length) % TRACKS.length
}

/* ---------- ⑨ 몰입 보기: 마우스가 3초 멈추면 시각·타이머만 남김 ---------- */
const immersive = ref(false)
let idleTimer = null
function wake() {
  immersive.value = false
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (!panel.value && !confirmingEnd.value) immersive.value = true
  }, 3000)
}
function enterImmersive() {
  clearTimeout(idleTimer)
  panel.value = null
  immersive.value = true
}

/* ---------- ⑩ 출관 ---------- */
const confirmingEnd = ref(false)
let leaving = false

function askEnd() {
  confirmingEnd.value = true
  immersive.value = false
}
function endSession() {
  leaving = true
  // TODO(API 연결): POST /api/sessions/{id}/end → PC08 수련 결과 화면으로 이동
  focus.end()
  router.push({ name: 'focus-new' })
}

// 다른 화면으로 나가려 하면 확인 후 일시정지 (라우트 가드)
onBeforeRouteLeave(() => {
  if (leaving || !focus.session) return true
  const ok = window.confirm('폐관 중이에요. 이 화면을 나가면 수련이 일시정지돼요. 나갈까요?')
  if (ok) focus.pause()
  return ok
})

/* ---------- 단축키: Space 일시정지 · Esc 출관 ---------- */
function onKeydown(e) {
  if (e.code === 'Space') {
    e.preventDefault()
    togglePause()
    wake()
  } else if (e.key === 'Escape') {
    if (confirmingEnd.value) confirmingEnd.value = false
    else if (panel.value) panel.value = null
    else askEnd()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  wake()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(idleTimer)
})
</script>

<template>
  <div v-if="session" class="focus" :class="{ immersive }" @mousemove="wake" @mousedown="wake">
    <FocusScene
      :progress="focus.elapsedRatio"
      :hour="decimalHour(nowDate)"
      :state="paused ? 'pause' : 'focus'"
      :labels="arcLabels"
    />

    <!-- ① 현재 시각 · 시진 -->
    <div class="clock keep">
      <div class="clock-date">{{ formatKoreanDate(nowDate) }} · {{ sijin(nowDate) }}</div>
      <div class="clock-time serif num">
        {{ formatClock(nowDate) }}<span>{{ nowDate.getHours() < 12 ? '오전' : '오후' }}</span>
      </div>
    </div>

    <!-- ② 폐관 중 표시 -->
    <div class="status glass fade">
      <AppIcon name="lock" :size="14" class="red" />
      <b>폐관 중</b>
      <span class="vbar"></span>
      <span class="subj" :style="{ background: subject.bg, color: subject.color }">
        <i></i>{{ subject.name }}
      </span>
      <b class="goal">{{ session.goal }}</b>
    </div>

    <!-- ⑤ 경지 · 내공 -->
    <ProgressRing
      class="realm glass fade"
      :size="96"
      :thickness="4"
      :progress="focus.realm.progress"
      color="var(--gold)"
    >
      <span class="realm-label">경지</span>
      <b class="realm-name serif">{{ focus.realm.name }}</b>
      <span class="realm-gain num">내공 +{{ focus.gainedPower }}</span>
    </ProgressRing>

    <!-- ④ 폐관 타이머 -->
    <ProgressRing
      class="timer glass keep"
      :size="300"
      :progress="timerProgress"
      :color="paused ? 'var(--muted)' : 'var(--cinnabar)'"
    >
      <span class="timer-state">
        <i :class="{ paused }"></i
        >{{ paused ? '일시정지' : session.mode === 'AI' ? '재실 · 수련 중' : '수동 · 수련 중' }}
      </span>
      <div class="timer-value serif num">{{ formatDuration(focus.focusSeconds) }}</div>
      <span class="timer-sub num">
        목표 {{ plannedLabel }} · 오늘 순공 {{ formatDurationShort(focus.todayFocusSeconds) }}
      </span>
      <div class="timer-actions">
        <button
          type="button"
          :title="paused ? '재개 (Space)' : '일시정지 (Space)'"
          @click="togglePause"
        >
          <AppIcon :name="paused ? 'play' : 'pause'" :size="26" :class="{ red: paused }" />
        </button>
        <span class="vbar"></span>
        <button type="button" title="출관 (Esc)" @click="askEnd">
          <AppIcon name="stop" :size="24" class="red" />
        </button>
      </div>
    </ProgressRing>

    <!-- ⑥ 접어 둔 도구 -->
    <div class="tools fade">
      <button
        v-for="[name, icon] in [
          ['plan', 'list'],
          ['log', 'clock'],
          ['camera', 'camera'],
        ]"
        :key="name"
        type="button"
        class="tool"
        :class="{ on: panel === name }"
        @click="togglePanel(name)"
      >
        <span class="fab glass"><AppIcon :name="icon" :size="20" /></span>
        <span class="tool-label glass">{{ PANEL_TITLES[name] }}</span>
      </button>
    </div>

    <aside v-if="panel" class="panel glass">
      <header>
        <b class="serif">{{ PANEL_TITLES[panel] }}</b>
        <button type="button" title="닫기" @click="panel = null">
          <AppIcon name="x" :size="18" />
        </button>
      </header>

      <div v-if="panel === 'plan'" class="panel-body">
        <dl>
          <dt>과목</dt>
          <dd>{{ subject.name }}</dd>
          <dt>목표</dt>
          <dd>{{ session.goal }}</dd>
          <dt>계획 시간</dt>
          <dd>
            {{ arcLabels[0].replace(' 입관', '') }} – {{ arcLabels[1].replace(' 출관 예정', '') }}
          </dd>
          <dt>측정 방식</dt>
          <dd>{{ session.mode === 'AI' ? 'AI 카메라 감지' : '수동' }}</dd>
        </dl>
      </div>

      <ol v-else-if="panel === 'log'" class="panel-body log">
        <li v-for="event in [...session.events].reverse()" :key="event.id">
          <span class="num">{{ formatClock(new Date(event.at)) }}</span>
          {{ EVENT_LABELS[event.type] ?? event.type }}
        </li>
      </ol>

      <div v-else class="panel-body">
        <p class="muted">
          카메라 미리보기는 AI 감지를 연결한 뒤에 여기에 보여요. 프레임은 브라우저 안에서만 처리하고
          서버로 보내지 않아요.
        </p>
      </div>
    </aside>

    <!-- ⑦ 기척(재실) 감지 한 줄 -->
    <div class="detect glass fade">
      <span class="detect-icon"><AppIcon name="camera" :size="16" /></span>
      <div>
        <b v-if="session.mode === 'AI'">AI 재실 감지 · 기척 있음</b>
        <b v-else>수동 측정</b>
        <span class="muted">{{
          session.mode === 'AI' ? '감지 모델 연결 전 · 프레임 미전송' : '카메라 꺼짐'
        }}</span>
      </div>
      <span class="rec"></span>
      <span class="muted">타임랩스</span>
    </div>

    <!-- ⑧ 배경음 -->
    <div class="bgm glass fade">
      <AppIcon name="music" :size="18" class="red" />
      <div class="bgm-title">
        <b class="serif">{{ TRACKS[trackIndex] }}</b>
        <span class="muted">배경음 · {{ trackIndex + 1 }} / {{ TRACKS.length }}</span>
      </div>
      <button type="button" title="이전 곡" @click="changeTrack(-1)">
        <AppIcon name="chevL" :size="18" class="muted" />
      </button>
      <button
        type="button"
        class="bgm-play"
        :title="bgmPlaying ? '배경음 일시정지' : '배경음 재생'"
        @click="bgmPlaying = !bgmPlaying"
      >
        <AppIcon :name="bgmPlaying ? 'pause' : 'play'" :size="14" />
      </button>
      <button type="button" title="다음 곡" @click="changeTrack(1)">
        <AppIcon name="chevR" :size="18" class="muted" />
      </button>
      <span class="vbar"></span>
      <AppIcon name="volume" :size="17" class="muted" />
      <input
        v-model.number="volume"
        type="range"
        min="0"
        max="100"
        class="range"
        :style="{ '--fill': `${volume}%` }"
        aria-label="배경음 볼륨"
      />
    </div>

    <!-- ⑨ 몰입 보기 · ⑩ 출관 -->
    <div class="corner">
      <button type="button" class="tool fade" @click="enterImmersive">
        <span class="fab glass"><AppIcon name="eye" :size="20" /></span>
        <span class="tool-label glass">몰입 보기</span>
      </button>
      <button type="button" class="tool keep" @click="askEnd">
        <span class="fab end"><AppIcon name="stop" :size="20" /></span>
        <span class="tool-label glass">출관 <span class="kbd">Esc</span></span>
      </button>
    </div>

    <!-- 출관 확인 -->
    <div v-if="confirmingEnd" class="dim" @click.self="confirmingEnd = false">
      <div class="modal" role="dialog" aria-modal="true">
        <h2 class="serif">출관할까요?</h2>
        <p>
          이번 수련의 순공은 <b class="num">{{ formatDuration(focus.focusSeconds) }}</b
          >, 쌓인 내공은 <b>+{{ focus.gainedPower }}</b
          >이에요.
        </p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="confirmingEnd = false">
            계속 수련
          </button>
          <button type="button" class="btn" @click="endSession">출관</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus {
  position: fixed;
  inset: 0;
  overflow: hidden;
  min-width: 1100px;
  min-height: 680px;
}
.focus.immersive {
  cursor: none;
}
.fade {
  transition: opacity 0.6s;
}
.immersive .fade {
  opacity: 0;
  pointer-events: none;
}
.red {
  color: var(--cinnabar);
}
.vbar {
  width: 1px;
  height: 16px;
  background: var(--line);
}

/* ① 시각 */
.clock {
  position: absolute;
  left: 36px;
  top: 26px;
  color: var(--ink);
}
.clock-date {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.72;
}
.clock-time {
  font-size: 60px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -1px;
}
.clock-time span {
  margin-left: 8px;
  font-size: 20px;
  font-weight: 600;
}

/* ② 폐관 중 */
.status {
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 12px;
}
.goal {
  font-size: 13px;
}

/* ⑤ 경지 */
.realm {
  position: absolute !important;
  right: 358px;
  top: 30px;
}
.realm-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}
.realm-name {
  font-size: 23px;
  line-height: 1.1;
  color: var(--cinnabar);
}
.realm-gain {
  font-size: 11px;
  font-weight: 700;
  color: var(--jade);
}

/* ④ 타이머 */
.timer {
  position: absolute !important;
  right: 40px;
  top: 26px;
}
.timer :deep(.inner) {
  gap: 6px;
}
.timer-state {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}
.timer-state i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cinnabar);
}
.timer-state i.paused {
  background: var(--muted);
}
.timer-value {
  font-size: 57px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}
.timer-sub {
  font-size: 11px;
  color: var(--muted);
}
.timer-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}
.timer-actions button {
  display: grid;
  place-items: center;
  color: var(--ink);
}

/* ⑥ 도구 · ⑨ ⑩ 버튼 */
.tools {
  position: absolute;
  right: 52px;
  top: 372px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.fab {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--ink);
}
.tool.on .fab {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}
.tool-label {
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  box-shadow: none;
}
.corner {
  position: absolute;
  right: 40px;
  bottom: 28px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}
.fab.end {
  width: 56px;
  height: 56px;
  background: var(--cinnabar);
  color: var(--paper);
  box-shadow: 0 10px 24px -10px rgba(168, 50, 42, 0.8);
}

/* 오른쪽 패널 */
.panel {
  position: absolute;
  right: 120px;
  top: 360px;
  width: 300px;
  max-height: calc(100% - 460px);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}
.panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  font-size: 15px;
}
.panel-body {
  flex: 1;
  overflow: auto;
  padding: 0 16px 16px;
  font-size: 13px;
  line-height: 1.6;
}
dl {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 6px 10px;
}
dt {
  color: var(--muted);
}
.log {
  list-style: none;
}
.log li {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--line-2);
}
.log li span {
  color: var(--muted);
}

/* ⑦ 감지 */
.detect {
  position: absolute;
  left: 36px;
  bottom: 30px;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 0 8px;
  border-radius: 999px;
  font-size: 12px;
}
.detect div {
  display: flex;
  flex-direction: column;
}
.detect div .muted {
  font-size: 11px;
}
.detect-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--ink);
  color: var(--paper);
}
.rec {
  width: 9px;
  height: 9px;
  margin-left: 6px;
  border-radius: 50%;
  background: var(--cinnabar);
  box-shadow: 0 0 0 3px rgba(168, 50, 42, 0.2);
  animation: blink 2s infinite;
}
@keyframes blink {
  50% {
    opacity: 0.35;
  }
}

/* ⑧ 배경음 */
.bgm {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  border-radius: 999px;
}
.bgm-title {
  width: 150px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}
.bgm-title .muted {
  font-size: 11px;
}
.bgm button {
  display: grid;
  place-items: center;
}
.bgm-play {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
}
.bgm .range {
  width: 80px;
}

/* 출관 확인 */
.dim {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: rgba(28, 24, 20, 0.52);
}
.modal {
  width: 380px;
  padding: 24px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.45);
}
.modal h2 {
  font-size: 20px;
}
.modal p {
  margin-top: 10px;
  line-height: 1.6;
  color: var(--muted);
}
.modal p b {
  color: var(--ink);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
