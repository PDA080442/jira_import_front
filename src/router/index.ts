import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/auth/login',
      name: 'auth-login',
      component: () => import('@/views/auth/LoginPage.vue'),
    },
    {
      path: '/auth/register',
      name: 'auth-register',
      component: () => import('@/views/auth/RegisterPage.vue'),
    },
    {
      path: '/auth/forgot-password',
      name: 'auth-forgot-password',
      component: () => import('@/views/auth/ForgotPasswordPage.vue'),
    },
    {
      path: '/auth/reset-password',
      name: 'auth-reset-password',
      component: () => import('@/views/auth/ResetPasswordPage.vue'),
    },
    {
      path: '/workspace/select',
      name: 'workspace-select',
      component: () => import('@/views/workspace/WorkspaceSelectView.vue'),
    },
  ],
})

export default router
