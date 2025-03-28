<template>
  <div class="user-info-container">
    <div class="user-info-card">
      <h1 class="page-title">个人信息</h1>

      <div v-if="userInfo" class="user-info-content">
        <!-- 头像部分 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <img
              :src="userInfo.avatar || '/src/assets/default-avatar.jpg'"
              alt="头像"
              class="user-avatar"
            />
            <div class="avatar-edit" @click="editAvatar">
              <input
                type="file"
                accept="image/*"
                style="display: none"
                ref="avatarInput"
                @change="handleUploadAvatar"
              />
              <i class="edit-icon">✏️</i>
            </div>
          </div>
          <div class="user-name">
            <h2>{{ userInfo.nickname || userInfo.username }}</h2>
            <span class="user-role">{{ getRoleName(userInfo.role) }}</span>
          </div>
        </div>

        <!-- 基本信息部分 -->
        <div class="info-section">
          <h3 class="section-title">基本信息</h3>

          <div class="info-row">
            <div class="info-label">用户名</div>
            <div class="info-value">{{ userInfo.username }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">昵称</div>
            <div class="info-value" v-if="!editMode.nickname">
              {{ userInfo.nickname || '未设置' }}
              <button class="edit-btn" @click="startEdit('nickname')">修改</button>
            </div>
            <div class="info-edit" v-else>
              <input type="text" v-model="editForm.nickname" class="edit-input" />
              <div class="edit-actions">
                <button class="save-btn" @click="saveEdit('nickname')">保存</button>
                <button class="cancel-btn" @click="cancelEdit('nickname')">取消</button>
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">邮箱</div>
            <div class="info-value" v-if="!editMode.email">
              {{ userInfo.email || '未设置' }}
              <button class="edit-btn" @click="startEdit('email')">修改</button>
            </div>
            <div class="info-edit" v-else>
              <input type="email" v-model="editForm.email" class="edit-input" />
              <div class="edit-actions">
                <button class="save-btn" @click="saveEdit('email')">保存</button>
                <button class="cancel-btn" @click="cancelEdit('email')">取消</button>
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">电话</div>
            <div class="info-value" v-if="!editMode.phone">
              {{ userInfo.phone || '未设置' }}
              <button class="edit-btn" @click="startEdit('phone')">修改</button>
            </div>
            <div class="info-edit" v-else>
              <input type="tel" v-model="editForm.phone" class="edit-input" />
              <div class="edit-actions">
                <button class="save-btn" @click="saveEdit('phone')">保存</button>
                <button class="cancel-btn" @click="cancelEdit('phone')">取消</button>
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">密码</div>
            <div class="info-value">
              ********
              <button class="edit-btn" @click="showPasswordForm = true">修改</button>
            </div>
          </div>

          <div v-if="showPasswordForm" class="password-form">
            <div class="form-group">
              <label>旧密码</label>
              <input type="password" v-model="oldPassword" placeholder="请输入旧密码" required />
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input type="password" v-model="newPassword" placeholder="请输入新密码" required />
            </div>
            <div class="form-actions">
              <button class="save-btn" @click="submitPasswordChange">确认修改</button>
              <button class="cancel-btn" @click="showPasswordForm = false">取消</button>
            </div>
          </div>
        </div>

        <!-- 账户信息部分 -->
        <div class="info-section">
          <h3 class="section-title">账户信息</h3>

          <div class="info-row">
            <div class="info-label">账户状态</div>
            <div class="info-value">
              <span
                :class="[
                  'status-badge',
                  {
                    'status-normal': userInfo.status === 'ACTIVE',
                    'status-disabled': userInfo.status === 'DISABLED',
                    'status-locked': userInfo.status === 'LOCKED'
                  }
                ]"
              >
                {{ getStatusText(userInfo.status) }}
              </span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">上次登录时间</div>
            <div class="info-value">{{ formatTime(userInfo.lastLoginTime) }}</div>
          </div>

          <div class="info-row">
            <div class="info-label">创建时间</div>
            <div class="info-value">{{ formatTime(userInfo.createdAt) }}</div>
          </div>
        </div>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { userGetCurrent, userUpdatePassword, userUpdateAvatar1, userUpdateNickname, userUpdateEmail, userUpdatePhone } from '@/api/userController'
import { useUserInfoStore } from '@/stores/useUserInfoStore.ts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

defineOptions({
  name: 'UserInfo'
})

const userInfoStore = useUserInfoStore()
const userInfo = ref(userInfoStore.userInfo)
const newAvatar = ref<File | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)

// 密码修改相关变量
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')

// 编辑模式状态
const editMode = reactive({
  nickname: false,
  email: false,
  phone: false,
})

// 编辑表单
const editForm = reactive({
  id: '',
  nickname: '',
  email: '',
  phone: '',
})

// 获取角色名称
const getRoleName = (roleCode: string | undefined) => {
  if (!roleCode) return '未知角色'

  const roleMap: Record<string, string> = {
    ADMIN: '系统管理员',
    BOSS: '老板',
    MANAGER: '店长',
    CHEF: '厨师',
    CUSTOMER: '顾客',
    DELIVERY: '配送员'
  }

  return roleMap[roleCode] || '未知角色'
}

const formatTime = (time: string | undefined) => {
  if (!time) return '未知'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const uploadAvatarHandler = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await userUpdateAvatar1(formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    if (res.data.code === 20000) {
      message.success('头像上传成功')
      // 更新用户信息
      await refreshUserInfo()
    } else {
      message.error(res.data.msg || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    message.error('头像上传失败，请重试')
  }
}

const handleUploadAvatar = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    newAvatar.value = target.files[0]
    uploadAvatarHandler(newAvatar.value!)
  }
}

const editAvatar = () => {
  avatarInput.value?.click()
}

const submitPasswordChange = async () => {
  if (!oldPassword.value || !newPassword.value) {
    message.warning('请输入完整的密码信息')
    return
  }

  try {
    const res = await userUpdatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })
    if (res.data.code === 20000) {
      showPasswordForm.value = false
      oldPassword.value = ''
      newPassword.value = ''
      message.success('密码修改成功')
    } else {
      message.error(res.data.msg || '密码修改失败')
    }
  } catch (error) {
    console.error('密码修改失败:', error)
    message.error('密码修改失败，请确认旧密码是否正确')
  }
}

// 开始编辑某个字段
const startEdit = (field: keyof typeof editMode) => {
  // 重置其他字段的编辑状态
  Object.keys(editMode).forEach((key) => {
    if (key !== field) {
      editMode[key as keyof typeof editMode] = false
    }
  })
  // 设置当前字段为编辑状态
  editMode[field] = true
  // 设置编辑表单的值
  editForm[field] = userInfo.value?.[field] || ''
}

// 取消编辑
const cancelEdit = (field: keyof typeof editMode) => {
  editMode[field] = false
  editForm[field] = ''
}

// 保存编辑
const saveEdit = async (field: keyof typeof editMode) => {
  try {
    let res
    switch (field) {
      case 'nickname':
        res = await userUpdateNickname({ nickname: editForm.nickname })
        break
      case 'email':
        res = await userUpdateEmail({ email: editForm.email })
        break
      case 'phone':
        res = await userUpdatePhone({ phone: editForm.phone })
        break
    }
    if (res?.data.code === 20000) {
      message.success(`${field} 更新成功`)
      editMode[field] = false
      // 更新用户信息
      await refreshUserInfo()
    } else {
      message.error(res?.data.msg || `${field} 更新失败`)
    }
  } catch (error) {
    console.error(`${field} 更新失败:`, error)
    message.error(`${field} 更新失败，请重试`)
  }
}

// 刷新用户信息
const refreshUserInfo = async () => {
  try {
    const res = await userGetCurrent()
    if (res.data.code === 20000 && res.data.data) {
      userInfo.value = res.data.data
      userInfoStore.setUserInfo(res.data.data)
    } else {
      message.error(res.data.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.error('获取用户信息失败，请重试')
  }
}

// 在 script setup 部分添加 getStatusText 函数
const getStatusText = (status: string | undefined) => {
  if (!status) return '未知'

  const statusMap: Record<string, string> = {
    ACTIVE: '正常',
    DISABLED: '已禁用',
    LOCKED: '已锁定'
  }

  return statusMap[status] || '未知'
}

// 页面加载时获取用户信息
onMounted(async () => {
  await refreshUserInfo()
})
</script>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.user-info-card {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
}

.user-info-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 头像部分样式 */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}

.edit-icon {
  font-size: 24px;
  color: white;
}

.avatar-container:hover .avatar-edit {
  opacity: 1;
}

.user-name {
  display: flex;
  flex-direction: column;
}

.user-name h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
}

.user-role {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

/* 信息部分样式 */
.info-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: #666;
}

.info-value {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  background-color: transparent;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.edit-btn:hover {
  text-decoration: underline;
}

.info-edit {
  flex: 1;
  display: flex;
  gap: 10px;
}

.edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.save-btn,
.cancel-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.save-btn {
  background-color: #1890ff;
  color: white;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #666;
}

/* 密码表单样式 */
.password-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

/* 状态标签样式 */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-normal {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-disabled {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}

.status-locked {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

/* 加载中样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
