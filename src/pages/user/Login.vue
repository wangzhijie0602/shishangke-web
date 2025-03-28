<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLogin } from '@/api/userController'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'

const router = useRouter()
const userInfoStore = useUserInfoStore()

// 表单数据
const formState = reactive({
  username: '',
  password: '',
})

// 登录按钮加载状态
const loading = ref(false)

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 处理登录
const handleLogin = async () => {
  loading.value = true
  try {
    // 构建登录请求参数
    const loginParams = {
      remember: false
    }
    const loginBody = {
      username: formState.username,
      password: formState.password,
    }

    const res = await userLogin(loginParams, loginBody)
    if (res.data.code === 20000) {
      message.success('登录成功')
      // 更新用户信息到 store
      await userInfoStore.fetchUserInfo()
      // 跳转到主页或者重定向的页面
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/'
      await router.push(redirectPath)
    } else {
      message.error(res.data.msg || '登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('登录异常', error)
    message.error('登录异常，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div id="LoginPage" class="login-container">
    <div class="login-box">
      <h1 class="login-title">用户登录</h1>
      <a-form :model="formState" :rules="rules" class="login-form" @finish="handleLogin">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="login-actions">
        <a href="javascript:;">忘记密码？</a>
        <router-link to="/register">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  width: 368px;
  padding: 32px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.login-title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  margin-bottom: 16px;
}

.login-button {
  width: 100%;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
</style>
