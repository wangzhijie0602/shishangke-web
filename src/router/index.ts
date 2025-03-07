import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import UserInfoPage from '@/pages/UserInfoPage.vue'
import HomePage from '@/pages/HomePage.vue'
import MonitorPage from '@/pages/MonitorPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: MonitorPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
    {
      path: '/user/info',
      name: 'userinfo',
      component: UserInfoPage,
      meta: { requiresAuth: true },
    },
  ],
})

export default router
