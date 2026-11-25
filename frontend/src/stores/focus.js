import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * 폐관 수련(집중 세션) 상태
 * - PC05 폐관 준비에서 고른 설정(setup)을 PC06 폐관 수련 화면으로 넘겨줘요.
 * - 순공 계산 규칙은 백엔드 명세(docs/backend/02-focus-session.md)와 같아요: 순공 = FOCUS 였던 시간의 합.
 *
 * TODO(API 연결): start → POST /api/sessions, 상태 변경 → POST /api/sessions/{id}/events,
 *                 end → POST /api/sessions/{id}/end. 지금은 백엔드가 없어서 브라우저 안에서만 계산해요.
 */

// 수련 계획 목업 (M06 계획 API가 생기면 교체)
export const PLANS = [
  {
    id: 318,
    time: '14:00–15:00',
    subjectId: 1,
    goal: '정규화 개념 정리 (1NF~BCNF)',
    minutes: 60,
  },
  {
    id: 319,
    time: '16:00–17:30',
    subjectId: 2,
    goal: '그래프 탐색 문제 3개 풀기',
    minutes: 90,
  },
]

export const PLACES = [
  { id: 'bamboo', name: '죽림 절벽', unlock: null },
  { id: 'snow', name: '설산', unlock: '일류' },
  { id: 'falls', name: '폭포', unlock: '절정' },
  { id: 'inn', name: '객잔', unlock: '초절정' },
]

export const TRACKS = ['죽림 빗소리', '계곡 물소리', '산사 풍경 소리', '모닥불']

// 내공 · 경지 (M12) — 순공 1분 = 내공 1
export const REALMS = [
  { name: '삼류', min: 0 },
  { name: '이류', min: 1000 },
  { name: '일류', min: 3000 },
  { name: '절정', min: 8000 },
  { name: '초절정', min: 15000 },
]

const DEFAULT_MINUTES = 60
const TODAY_FOCUS_BEFORE = 2 * 3600 + 14 * 60 + 30 // 오늘 앞선 세션 순공 (목업)
const USER_INNER_POWER = 1380 // 현재 내공 (목업)

export const useFocusStore = defineStore('focus', () => {
  /* ---------- PC05 에서 고르는 설정 ---------- */
  const setup = reactive({
    planId: 318,
    subjectId: 1,
    goal: PLANS[0].goal,
    tags: ['정처기'],
    mode: 'AI', // AI | MANUAL
    placeId: 'bamboo',
    bgmOn: true,
    track: TRACKS[0],
    volume: 60,
    timelapseOn: true,
    timelapseInterval: 10,
  })

  function applyPlan(planId) {
    setup.planId = planId
    const plan = PLANS.find((p) => p.id === planId)
    if (plan) {
      setup.subjectId = plan.subjectId
      setup.goal = plan.goal
    }
  }

  /* ---------- PC06 진행 중인 세션 ---------- */
  const session = ref(null)
  const now = ref(Date.now())
  let ticker = null

  function startTicker() {
    clearInterval(ticker)
    ticker = setInterval(() => (now.value = Date.now()), 250)
  }

  function logEvent(type) {
    session.value.events.push({ id: crypto.randomUUID(), type, at: Date.now() })
  }

  /** 입관: 세션을 만들고 id 를 돌려줘요 */
  function start() {
    const plan = PLANS.find((p) => p.id === setup.planId)
    const startedAt = Date.now()
    session.value = {
      id: String(Math.floor(startedAt / 1000) % 100000),
      mode: setup.mode,
      subjectId: setup.subjectId,
      goal: setup.goal || '자유 수련',
      track: setup.track,
      bgmOn: setup.bgmOn,
      volume: setup.volume,
      startedAt,
      plannedSeconds: (plan?.minutes ?? DEFAULT_MINUTES) * 60,
      state: 'FOCUS', // FOCUS | PAUSED (AWAY · UNKNOWN 은 AI 감지 연결 후)
      focusMsBefore: 0, // 이전 FOCUS 구간들의 합
      focusSince: startedAt, // 현재 FOCUS 구간 시작 시각
      events: [],
    }
    logEvent('START')
    startTicker()
    return session.value.id
  }

  /** 주소로 바로 들어왔는데 세션이 없으면 (새로고침 등) 데모 세션을 만들어요 */
  function ensureSession(id) {
    if (session.value?.id === id) {
      if (!ticker) startTicker()
      return
    }
    start()
    session.value.id = id
  }

  function pause() {
    const s = session.value
    if (!s || s.state !== 'FOCUS') return
    s.focusMsBefore += Date.now() - s.focusSince
    s.focusSince = null
    s.state = 'PAUSED'
    logEvent('PAUSE')
  }

  function resume() {
    const s = session.value
    if (!s || s.state === 'FOCUS') return
    s.focusSince = Date.now()
    s.state = 'FOCUS'
    logEvent('FOCUS')
  }

  /** 출관: 확정 순공(초)을 돌려주고 세션을 정리해요 */
  function end() {
    const seconds = focusSeconds.value
    clearInterval(ticker)
    ticker = null
    session.value = null
    return seconds
  }

  const focusSeconds = computed(() => {
    const s = session.value
    if (!s) return 0
    const running = s.state === 'FOCUS' ? now.value - s.focusSince : 0
    return Math.floor((s.focusMsBefore + running) / 1000)
  })

  /** 계획 시간 대비 경과 비율 (해의 위치·향 길이) */
  const elapsedRatio = computed(() => {
    const s = session.value
    if (!s) return 0
    return Math.min((now.value - s.startedAt) / 1000 / s.plannedSeconds, 1)
  })

  const todayFocusSeconds = computed(() => TODAY_FOCUS_BEFORE + focusSeconds.value)
  const gainedPower = computed(() => Math.floor(focusSeconds.value / 60))

  const realm = computed(() => {
    const power = USER_INNER_POWER + gainedPower.value
    const index = REALMS.findLastIndex((r) => power >= r.min)
    const current = REALMS[index]
    const next = REALMS[index + 1]
    return {
      name: current.name,
      progress: next ? (power - current.min) / (next.min - current.min) : 1,
    }
  })

  return {
    setup,
    applyPlan,
    session,
    now,
    start,
    ensureSession,
    pause,
    resume,
    end,
    focusSeconds,
    elapsedRatio,
    todayFocusSeconds,
    gainedPower,
    realm,
  }
})
