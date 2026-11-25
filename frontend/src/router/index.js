import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // PC01 강호 입문 (소셜 로그인) — 사이드바 없음
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    // 사이드바가 있는 화면들
    {
      path: '/',
      component: AppLayout,
      children: [
        // 첫 화면은 로그인(PC01)
        { path: '', redirect: { name: 'login' } },
        // PC05 폐관 준비
        {
          path: 'focus/new',
          name: 'focus-new',
          component: () => import('@/views/FocusSetupView.vue'),
        },
      ],
    },
    // PC06 폐관 수련 (몰입 화면) — 사이드바 없이 전체 화면
    {
      path: '/focus/:sessionId',
      name: 'focus-session',
      component: () => import('@/views/FocusSessionView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
