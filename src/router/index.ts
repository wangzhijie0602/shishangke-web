import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import UserInfoPage from '@/pages/UserInfoPage.vue'
import HomePage from '@/pages/HomePage.vue'
import MonitorPage from '@/pages/MonitorPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import MerchantPage from '@/pages/MerchantPage.vue'
import MerchantDetailPage from '@/pages/MerchantDetailPage.vue'
import MenuPage from '@/pages/MenuPage.vue'
import AdminMerchantPage from '@/pages/AdminMerchantPage.vue'
import AdminMerchantDetailPage from '@/pages/AdminMerchantDetailPage.vue'
import AdminUserPage from '@/pages/AdminUserPage.vue'
import MerchantOrderPage from '@/pages/MerchantOrderPage.vue'
import AdminOrderPage from '@/pages/AdminOrderPage.vue'

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
      path: '/admin/merchant',
      name: 'adminMerchant',
      component: AdminMerchantPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/merchant/:id',
      name: 'adminMerchantDetail',
      component: AdminMerchantDetailPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/user',
      name: 'adminUser',
      component: AdminUserPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/order',
      name: 'adminOrder',
      component: AdminOrderPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/user/info',
      name: 'userinfo',
      component: UserInfoPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/merchant',
      name: 'merchant',
      component: MerchantPage,
    },
    {
      path: '/merchant/:id',
      name: 'merchantDetail',
      component: MerchantDetailPage,
    },
    {
      path: '/merchant/order',
      name: 'merchantOrder',
      component: MerchantOrderPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/menu/:id',
      name: 'menu',
      component: MenuPage,
    },
  ],
})

export default router
