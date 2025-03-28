<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
import { userRegister } from '@/api/userController'

const router = useRouter()

// 表单数据
const formState = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 注册按钮加载状态
const loading = ref(false)

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名至少4个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string) => {
        if (value === formState.password) {
          return Promise.resolve()
        }
        return Promise.reject('两次输入的密码不一致')
      },
      trigger: 'blur',
    },
  ],
}

// 处理注册
const handleRegister = async () => {
  loading.value = true
  try {
    // 构建注册请求数据
    const registerData = {
      username: formState.username,
      password: formState.password,
    }

    const res = await userRegister(registerData)
    if (res.data.code === 20000) {
      message.success('注册成功，请登录')
      // 跳转到登录页
      await router.push('/login')
    } else {
      message.error(res.data.msg || '注册失败，请稍后重试')
    }
  } catch (error) {
    console.error('注册异常', error)
    message.error('注册异常，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div id="RegisterPage" class="register-container">
    <div class="register-box">
      <h1 class="register-title">用户注册</h1>
      <a-form :model="formState" :rules="rules" class="register-form" @finish="handleRegister">
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

        <a-form-item name="confirmPassword">
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            placeholder="请确认密码"
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
            class="register-button"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>
      <div class="register-actions">
        <span>已有账号？</span>
        <a @click="goToLogin">立即登录</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-box {
  width: 400px;
  padding: 32px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.register-title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
  margin-bottom: 16px;
}

.register-button {
  width: 100%;
}

.register-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.register-actions a {
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
}
</style>
