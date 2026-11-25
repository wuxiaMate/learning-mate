<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: { type: String, required: true },
  crumbs: { type: Array, default: () => [] },
})
</script>

<template>
  <header class="top">
    <div>
      <div v-if="crumbs.length" class="crumbs">
        <template v-for="(crumb, i) in crumbs" :key="crumb">
          <AppIcon v-if="i" name="chevR" :size="12" />
          <span>{{ crumb }}</span>
        </template>
      </div>
      <h1 class="serif">{{ title }}</h1>
    </div>
    <div class="right"><slot /></div>
  </header>
</template>

<style scoped>
.top {
  height: 68px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 32px;
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.crumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
}
h1 {
  margin-top: 1px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.4px;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
