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
          <template v-if="userInfoStore.userInfo.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="userInfoStore.userInfo.avatar" />
                <span class="username">{{ userInfoStore.userInfo.nickname || userInfoStore.userInfo.username }}</span>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="router.push('/user/info')">
                    <UserOutlined />
                    个人信息
                  </a-menu-item>
                  <a-menu-item @click="showConfirm">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <a-space>
              <a-button type="primary" href="/login">登录</a-button>
              <a-button href="/register">注册</a-button>
            </a-space>
          </template>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined, UserOutlined, ShopOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/useUserInfoStore'

const userInfoStore = useUserInfoStore()
const router = useRouter()

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
    icon: () => h(DashboardOutlined),
    label: '监控',
    title: '监控',
  },
  {
    key: '/admin',
    icon: () => h(DashboardOutlined),
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
    icon: () => h(ShopOutlined),
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
    if (!menu) return false

    // 管理员才能看到 /admin 开头的菜单
    if (typeof menu.key === 'string' && menu.key.startsWith('/admin')) {
      return userInfoStore.userInfo.role === 'ADMIN'
    }

    return true
  })
}

// 展示在菜单的路由数组
const items = computed(() => filterMenus(originItems))

// 当前要高亮的菜单项
const current = ref<string[]>([])

// 监听路由变化，更新高亮菜单项
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 确认框
const showConfirm = () => {
  Modal.confirm({
    title: '确定要退出登录吗?',
    content: '退出后将无法继续使用',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        await userInfoStore.logout()
        message.success('退出登录成功')
        await router.push('/login')
      } catch (error) {
        console.error(error)
        message.error('退出登录失败，请重试')
      }
    },
  })
}
</script>

<style scoped>
#globalHeader {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
}

.title-bar {
  display: flex;
  align-items: center;
  height: 64px;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
  font-weight: bold;
}

.logo {
  height: 48px;
}

.user-login-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 64px;
}

.username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.ant-menu) {
  border-bottom: none;
}

:deep(.ant-menu-item) {
  padding: 0 20px;
}

:deep(.ant-space) {
  gap: 8px !important;
}
</style>
