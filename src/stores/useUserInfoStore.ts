import { ref } from 'vue'
import { defineStore } from 'pinia'
import { current } from '@/api/userController.ts'

/**
 * 存储登录用户信息的状态
 */
export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref(<API.UserVO>{})

    // 异步函数，用于初始化用户信息
    async function initUserInfo() {
      // 将用户信息初始化为一个空对象
      userInfo.value = {
        id: '', // 用户ID
        username: '', // 用户名
        nickname: '', // 昵称
        avatar: '', // 头像
        email: '', // 邮箱
        phone: '', // 电话
        role: '', // 角色代码
        lastLoginTime: '', // 最后登录时间
        createdAt: '', // 创建时间
      }
    }

    async function fetchUserInfo() {
      const res = await current()
      if (res.data.code === 1 && res.data.data) {
        userInfo.value = res.data.data
      }
    }

    async function setUserInfo(user: API.UserVO) {
      userInfo.value = user
    }

    // 返回
    return { userInfo, fetchUserInfo, initUserInfo, setUserInfo }
  },
  {
    persist: true,
  },
)
