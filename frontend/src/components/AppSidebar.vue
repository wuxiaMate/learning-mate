<script setup>
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'
import AppLogo from './AppLogo.vue'

// to 가 없는 메뉴는 아직 만들지 않은 화면이에요
const SECTIONS = [
  {
    title: '수련',
    items: [
      { label: '수련장', icon: 'home' },
      { label: '수련 계획', icon: 'calendar' },
      { label: '폐관 수련', icon: 'timer', to: { name: 'focus-new' } },
      { label: '수련록', icon: 'chart' },
    ],
  },
  { title: '강호', items: [{ label: '문파', icon: 'users', count: 2 }] },
  {
    title: '무인',
    items: [
      { label: '무인 성장', icon: 'gift' },
      { label: '설정', icon: 'settings' },
    ],
  },
]

// TODO(API 연결): GET /api/auth/me 로 교체
const me = { nickname: '김싸피', initial: 'A', title: '이류 고수', power: 1380 }
</script>

<template>
  <aside class="side">
    <AppLogo class="side-logo" />

    <nav>
      <template v-for="section in SECTIONS" :key="section.title">
        <div class="sec">{{ section.title }}</div>
        <template v-for="item in section.items" :key="item.label">
          <RouterLink v-if="item.to" :to="item.to" class="item" active-class="on">
            <AppIcon :name="item.icon" />
            {{ item.label }}
          </RouterLink>
          <span v-else class="item soon" title="준비 중인 화면이에요">
            <AppIcon :name="item.icon" />
            {{ item.label }}
            <span v-if="item.count" class="count">{{ item.count }}</span>
          </span>
        </template>
      </template>
    </nav>

    <div class="me">
      <span class="avatar">{{ me.initial }}</span>
      <div class="me-text">
        <b>{{ me.nickname }}</b>
        <span
          ><b class="gold">{{ me.title }}</b> · 내공 {{ me.power.toLocaleString() }}</span
        >
      </div>
      <RouterLink :to="{ name: 'login' }" class="logout" title="로그아웃">
        <AppIcon name="logout" :size="16" />
      </RouterLink>
    </div>
  </aside>
</template>

<style scoped>
.side {
  width: 232px;
  flex: none;
  display: flex;
  flex-direction: column;
  padding: 20px 14px 14px;
  background: var(--ink);
  color: #fff;
}
.side-logo {
  padding: 0 8px;
  margin-bottom: 22px;
}
nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sec {
  padding: 16px 12px 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #857865;
}
.item {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 14px;
  color: #bfb3a0;
  transition: background 0.15s;
}
a.item:hover {
  background: var(--ink-2);
}
.item.on {
  background: var(--jade);
  color: #fff;
  font-weight: 700;
}
.item.soon {
  cursor: default;
}
.count {
  margin-left: auto;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: var(--ink-2);
}
.me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px 2px;
  border-top: 1px solid var(--ink-2);
}
.avatar {
  width: 32px;
  height: 32px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1.5px solid #fff;
  background: var(--ink-2);
  font-size: 12px;
  font-weight: 800;
}
.me-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.me-text span {
  font-size: 11px;
  color: #bfb3a0;
}
.gold {
  color: var(--gold);
}
.logout {
  color: #857865;
}
.logout:hover {
  color: #fff;
}
</style>
