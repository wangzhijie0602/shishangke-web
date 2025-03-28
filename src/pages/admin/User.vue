<template>
  <a-card title="用户管理" :bordered="false" class="user-page">
    <!-- 搜索表单 -->
    <div class="search-wrapper">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="16" style="width: 100%">
          <a-col :span="18">
            <a-space wrap>
              <a-form-item label="用户名" name="username">
                <a-input v-model:value="searchForm.username" placeholder="请输入用户名" allow-clear style="width: 180px" />
              </a-form-item>
              <a-form-item label="昵称" name="nickname">
                <a-input v-model:value="searchForm.nickname" placeholder="请输入昵称" allow-clear style="width: 180px" />
              </a-form-item>
              <a-form-item label="手机号" name="phone">
                <a-input v-model:value="searchForm.phone" placeholder="请输入手机号" allow-clear style="width: 180px" />
              </a-form-item>
              <a-form-item label="状态" name="status">
                <a-select
                  v-model:value="searchForm.status"
                  placeholder="请选择状态"
                  allow-clear
                  style="width: 180px"
                >
                  <a-select-option value="ACTIVE">正常</a-select-option>
                  <a-select-option value="DISABLED">已禁用</a-select-option>
                  <a-select-option value="LOCKED">已锁定</a-select-option>
                </a-select>
              </a-form-item>
            </a-space>
          </a-col>
          <a-col :span="6" class="action-buttons">
            <a-space>
              <a-button type="primary" @click="handleSearch" :loading="searchLoading">
                <template #icon>
                  <search-outlined />
                </template>
                搜索
              </a-button>
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="showCreateModal">
                <template #icon>
                  <plus-outlined />
                </template>
                添加用户
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 用户列表 -->
    <a-table
      :columns="columns"
      :data-source="userListData"
      :row-key="(record: any) => record.id"
      :loading="loading"
      :pagination="false"
      size="middle"
      class="user-table"
      :scroll="{ x: 1000 }"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <div class="avatar-container">
            <img v-if="record.avatar" :src="record.avatar" alt="用户头像" />
            <a-avatar v-else shape="circle" :size="40" class="default-avatar">
              {{ record.username ? record.username.charAt(0).toUpperCase() : '?' }}
            </a-avatar>
          </div>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusName(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-if="column.key === 'lastLoginTime'">
          {{ formatDate(record.lastLoginTime) }}
        </template>
        <template v-if="column.key === 'role'">
          {{ getRoleName(record.role) }}
        </template>
        <template v-if="column.key === 'username'">
          {{ record.username || '-' }}
        </template>
        <template v-if="column.key === 'nickname'">
          {{ record.nickname || '-' }}
        </template>
        <template v-if="column.key === 'phone'">
          {{ record.phone || '-' }}
        </template>
        <template v-if="column.key === 'email'">
          {{ record.email || '-' }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleViewDetail(record)">
              <template #icon>
                <eye-outlined />
              </template>
              查看
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              size="small"
              @click="handleUpdateStatus(record)"
              :danger="record.status === 'ACTIVE'"
            >
              <template #icon>
                <check-circle-outlined v-if="record.status !== 'ACTIVE'" />
                <stop-outlined v-else />
              </template>
              {{ record.status === 'ACTIVE' ? '禁用' : '启用' }}
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除该用户吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger size="small">
                <template #icon>
                  <delete-outlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="current"
        v-model:page-size="pageSize"
        :total="total"
        show-size-changer
        show-quick-jumper
        :show-total="(total: number) => `共 ${total} 条记录`"
        @change="handlePageChange"
      />
    </div>

    <!-- 创建用户弹窗 -->
    <a-modal
      v-model:visible="createModalVisible"
      title="添加用户"
      :confirm-loading="createModalLoading"
      @ok="handleCreate"
      width="600px"
    >
      <a-form
        :model="createForm"
        :rules="createRules"
        ref="createFormRef"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="createForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="createForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="createForm.nickname" placeholder="选填，不填则自动生成" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-select v-model:value="createForm.role" placeholder="请选择角色">
            <a-select-option value="ADMIN">系统管理员</a-select-option>
            <a-select-option value="BOSS">老板</a-select-option>
            <a-select-option value="MANAGER">店长</a-select-option>
            <a-select-option value="CHEF">厨师</a-select-option>
            <a-select-option value="CUSTOMER">顾客</a-select-option>
            <a-select-option value="DELIVERY">配送员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 用户详情弹窗 -->
    <a-drawer
      v-model:visible="detailVisible"
      title="用户详情"
      placement="right"
      :width="600"
      :footer-style="{ textAlign: 'right' }"
    >
      <template #extra>
        <a-space>
          <a-button @click="detailVisible = false">关闭</a-button>
          <a-button type="primary" @click="showEditModal">编辑</a-button>
        </a-space>
      </template>
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="用户ID">{{ detailInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ detailInfo.username }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ detailInfo.nickname || '-' }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detailInfo.phone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ detailInfo.email || '-' }}</a-descriptions-item>
        <a-descriptions-item label="头像">
          <div v-if="detailInfo.avatar" class="detail-avatar">
            <img :src="detailInfo.avatar" alt="用户头像" />
          </div>
          <span v-else>-</span>
        </a-descriptions-item>
        <a-descriptions-item label="角色">{{ getRoleName(detailInfo.role) }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(detailInfo.status)">
            {{ getStatusName(detailInfo.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最后登录时间">
          {{ formatDate(detailInfo.lastLoginTime) }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ formatDate(detailInfo.createdAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- 编辑用户弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑用户"
      :confirm-loading="editModalLoading"
      @ok="handleUpdate"
      width="600px"
    >
      <a-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="用户ID" name="id">
          <a-input v-model:value="editForm.id" disabled />
        </a-form-item>
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="editForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="editForm.password"
            placeholder="请输入新密码（留空则不修改）"
          />
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="editForm.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 状态更新确认弹窗 -->
    <a-modal
      v-model:visible="statusModalVisible"
      :title="statusForm.status === 'ACTIVE' ? '启用用户' : '禁用用户'"
      @ok="confirmUpdateStatus"
      :confirm-loading="statusModalLoading"
    >
      <p>{{ statusForm.status === 'ACTIVE' ? '确定要启用该用户吗？' : '确定要禁用该用户吗？' }}</p>
      <p>用户名：{{ statusForm.username }}</p>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import {
  userList,
  userGetById,
  userBan,
  userUnban,
  userDelete,
  userUpdateNickname1,
  userUpdateEmail1,
  userUpdatePhone,
  userUpdatePassword1,
  userCreate,
} from '@/api/userController'
import dayjs from 'dayjs'

// 定义用户类型
interface UserVO {
  id: string
  username: string
  nickname: string
  phone: string
  email: string
  avatar: string
  role: string
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED'
  lastLoginTime: string
  createdAt: string
}

// 组件名称
defineOptions({
  name: 'UserManagement',
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

// 获取状态名称
const getStatusName = (statusCode: string | undefined) => {
  if (!statusCode) return '未知状态'

  const statusMap: Record<string, string> = {
    ACTIVE: '正常',
    DISABLED: '已禁用',
    LOCKED: '已锁定'
  }

  return statusMap[statusCode] || '未知状态'
}

// 获取状态标签颜色
const getStatusColor = (status: string | undefined) => {
  if (!status) return 'default'

  const colorMap: Record<string, string> = {
    ACTIVE: 'success',
    DISABLED: 'error',
    LOCKED: 'warning'
  }

  return colorMap[status] || 'default'
}

// 表格列定义
const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 60,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100,
    customRender: ({ text }: { text: string }) => getRoleName(text)
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 160,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
  },
]

// 搜索表单
const searchForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  status: null as 'ACTIVE' | 'DISABLED' | 'LOCKED' | null,
})

// 分页相关
const current = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const searchLoading = ref(false)

// 用户列表数据
const userListData = ref<UserVO[]>([])

// 弹窗相关
const createModalVisible = ref(false)
const createModalLoading = ref(false)
const detailVisible = ref(false)
const editModalVisible = ref(false)
const editModalLoading = ref(false)
const statusModalVisible = ref(false)

// 表单相关
const createFormRef = ref()
const editFormRef = ref()
const createForm = reactive({
  username: '',
  password: '',
  nickname: '',
  role: '',
})
const editForm = reactive({
  id: '',
  username: '',
  password: '',
  nickname: '',
  phone: '',
  email: '',
})
const detailInfo = reactive<UserVO>({
  id: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  role: '',
  status: 'DISABLED',
  lastLoginTime: '',
  createdAt: '',
})

// 状态更新相关
const statusForm = reactive({
  id: '',
  username: '',
  status: 'ACTIVE' as 'ACTIVE' | 'DISABLED' | 'LOCKED',
})
const statusModalLoading = ref(false)

// 表单校验规则
const createRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名至少4个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名至少4个字符', trigger: 'blur' },
  ],
  nickname: [{ required: false, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }],
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await userList(
      {
        pageNum: current.value,
        pageSize: pageSize.value,
      },
      {
        username: searchForm.username,
        nickname: searchForm.nickname,
        phone: searchForm.phone,
        status: searchForm.status || undefined,
      },
    )
    if (res.data.code === 20000 && res.data.data) {
      userListData.value = (res.data.data.records || []).map((item) => ({
        id: item.id || '',
        username: item.username || '',
        nickname: item.nickname || '',
        phone: item.phone || '',
        email: item.email || '',
        avatar: item.avatar || '',
        role: item.role || '',
        status: (item.status || 'DISABLED') as 'ACTIVE' | 'DISABLED' | 'LOCKED',
        lastLoginTime: item.lastLoginTime || '',
        createdAt: item.createdAt || '',
      }))
      total.value = res.data.data.total || 0
    } else {
      message.error(res.data.msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    message.error('获取用户列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  current.value = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  searchForm.username = ''
  searchForm.nickname = ''
  searchForm.phone = ''
  searchForm.status = null
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
  current.value = page
  pageSize.value = size
  fetchUserList()
}

// 显示创建用户弹窗
const showCreateModal = () => {
  createModalVisible.value = true
  Object.keys(createForm).forEach((key) => {
    createForm[key as keyof typeof createForm] = ''
  })
}

// 创建用户
const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    createModalLoading.value = true
    const res = await userCreate({
      username: createForm.username,
      password: createForm.password,
      nickname: createForm.nickname,
      role: createForm.role,
      status: 'ACTIVE'  // 默认设置为激活状态
    })
    if (res && res.data) {
      message.success('创建用户成功')
      createModalVisible.value = false
      await fetchUserList()
    } else {
      message.error('创建用户失败')
    }
  } catch (error) {
    console.error('创建用户失败:', error)
    message.error('创建用户失败，请重试')
  } finally {
    createModalLoading.value = false
  }
}

// 查看用户详情
const handleViewDetail = async (record: UserVO) => {
  try {
    const res = await userGetById({ id: record.id })
    if (res.data.code === 20000 && res.data.data) {
      const data = res.data.data
      Object.assign(detailInfo, {
        id: data.id || '',
        username: data.username || '',
        nickname: data.nickname || '',
        phone: data.phone || '',
        email: data.email || '',
        avatar: data.avatar || '',
        role: data.role || '',
        status: (data.status || 'DISABLED') as 'ACTIVE' | 'DISABLED' | 'LOCKED',
        lastLoginTime: data.lastLoginTime || '',
        createdAt: data.createdAt || '',
      })
      detailVisible.value = true
    } else {
      message.error(res.data.msg || '获取用户详情失败')
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('获取用户详情失败，请重试')
  }
}

// 显示编辑用户弹窗
const showEditModal = () => {
  Object.assign(editForm, detailInfo)
  editModalVisible.value = true
}

// 更新用户信息
const handleUpdate = async () => {
  try {
    await editFormRef.value.validate()
    editModalLoading.value = true

    // 更新昵称
    if (editForm.nickname !== detailInfo.nickname) {
      await userUpdateNickname1({
        id: editForm.id,
        nickname: editForm.nickname,
      })
    }

    // 更新邮箱
    if (editForm.email !== detailInfo.email) {
      await userUpdateEmail1({
        id: editForm.id,
        email: editForm.email,
      })
    }

    // 更新手机号
    if (editForm.phone !== detailInfo.phone) {
      await userUpdatePhone({
        phone: editForm.phone,
      })
    }

    // 更新密码
    if (editForm.password) {
      await userUpdatePassword1(
        {
          id: editForm.id,
        },
        {
          newPassword: editForm.password,
        },
      )
    }

    message.success('更新用户信息成功')
    editModalVisible.value = false
    await handleViewDetail(detailInfo)
    await fetchUserList()
  } catch (error) {
    console.error('更新用户信息失败:', error)
    message.error('更新用户信息失败，请重试')
  } finally {
    editModalLoading.value = false
  }
}

// 更新用户状态
const handleUpdateStatus = async (record: UserVO) => {
  statusForm.id = record.id
  statusForm.username = record.username
  statusForm.status = record.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
  statusModalVisible.value = true
}

// 删除用户
const handleDelete = async (record: UserVO) => {
  try {
    const res = await userDelete({
      id: record.id,
    })
    if (res.data.code === 20000) {
      message.success('删除用户成功')
      await fetchUserList()
    } else {
      message.error(res.data.msg || '删除用户失败')
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    message.error('删除用户失败，请重试')
  }
}

// 确认更新状态
const confirmUpdateStatus = async () => {
  statusModalLoading.value = true
  try {
    const res = await (statusForm.status === 'ACTIVE' ? userUnban : userBan)({
      id: statusForm.id,
    })
    if (res.data.code === 20000) {
      message.success(`${statusForm.status === 'ACTIVE' ? '启用' : '禁用'}用户成功`)
      statusModalVisible.value = false
      await fetchUserList()
    } else {
      message.error(res.data.msg || `${statusForm.status === 'ACTIVE' ? '启用' : '禁用'}用户失败`)
    }
  } catch (error) {
    console.error(`${statusForm.status === 'ACTIVE' ? '启用' : '禁用'}用户失败:`, error)
    message.error(`${statusForm.status === 'ACTIVE' ? '启用' : '禁用'}用户失败，请重试`)
  } finally {
    statusModalLoading.value = false
  }
}

// 页面加载时获取用户列表
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-page {
  background-color: #fff;
}

.search-wrapper {
  margin-bottom: 24px;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 4px;
}

.search-form {
  width: 100%;
}

.search-form :deep(.ant-form-item) {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-table {
  margin-bottom: 16px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-container img,
.detail-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-avatar img {
  width: 80px;
  height: 80px;
}

.default-avatar {
  background-color: #1890ff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
