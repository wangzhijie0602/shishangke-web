<template>
  <a-card title="用户管理" :bordered="false" class="user-page">
    <!-- 搜索表单 -->
    <div class="search-wrapper">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="16" style="width: 100%">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="searchForm.username" placeholder="请输入用户名" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="searchForm.nickname" placeholder="请输入昵称" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="searchForm.phone" placeholder="请输入手机号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="状态" name="status">
              <a-select
                v-model:value="searchForm.status"
                placeholder="请选择状态"
                allow-clear
                style="width: 100%"
              >
                <a-select-option value="ENABLED">正常</a-select-option>
                <a-select-option value="DISABLED">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" class="action-buttons">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">
                  <template #icon><search-outlined /></template>
                  搜索
                </a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="showCreateModal">
                  <template #icon><plus-outlined /></template>
                  添加用户
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 用户列表 -->
    <a-table
      :columns="columns"
      :data-source="userList"
      :row-key="(record: any) => record.id"
      :loading="loading"
      :pagination="false"
      size="middle"
      class="user-table"
      :scroll="{ x: 1200 }"
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
          <a-tag :color="record.status === 'ENABLED' ? 'success' : 'error'">
            {{ record.status === 'ENABLED' ? '正常' : '禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
        <template v-if="column.key === 'lastLoginTime'">
          {{ formatDate(record.lastLoginTime) }}
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleViewDetail(record)">
              <template #icon><eye-outlined /></template>
              查看
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              size="small"
              @click="handleUpdateStatus(record)"
              :danger="record.status === 'ENABLED'"
            >
              <template #icon>
                <check-circle-outlined v-if="record.status !== 'ENABLED'" />
                <stop-outlined v-else />
              </template>
              {{ record.status === 'ENABLED' ? '禁用' : '启用' }}
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除该用户吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger size="small">
                <template #icon><delete-outlined /></template>
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
          <a-input v-model:value="createForm.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="createForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="createForm.email" placeholder="请输入邮箱" />
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
        <a-descriptions-item label="角色">{{ detailInfo.role || '-' }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="detailInfo.status === 'ENABLED' ? 'success' : 'error'">
            {{ detailInfo.status === 'ENABLED' ? '正常' : '禁用' }}
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
      :title="statusForm.status === 'ENABLED' ? '启用用户' : '禁用用户'"
      @ok="confirmUpdateStatus"
      :confirm-loading="statusModalLoading"
    >
      <p>{{ statusForm.status === 'ENABLED' ? '确定要启用该用户吗？' : '确定要禁用该用户吗？' }}</p>
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
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons-vue'
import {
  create2,
  get,
  ban,
  unban,
  delete2,
  getUserList,
  update2,
} from '@/api/adminController'

// 用户列表数据
const userList = ref<API.UserVO[]>([])
const total = ref(0)
const loading = ref(false)
const searchLoading = ref(false)
const current = ref(1)
const pageSize = ref(10)

// 搜索表单
const searchForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  status: '',
})

// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '头像', key: 'avatar', width: 80, align: 'center' },
  { title: '用户名', dataIndex: 'username', key: 'username', width: 120, ellipsis: true },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120, ellipsis: true },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 160, ellipsis: true },
  { title: '角色', dataIndex: 'role', key: 'role', width: 80 },
  { title: '状态', key: 'status', width: 80, align: 'center' },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 150,
    sorter: (a: API.UserVO, b: API.UserVO) => {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    },
  },
  {
    title: '最后登录',
    key: 'lastLoginTime',
    dataIndex: 'lastLoginTime',
    width: 150,
  },
  { title: '操作', key: 'action', fixed: 'right', width: 240, align: 'center' },
]

// 日期格式化
const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 初始加载数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: current.value,
      pageSize: pageSize.value,
    }
    const res = await getUserList(params, searchForm)
    if (res.data.code === 1) {
      userList.value = res.data.data?.records || []
      total.value = res.data.data?.total || 0
    } else {
      message.error(res.data.msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    message.error('网络异常，请重试')
  } finally {
    loading.value = false
    searchLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  current.value = 1
  searchLoading.value = true
  fetchData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    nickname: '',
    phone: '',
    status: '',
  })
  handleSearch()
}

// 分页变化
const handlePageChange = () => {
  fetchData()
}

// 删除用户
const handleDelete = async (record: API.UserVO) => {
  try {
    if (record.id) {
      const res = await delete2({ id: String(record.id) })
      if (res.data.code === 1) {
        message.success('删除成功')
        await fetchData()
      } else {
        message.error(res.data.msg || '删除失败')
      }
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('网络异常，请重试')
  }
}

// 状态更新相关
const statusModalVisible = ref(false)
const statusModalLoading = ref(false)
const statusForm = reactive({
  id: '',
  username: '',
  status: 'ENABLED',
})

const handleUpdateStatus = (record: API.UserVO) => {
  statusForm.id = record.id || ''
  statusForm.username = record.username || ''
  statusForm.status = record.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
  statusModalVisible.value = true
}

const confirmUpdateStatus = async () => {
  statusModalLoading.value = true
  try {
    let res
    if (statusForm.status === 'ENABLED') {
      res = await unban({ id: statusForm.id })
    } else {
      res = await ban({ id: statusForm.id })
    }

    if (res.data.code === 1) {
      message.success(
        `${statusForm.status === 'ENABLED' ? '启用' : '禁用'}用户成功`
      )
      await fetchData()
      statusModalVisible.value = false
    } else {
      message.error(res.data.msg || '更新状态失败')
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    message.error('网络异常，请重试')
  } finally {
    statusModalLoading.value = false
  }
}

// 详情查看相关
const detailVisible = ref(false)
const detailInfo = ref<API.UserVO>({})

const handleViewDetail = async (record: API.UserVO) => {
  try {
    if (record.id) {
      const res = await get({ id: String(record.id) })
      if (res.data.code === 1) {
        detailInfo.value = res.data.data || {}
        detailVisible.value = true
      } else {
        message.error(res.data.msg || '获取用户详情失败')
      }
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    message.error('网络异常，请重试')
  }
}

// 创建相关
const createModalVisible = ref(false)
const createModalLoading = ref(false)
const createFormRef = ref()
const createForm = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
})
const createRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const showCreateModal = () => {
  Object.assign(createForm, {
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
  })
  createModalVisible.value = true
}

const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    createModalLoading.value = true
    const res = await create2(createForm)
    if (res.data.code === 1) {
      message.success('创建用户成功')
      createModalVisible.value = false
      await fetchData()
    } else {
      message.error(res.data.msg || '创建用户失败')
    }
  } catch (error) {
    console.error('创建用户失败:', error)
  } finally {
    createModalLoading.value = false
  }
}

// 编辑相关
const editModalVisible = ref(false)
const editModalLoading = ref(false)
const editFormRef = ref()
const editForm = reactive({
  id: '',
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
})
const editRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
}

const showEditModal = () => {
  editForm.id = detailInfo.value.id || ''
  editForm.username = detailInfo.value.username || ''
  editForm.password = '' // 不设置默认密码，避免误修改
  editForm.nickname = detailInfo.value.nickname || ''
  editForm.email = detailInfo.value.email || ''
  editForm.phone = detailInfo.value.phone || ''
  editModalVisible.value = true
}

const handleUpdate = async () => {
  try {
    await editFormRef.value.validate()
    editModalLoading.value = true
    const res = await update2(editForm)
    if (res.data.code === 1) {
      message.success('更新用户成功')
      editModalVisible.value = false
      // 更新详情数据
      if (detailInfo.value.id) {
        const detailRes = await get({ id: String(detailInfo.value.id) })
        if (detailRes.data.code === 1) {
          detailInfo.value = detailRes.data.data || {}
        }
      }
      await fetchData()
    } else {
      message.error(res.data.msg || '更新用户失败')
    }
  } catch (error) {
    console.error('更新用户失败:', error)
  } finally {
    editModalLoading.value = false
  }
}

onMounted(() => {
  fetchData()
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

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
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
  width: 40px;
  height: 40px;
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