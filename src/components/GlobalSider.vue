<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.userInfo.id"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'

const loginUserStore = useUserInfoStore()

// 固定的菜单列表
const fixedMenuItems = [
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const menuItems = computed(() => {
  return fixedMenuItems
})

const router = useRouter()
// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: never }) => {
  router.push(key as string)
}
</script>

<style scoped></style>
