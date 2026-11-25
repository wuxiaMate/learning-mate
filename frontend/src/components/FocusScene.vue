<script setup>
/**
 * 폐관 수련 장면 — 수묵 산수 + 좌선하는 무인 (와이어프레임 v0.3 scene.mjs 를 Vue 로 옮긴 것)
 * 시간의 흐름을 세 가지로 보여줘요.
 *  ① 해/달이 계획 시간대의 호(arc)를 따라 이동  (progress)
 *  ② 향(일주향)이 타들어감                      (progress)
 *  ③ 하늘색이 실제 시각을 따라 변함               (hour)
 * 부모 요소를 꽉 채우므로, 부모에 position 과 크기를 줘야 해요.
 */
import { computed } from 'vue'

const props = defineProps({
  /** 계획 시간 대비 경과 비율 0~1 */
  progress: { type: Number, default: 0.65 },
  /** 실제 시각 0~24 (14.5 = 14시 30분) */
  hour: { type: Number, default: 14.6 },
  /** focus | pause | away | unknown | manual */
  state: { type: String, default: 'focus' },
  /** 궤적 양 끝 라벨. 예: ['14:00 입관', '15:00 출관 예정'] */
  labels: { type: Array, default: null },
})

const PALETTE = {
  dawn: {
    top: '#EBC9B4',
    bot: '#F7EDE0',
    orb: '#C9442F',
    far: '#6B5040',
    near: '#2E2420',
    mist: '#FBF3EA',
  },
  day: {
    top: '#D6E0DB',
    bot: '#F5EFE2',
    orb: '#B8342A',
    far: '#4A5A55',
    near: '#1F2622',
    mist: '#FBF8F1',
  },
  dusk: {
    top: '#E2A27C',
    bot: '#F4DEC0',
    orb: '#A8322A',
    far: '#6A4335',
    near: '#2A1C18',
    mist: '#F8E8D6',
  },
  night: {
    top: '#161B27',
    bot: '#383A47',
    orb: '#F1E7CF',
    far: '#7C8090',
    near: '#0B0D12',
    mist: '#6D7080',
  },
}

const timeOfDay = (h) => {
  if (h >= 5 && h < 8) return 'dawn'
  if (h >= 8 && h < 16.5) return 'day'
  if (h >= 16.5 && h < 19) return 'dusk'
  return 'night'
}

const p = computed(() => PALETTE[timeOfDay(props.hour)])
const night = computed(() => timeOfDay(props.hour) === 'night')
const t = computed(() => Math.min(Math.max(props.progress, 0), 1))

const skyStyle = computed(() => ({
  background: `linear-gradient(180deg, ${p.value.top} 0%, ${p.value.bot} 78%)`,
}))

// 해·달 궤적: 2차 베지어 곡선. 지나온 구간은 실선, 남은 구간은 점선
const P0 = [250, 470]
const P2 = [1190, 470]
const P1 = [(P0[0] + P2[0]) / 2, -60]
const bezier = (k) =>
  [0, 1].map((i) => (1 - k) ** 2 * P0[i] + 2 * (1 - k) * k * P1[i] + k ** 2 * P2[i])

const orb = computed(() => {
  const [x, y] = bezier(t.value)
  return { x, y }
})
const fullArc = `M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`
const passedArc = computed(() => {
  const c1 = [P0[0] + (P1[0] - P0[0]) * t.value, P0[1] + (P1[1] - P0[1]) * t.value]
  return `M ${P0[0]} ${P0[1]} Q ${c1[0]} ${c1[1]} ${orb.value.x} ${orb.value.y}`
})
const labelColor = computed(() => (night.value ? '#E6DFD0' : '#4A4036'))

const STARS = [
  [180, 90],
  [340, 160],
  [460, 70],
  [610, 120],
  [880, 80],
  [990, 150],
  [1120, 60],
  [1290, 130],
  [1370, 210],
  [80, 220],
]

// 일주향: 남은 길이 = 1 - 진행률
const INCENSE_X = 560
const INCENSE_Y = 708
const stickH = computed(() => 16 + 96 * (1 - t.value))
const stickTop = computed(() => INCENSE_Y - 40 - stickH.value)
const burning = computed(() => ['focus', 'manual', 'unknown'].includes(props.state))

const BAMBOO = [
  [118, 1.0],
  [168, 0.8],
  [212, 0.65],
]
const BAMBOO_NODES = [380, 500, 620, 740]
</script>

<template>
  <div class="scene" :style="skyStyle">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <!-- 별 (밤) -->
      <template v-if="night">
        <circle
          v-for="([x, y], i) in STARS"
          :key="i"
          :cx="x"
          :cy="y"
          :r="i % 3 ? 1.6 : 2.4"
          fill="#F1E7CF"
          fill-opacity=".8"
        />
      </template>

      <!-- 해/달 궤적 -->
      <path
        :d="fullArc"
        fill="none"
        :stroke="labelColor"
        stroke-opacity=".55"
        stroke-width="2"
        stroke-dasharray="2 12"
        stroke-linecap="round"
      />
      <path
        :d="passedArc"
        fill="none"
        :stroke="p.orb"
        stroke-opacity=".5"
        stroke-width="3"
        stroke-linecap="round"
      />
      <!-- 해 또는 달 -->
      <template v-if="night">
        <circle :cx="orb.x" :cy="orb.y" r="34" :fill="p.orb" />
        <circle :cx="orb.x + 13" :cy="orb.y - 8" r="30" :fill="p.top" fill-opacity=".9" />
      </template>
      <template v-else>
        <circle :cx="orb.x" :cy="orb.y" r="58" :fill="p.orb" fill-opacity=".14" />
        <circle
          :cx="orb.x"
          :cy="orb.y"
          r="36"
          :fill="p.orb"
          :fill-opacity="state === 'away' || state === 'pause' ? 0.55 : 0.92"
        />
      </template>

      <!-- 새 -->
      <g
        v-if="!night && state !== 'pause'"
        fill="none"
        :stroke="p.near"
        stroke-opacity=".55"
        stroke-width="2.2"
        stroke-linecap="round"
      >
        <path d="M 980 205 q 9 -8 18 0 q 9 -8 18 0" />
        <path d="M 1030 180 q 7 -6 14 0 q 7 -6 14 0" />
        <path d="M 1010 232 q 6 -5 12 0 q 6 -5 12 0" />
      </g>

      <!-- 원경 산 · 안개 -->
      <path
        d="M 0 520 L 90 430 L 160 470 L 260 360 L 360 450 L 430 410 L 520 500 L 640 420 L 760 470 L 880 380 L 980 450 L 1100 340 L 1200 420 L 1300 380 L 1440 470 L 1440 900 L 0 900 Z"
        :fill="p.far"
        fill-opacity=".2"
      />
      <ellipse cx="420" cy="540" rx="520" ry="46" :fill="p.mist" fill-opacity=".7" />
      <ellipse cx="1120" cy="520" rx="460" ry="40" :fill="p.mist" fill-opacity=".6" />
      <path
        d="M 0 610 C 120 560 220 520 330 560 C 420 590 470 540 560 520 C 660 500 700 580 800 570 C 900 560 960 500 1080 350 L 1110 352 C 1160 420 1220 480 1300 500 C 1360 515 1400 540 1440 560 L 1440 900 L 0 900 Z"
        :fill="p.far"
        fill-opacity=".38"
      />

      <!-- 원경 정자 -->
      <g :fill="p.far" fill-opacity=".55">
        <path d="M 1068 318 l 34 -16 l 34 16 z" />
        <rect x="1080" y="318" width="44" height="4" />
        <rect x="1084" y="322" width="4" height="20" />
        <rect x="1116" y="322" width="4" height="20" />
        <rect x="1076" y="341" width="52" height="5" />
      </g>

      <ellipse cx="760" cy="640" rx="620" ry="52" :fill="p.mist" fill-opacity=".75" />

      <!-- 근경 바위 -->
      <path
        d="M 0 900 L 0 700 C 60 690 120 720 190 700 L 260 900 Z"
        :fill="p.near"
        fill-opacity=".85"
      />
      <path
        d="M 430 900 C 470 800 520 748 600 734 C 680 722 780 722 860 736 C 940 750 990 800 1030 900 Z"
        :fill="p.near"
        fill-opacity=".82"
      />
      <path
        d="M 1440 900 L 1440 580 C 1380 600 1330 660 1290 720 C 1250 790 1190 830 1120 900 Z"
        :fill="p.near"
        fill-opacity=".9"
      />

      <!-- 대나무 (왼쪽) -->
      <g :stroke="p.near" stroke-linecap="round" fill="none">
        <template v-for="[x, o] in BAMBOO" :key="x">
          <path :d="`M ${x} 900 L ${x + 18} 260`" :stroke-width="10 * o + 4" :stroke-opacity="o" />
          <path
            v-for="y in BAMBOO_NODES"
            :key="y"
            :d="`M ${x + (900 - y) * 0.028 - 7} ${y} h 16`"
            stroke-width="3"
            :stroke="p.mist"
            stroke-opacity=".6"
          />
        </template>
        <g :fill="p.near" stroke="none" fill-opacity=".85">
          <path d="M 136 300 c 40 -10 70 -2 96 14 c -40 4 -70 2 -96 -14 z" />
          <path d="M 186 420 c 36 -14 66 -10 92 4 c -36 8 -66 8 -92 -4 z" />
          <path d="M 130 520 c -40 -8 -66 0 -88 16 c 36 2 64 0 88 -16 z" />
          <path d="M 200 600 c 34 -18 62 -16 90 -4 c -34 10 -62 12 -90 4 z" />
        </g>
      </g>

      <!-- 소나무 (오른쪽 절벽) -->
      <g :fill="p.near">
        <path
          d="M 1258 900 C 1250 780 1240 690 1270 600 C 1286 560 1300 540 1296 500"
          :stroke="p.near"
          stroke-width="14"
          fill="none"
          stroke-linecap="round"
        />
        <path
          d="M 1150 560 C 1190 530 1260 528 1320 548 C 1290 566 1210 576 1150 560 Z"
          fill-opacity=".92"
        />
        <path
          d="M 1210 480 C 1250 456 1320 458 1380 478 C 1350 496 1270 500 1210 480 Z"
          fill-opacity=".92"
        />
        <path
          d="M 1100 640 C 1140 614 1200 616 1250 632 C 1220 650 1150 656 1100 640 Z"
          fill-opacity=".85"
        />
      </g>

      <!-- 방석 + 검 (자리 이탈이어도 남아요) -->
      <ellipse
        cx="720"
        cy="722"
        rx="124"
        ry="16"
        fill="#A8322A"
        :fill-opacity="state === 'away' ? 0.75 : 0.55"
      />
      <g transform="rotate(-6 870 728)">
        <rect x="820" y="724" width="190" height="7" rx="3" :fill="p.near" />
        <rect x="806" y="718" width="10" height="20" rx="2" fill="#C9A15B" />
        <rect x="776" y="724" width="32" height="7" rx="3" fill="#A8322A" />
      </g>

      <!-- 일주향 -->
      <g>
        <rect :x="INCENSE_X - 3" :y="stickTop" width="6" :height="stickH" rx="2" fill="#8A5A3C" />
        <circle :cx="INCENSE_X" :cy="stickTop" r="5" :fill="burning ? '#E2553D' : '#9C9284'" />
        <path
          v-if="burning"
          class="smoke"
          :d="`M ${INCENSE_X} ${stickTop - 6} c -14 -26 16 -40 2 -70 c -10 -22 14 -34 6 -60`"
          fill="none"
          :stroke="night ? '#E8E2D6' : '#7A7068'"
          stroke-opacity=".45"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          :d="`M ${INCENSE_X - 34} ${INCENSE_Y - 40} h 68 l -8 36 h -52 z`"
          :fill="p.near"
          fill-opacity=".88"
        />
        <rect :x="INCENSE_X - 40" :y="INCENSE_Y - 46" width="80" height="9" rx="3" :fill="p.near" />
        <path
          :d="`M ${INCENSE_X - 22} ${INCENSE_Y - 4} l -6 16 M ${INCENSE_X + 22} ${INCENSE_Y - 4} l 6 16`"
          :stroke="p.near"
          stroke-width="5"
          stroke-linecap="round"
        />
      </g>

      <!-- 좌선하는 무인 (자리 이탈이면 사라져요) -->
      <g v-if="state !== 'away'" :fill="p.near">
        <path
          d="M 622 712 C 618 680 640 662 664 650 L 776 650 C 800 662 822 680 818 712 C 790 728 650 728 622 712 Z"
          fill-opacity=".94"
        />
        <path
          d="M 672 566 C 652 574 640 600 636 640 L 630 676 C 690 690 750 690 810 676 L 804 640 C 800 600 788 574 768 566 Z"
          fill-opacity=".94"
        />
        <rect x="652" y="626" width="136" height="12" rx="4" fill="#A8322A" />
        <ellipse cx="720" cy="668" rx="34" ry="13" :fill="p.mist" fill-opacity=".22" />
        <rect x="708" y="540" width="24" height="30" rx="8" fill-opacity=".94" />
        <ellipse cx="720" cy="516" rx="29" ry="33" fill-opacity=".96" />
        <ellipse cx="720" cy="476" rx="13" ry="11" fill-opacity=".96" />
        <path d="M 704 478 h 34" stroke="#C9A15B" stroke-width="3" stroke-linecap="round" />
        <path
          class="ribbon"
          d="M 732 480 C 770 470 790 500 830 488 C 856 480 870 492 896 484"
          fill="none"
          stroke="#A8322A"
          stroke-width="5"
          stroke-linecap="round"
        />
        <path
          d="M 734 486 C 764 492 780 520 812 514"
          fill="none"
          stroke="#A8322A"
          stroke-width="4"
          stroke-linecap="round"
          stroke-opacity=".85"
        />
      </g>

      <!-- 궤적 양 끝 라벨: 해(빛무리 반지름 58)와 나무를 피해 끝점 안쪽에, 안개·산보다 위에 그려요 -->
      <template v-if="labels">
        <text
          :x="P0[0] + 70"
          :y="P0[1] + 6"
          class="arc-label"
          text-anchor="start"
          :fill="labelColor"
        >
          {{ labels[0] }}
        </text>
        <text :x="P2[0] - 70" :y="P2[1] + 6" class="arc-label" text-anchor="end" :fill="labelColor">
          {{ labels[1] }}
        </text>
      </template>

      <!-- 상태별 덮개 -->
      <template v-if="state === 'unknown'">
        <ellipse cx="720" cy="600" rx="420" ry="230" :fill="p.mist" fill-opacity=".72" />
        <ellipse cx="720" cy="560" rx="260" ry="150" :fill="p.mist" fill-opacity=".6" />
      </template>
      <rect v-if="state === 'pause'" width="1440" height="900" fill="#1C1814" fill-opacity=".38" />
      <rect v-if="state === 'away'" width="1440" height="900" fill="#6B5E4E" fill-opacity=".22" />
    </svg>
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: background 2s;
}
.scene svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.arc-label {
  font-family: var(--font-sans);
  font-size: 17px;
  font-weight: 800;
}
.smoke {
  animation: drift 6s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: bottom center;
}
.ribbon {
  animation: wave 4s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: left center;
}
@keyframes drift {
  from {
    transform: skewX(-4deg);
    opacity: 0.8;
  }
  to {
    transform: skewX(5deg);
    opacity: 1;
  }
}
@keyframes wave {
  from {
    transform: rotate(-2deg);
  }
  to {
    transform: rotate(3deg);
  }
}
</style>
