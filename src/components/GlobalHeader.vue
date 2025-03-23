<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.svg" alt="logo" />
            <div class="title">食尚客</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <!-- 用户信息展示栏 -->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="userInfoStore.userInfo.id !== ''">
            <a-dropdown>
              <a-space>
                <a-avatar :src="userInfoStore.userInfo.avatar" />
                {{ userInfoStore.userInfo.username }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="router.push('/user/info')"> 个人信息</a-menu-item>
                  <a-menu-item @click="showConfirm">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'
import {  logout1 } from '@/api/userController.ts'

const userInfoStore = useUserInfoStore()

// 未经过滤的菜单项
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/monitor',
    icon: () => h(HomeOutlined),
    label: '监控',
    title: '监控',
  },
  {
    key: '/admin',
    icon: () => h(HomeOutlined),
    label: '管理员',
    title: '管理员',
    children: [
      {
        key: '/admin',
        label: '控制台',
        title: '控制台',
      },
      {
        key: '/admin/merchant',
        label: '店铺管理',
        title: '店铺管理',
      },
      {
        key: '/admin/order',
        label: '订单管理',
        title: '订单管理',
      },
      {
        key: '/admin/user',
        label: '用户管理',
        title: '用户管理',
      }
    ]
  },
  {
    key: '/merchant',
    icon: () => h(HomeOutlined),
    label: '我的店铺',
    title: '我的店铺',
    children: [
      {
        key: '/merchant',
        label: '店铺主页',
        title: '店铺主页',
      },
      {
        key: '/merchant/order',
        label: '订单管理',
        title: '订单管理',
      }
    ]
  },
]

// 根据权限过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 管理员才能看到 /admin 开头的菜单
    if (typeof menu?.key === 'string' && menu.key.startsWith('/admin')) {
      const userInfo = userInfoStore.userInfo
      if (!userInfo || userInfo.role !== 'ADMIN') {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed(() => filterMenus(originItems))

const router = useRouter()
// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: never) => {
  router.push({
    path: key,
  })
}

// 确认框
const showConfirm = () => {
  Modal.confirm({
    title: '确定要退出登录吗?',
    content: '退出后将无法继续使用',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      const res = await logout1()
      if (res.data.code === 1) {
        await userInfoStore.initUserInfo()
        message.success('退出登录成功')
        await router.push('/login')
      } else {
        message.error('退出登录失败，' + res.data.msg)
      }
    },
    onCancel() {
      console.log('Cancel')
    },
  })
}
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
