<script setup>
defineProps({
  size: { type: Number, default: 17 },
})
</script>

<template>
  <div class="logo serif" :style="{ fontSize: `${size}px` }">
    <i>修</i>
    LearningMate
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.logo i {
  width: 1.76em;
  height: 1.76em;
  border-radius: 4px;
  display: grid;
  place-items: center;
  background: var(--cinnabar);
  color: var(--paper);
  font-style: normal;
  font-size: 0.94em;
  font-weight: 900;
  box-shadow:
    0 0 0 2px var(--cinnabar),
    inset 0 0 0 1.5px var(--paper);
}
</style>
