import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  userGetCurrent,
  userUpdateAvatar1,
  userUpdateEmail,
  userUpdateNickname,
  userUpdatePassword,
  userUpdatePhone,
  userLogout
} from '@/api/userController.ts'

/**
 * 存储登录用户信息的状态
 */
export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref<API.UserVO>({})

    // 异步函数，用于初始化用户信息
    async function initUserInfo() {
      userInfo.value = {
        id: '',
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        phone: '',
        role: '',
        lastLoginTime: '',
        createdAt: '',
      }
    }

    // 获取当前用户信息
    async function fetchUserInfo() {
      const res = await userGetCurrent()
      if (res.data.code === 20000 && res.data.data) {
        userInfo.value = res.data.data
      }
    }

    // 设置用户信息
    async function setUserInfo(user: API.UserVO) {
      userInfo.value = user
    }

    // 更新用户头像
    async function updateAvatar(avatar: string) {
      const res = await userUpdateAvatar1({})
      if (res.data.code === 20000) {
        userInfo.value.avatar = avatar
      }
    }

    // 更新用户邮箱
    async function updateEmail(email: string) {
      const res = await userUpdateEmail({ email })
      if (res.data.code === 20000) {
        userInfo.value.email = email
      }
    }

    // 更新用户昵称
    async function updateNickname(nickname: string) {
      const res = await userUpdateNickname({ nickname })
      if (res.data.code === 20000) {
        userInfo.value.nickname = nickname
      }
    }

    // 更新用户密码
    async function updatePassword(oldPassword: string, newPassword: string) {
      const res = await userUpdatePassword({
        oldPassword,
        newPassword
      })
      return res.data.code === 20000
    }

    // 更新用户手机号
    async function updatePhone(phone: string) {
      const res = await userUpdatePhone({ phone })
      if (res.data.code === 20000) {
        userInfo.value.phone = phone
      }
    }

    // 用户登出
    async function logout() {
      const res = await userLogout()
      if (res.data.code === 20000) {
        await initUserInfo()
      }
    }

    return {
      userInfo,
      fetchUserInfo,
      initUserInfo,
      setUserInfo,
      updateAvatar,
      updateEmail,
      updateNickname,
      updatePassword,
      updatePhone,
      logout
    }
  },
  {
    persist: true,
  },
)
