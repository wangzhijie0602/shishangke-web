<template>
  <div class="userInfo">
    <h1>个人详情</h1>
    <div v-if="userInfo">
      <p><strong>用户名:</strong> {{ userInfo.username }}</p>
      <p><strong>昵称:</strong> {{ userInfo.nickname }}</p>
      <p>
        <strong>头像:</strong>
        <span class="avatar-container">
          <img :src="userInfo.avatar" alt="头像" style="max-width: 100px" />
          <div class="avatar-edit" @click="editAvatar">
            <input
              type="file"
              accept="image/*"
              style="display: none"
              ref="avatarInput"
              @change="uploadAvatar"
            />
            修改头像
          </div>
        </span>
      </p>
      <p><strong>邮箱:</strong> {{ userInfo.email }}</p>
      <p><strong>电话:</strong> {{ userInfo.phone }}</p>
      <p><strong>状态:</strong> {{ userInfo.status }}</p>
      <p><strong>角色代码:</strong> {{ userInfo.role }}</p>
      <p><strong>上次登录时间:</strong> {{ formatTime(userInfo.lastLoginTime) }}</p>
      <p><strong>创建时间:</strong> {{ formatTime(userInfo.createdAt) }}</p>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { current } from '@/api/userController'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'
import dayjs from 'dayjs'

const userInfoStore = useUserInfoStore()
const userInfo = ref(userInfoStore.userInfo)
const newAvatar = ref<File | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)

const formatTime = (time: string | undefined) => {
  if (!time) {
    return ''
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const uploadAvatar = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newAvatar.value = target.files[0]
    console.log('Selected new avatar:', newAvatar.value)
    // TODO: 上传头像的逻辑
  }
}

const editAvatar = () => {
  avatarInput.value?.click()
}

onMounted(async () => {
  try {
    const res = await current()
    if (res.data.data) {
      await userInfoStore.setUserInfo(res.data.data)
      userInfo.value = res.data.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<style scoped>
.userInfo {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 20px;
}

.userInfo h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.userInfo p {
  margin-bottom: 10px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-edit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

.avatar-container:hover .avatar-edit {
  opacity: 1;
}
</style>
