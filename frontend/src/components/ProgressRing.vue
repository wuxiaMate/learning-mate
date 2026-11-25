<script setup>
/**
 * 원형 진행 링. 가운데 내용은 slot 으로 넣어요.
 * 사용: <ProgressRing :size="300" :progress="0.65"> ...가운데 내용... </ProgressRing>
 */
import { computed } from 'vue'

const props = defineProps({
  size: { type: Number, default: 120 },
  thickness: { type: Number, default: 6 },
  /** 0~1 */
  progress: { type: Number, default: 0 },
  color: { type: String, default: 'var(--cinnabar)' },
  track: { type: String, default: 'rgba(107, 94, 78, 0.18)' },
})

const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value * (1 - Math.min(Math.max(props.progress, 0), 1)),
)
</script>

<template>
  <div class="ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="track"
        :stroke-width="thickness"
      />
      <circle
        class="bar"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="inner"><slot /></div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}
.bar {
  transition: stroke-dashoffset 0.6s linear;
}
.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
