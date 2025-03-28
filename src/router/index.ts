import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/user/Login.vue'
import Register from '@/pages/user/Register.vue'
import UserInfo from '@/pages/user/Info.vue'
import Home from '@/components/Home.vue'
import Monitor from '@/components/Monitor.vue'
import Admin from '@/pages/admin/Index.vue'
import Merchant from '@/pages/merchant/Index.vue'
import MerchantDetail from '@/pages/merchant/Detail.vue'
import Menu from '@/pages/merchant/Menu.vue'
import AdminMerchant from '@/pages/admin/Merchant.vue'
import AdminMerchantDetail from '@/pages/admin/MerchantDetail.vue'
import AdminUser from '@/pages/admin/User.vue'
import MerchantOrder from '@/pages/merchant/Order.vue'
import AdminOrder from '@/pages/admin/Order.vue'
import APITest from '@/components/APITest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/testapi',
      name: 'testapi',
      component: APITest,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: Monitor,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
    {
      path: '/admin/merchant',
      name: 'adminMerchant',
      component: AdminMerchant,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/merchant/:id',
      name: 'adminMerchantDetail',
      component: AdminMerchantDetail,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/user',
      name: 'adminUser',
      component: AdminUser,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/order',
      name: 'adminOrder',
      component: AdminOrder,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/user/info',
      name: 'userinfo',
      component: UserInfo,
      meta: { requiresAuth: true },
    },
    {
      path: '/merchant',
      name: 'merchant',
      component: Merchant,
    },
    {
      path: '/merchant/:id',
      name: 'merchantDetail',
      component: MerchantDetail,
    },
    {
      path: '/merchant/order',
      name: 'merchantOrder',
      component: MerchantOrder,
      meta: { requiresAuth: true },
    },
    {
      path: '/menu/:id',
      name: 'menu',
      component: Menu,
    },
  ],
})

export default router
