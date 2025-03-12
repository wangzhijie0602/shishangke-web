<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  Space,
  Card,
  Select,
  Popconfirm,
  Badge,
} from 'ant-design-vue'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue'
import { create2, get, ban, unban, delete2, getUserList, update2 } from '@/api/adminController'

// 用户列表数据
const userList = ref<API.UserVO[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const current = ref<number>(1)
const pageSize = ref<number>(10)

// 搜索表单
const searchForm = reactive<API.UserQueryRequest>({
  username: '',
  nickname: '',
  phone: '',
  status: '',
})

// 创建用户表单
const createFormRef = ref()
const createVisible = ref<boolean>(false)
const createForm = reactive<API.UserCreateRequest>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
})
const createLoading = ref<boolean>(false)

// 编辑用户表单
const editFormRef = ref()
const editVisible = ref<boolean>(false)
const editForm = reactive<API.UserUpdateRequest>({
  id: '',
  username: '',
  password: '',
  nickname: '',
  avatar: '',
  email: '',
  phone: '',
})
const editLoading = ref<boolean>(false)

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList(
      {
        pageNum: current.value,
        pageSize: pageSize.value,
      },
      searchForm,
    )
    if (res.data?.code === 1 && res.data?.data) {
      userList.value = res.data.data.records || []
      total.value = res.data.data.total || 0
    } else {
      message.error(res.data?.msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索用户
const handleSearch = () => {
  current.value = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key as keyof API.UserQueryRequest] = undefined
  })
  current.value = 1
  fetchUserList()
}

// 分页变化
const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
  current.value = pagination.current || 1
  pageSize.value = pagination.pageSize || 10
  fetchUserList()
}

// 打开创建用户对话框
const showCreateModal = () => {
  Object.keys(createForm).forEach((key) => {
    createForm[key as keyof API.UserCreateRequest] = ''
  })
  createVisible.value = true
}

// 创建用户
const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    createLoading.value = true
    const res = await create2(createForm)
    if (res.data?.code === 1) {
      message.success('创建用户成功')
      createVisible.value = false
      await fetchUserList()
    } else {
      message.error(res.data?.msg || '创建用户失败')
    }
  } catch (error) {
    console.error('创建用户失败', error)
  } finally {
    createLoading.value = false
  }
}

// 打开编辑用户对话框
const handleEdit = async (record: API.UserVO) => {
  if (!record.id) {
    message.error('用户ID不存在')
    return
  }

  try {
    const res = await get({ id: record.id })
    if (res.data?.code === 1 && res.data?.data) {
      editForm.id = res.data.data.id || ''
      editForm.username = res.data.data.username || ''
      editForm.password = '' // 不回显密码
      editForm.nickname = res.data.data.nickname || ''
      editForm.avatar = res.data.data.avatar || ''
      editForm.email = res.data.data.email || ''
      editForm.phone = res.data.data.phone || ''
      editVisible.value = true
    } else {
      message.error(res.data?.msg || '获取用户详情失败')
    }
  } catch (error) {
    console.error('获取用户详情失败', error)
    message.error('获取用户详情失败')
  }
}

// 更新用户
const handleUpdate = async () => {
  try {
    await editFormRef.value.validate()
    editLoading.value = true
    const res = await update2(editForm)
    if (res.data?.code === 1) {
      message.success('更新用户成功')
      editVisible.value = false
      await fetchUserList()
    } else {
      message.error(res.data?.msg || '更新用户失败')
    }
  } catch (error) {
    console.error('更新用户失败', error)
  } finally {
    editLoading.value = false
  }
}

// 删除用户
const handleDelete = async (record: API.UserVO) => {
  if (!record.id) {
    message.error('用户ID不存在')
    return
  }

  try {
    const res = await delete2({ id: record.id })
    if (res.data?.code === 1) {
      message.success('删除用户成功')
      await fetchUserList()
    } else {
      message.error(res.data?.msg || '删除用户失败')
    }
  } catch (error) {
    console.error('删除用户失败', error)
    message.error('删除用户失败')
  }
}

// 禁用用户
const handleBan = async (record: API.UserVO) => {
  if (!record.id) {
    message.error('用户ID不存在')
    return
  }

  try {
    const res = await ban({ id: record.id })
    if (res.data?.code === 1) {
      message.success('禁用用户成功')
      await fetchUserList()
    } else {
      message.error(res.data?.msg || '禁用用户失败')
    }
  } catch (error) {
    console.error('禁用用户失败', error)
    message.error('禁用用户失败')
  }
}

// 解禁用户
const handleUnban = async (record: API.UserVO) => {
  if (!record.id) {
    message.error('用户ID不存在')
    return
  }

  try {
    const res = await unban({ id: record.id })
    if (res.data?.code === 1) {
      message.success('解禁用户成功')
      await fetchUserList()
    } else {
      message.error(res.data?.msg || '解禁用户失败')
    }
  } catch (error) {
    console.error('解禁用户失败', error)
    message.error('解禁用户失败')
  }
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }: { record: API.UserVO }) => {
      const statusText = record?.status === 'ENABLED' ? '正常' : '禁用'
      const statusColor = record?.status === 'ENABLED' ? 'success' : 'error'
      return h(Badge, {
        status: statusColor,
        text: statusText,
        style: { color: statusColor },
      })
    },
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    customRender: ({ text }: { text: string | undefined }) => {
      return text ? new Date(text).toLocaleString() : '-'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: ({ text }: { text: string | undefined }) => {
      return text ? new Date(text).toLocaleString() : '-'
    },
  },
  {
    title: '操作',
    key: 'action',
    customRender: ({ record }: { record: API.UserVO }) => {
      return h(
        Space,
        {},
        {
          default: () => [
            h(
              Button,
              {
                type: 'primary',
                size: 'small',
                onClick: () => handleEdit(record),
              },
              {
                default: () => [h(EditOutlined), '编辑'],
              },
            ),
            h(
              Popconfirm,
              {
                title: '确定要删除此用户吗？',
                onConfirm: () => handleDelete(record),
                okText: '确定',
                cancelText: '取消',
              },
              {
                default: () => [
                  h(
                    Button,
                    {
                      type: 'primary',
                      danger: true,
                      size: 'small',
                    },
                    {
                      default: () => [h(DeleteOutlined), '删除'],
                    },
                  ),
                ],
              },
            ),
            record?.status === 'ENABLED'
              ? h(
                  Popconfirm,
                  {
                    title: '确定要禁用此用户吗？',
                    onConfirm: () => handleBan(record),
                    okText: '确定',
                    cancelText: '取消',
                  },
                  {
                    default: () => [
                      h(
                        Button,
                        {
                          type: 'primary',
                          danger: true,
                          size: 'small',
                        },
                        {
                          default: () => [h(LockOutlined), '禁用'],
                        },
                      ),
                    ],
                  },
                )
              : h(
                  Popconfirm,
                  {
                    title: '确定要解禁此用户吗？',
                    onConfirm: () => handleUnban(record),
                    okText: '确定',
                    cancelText: '取消',
                  },
                  {
                    default: () => [
                      h(
                        Button,
                        {
                          type: 'primary',
                          size: 'small',
                        },
                        {
                          default: () => [h(UnlockOutlined), '解禁'],
                        },
                      ),
                    ],
                  },
                ),
          ],
        },
      )
    },
  },
]

// 页面加载时获取用户列表
onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="admin-page">
    <Card title="用户管理" :bordered="false">
      <!-- 搜索表单 -->
      <Form layout="inline" :model="searchForm" class="search-form">
        <Form.Item name="username" label="用户名">
          <Input v-model:value="searchForm.username" placeholder="请输入用户名" allow-clear />
        </Form.Item>
        <Form.Item name="nickname" label="昵称">
          <Input v-model:value="searchForm.nickname" placeholder="请输入昵称" allow-clear />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input v-model:value="searchForm.phone" placeholder="请输入手机号" allow-clear />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            style="width: 120px"
            allow-clear
          >
            <Select.Option value="ENABLED">正常</Select.Option>
            <Select.Option value="DISABLED">禁用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" @click="handleSearch">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </Button>
            <Button @click="handleReset">重置</Button>
            <Button type="primary" @click="showCreateModal">
              <template #icon>
                <PlusOutlined />
              </template>
              创建用户
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <!-- 用户列表表格 -->
      <Table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="{
          current: current,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }"
        @change="handleTableChange"
        row-key="id"
      />

      <!-- 创建用户对话框 -->
      <Modal
        v-model:visible="createVisible"
        title="创建用户"
        :confirm-loading="createLoading"
        @ok="handleCreate"
      >
        <Form
          ref="createFormRef"
          :model="createForm"
          :rules="{
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          }"
          layout="vertical"
        >
          <Form.Item name="username" label="用户名">
            <Input v-model:value="createForm.username" placeholder="请输入用户名" prefix="user" />
          </Form.Item>
          <Form.Item name="password" label="密码">
            <Input.Password
              v-model:value="createForm.password"
              placeholder="请输入密码"
              prefix="lock"
            />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input v-model:value="createForm.nickname" placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input v-model:value="createForm.email" placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input v-model:value="createForm.phone" placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>

      <!-- 编辑用户对话框 -->
      <Modal
        v-model:visible="editVisible"
        title="编辑用户"
        :confirm-loading="editLoading"
        @ok="handleUpdate"
      >
        <Form
          ref="editFormRef"
          :model="editForm"
          :rules="{
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          }"
          layout="vertical"
        >
          <Form.Item name="username" label="用户名">
            <Input v-model:value="editForm.username" placeholder="请输入用户名" prefix="user" />
          </Form.Item>
          <Form.Item name="password" label="密码">
            <Input.Password
              v-model:value="editForm.password"
              placeholder="请输入密码（不修改请留空）"
              prefix="lock"
            />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input v-model:value="editForm.nickname" placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input v-model:value="editForm.email" placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input v-model:value="editForm.phone" placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 24px;
}

.search-form {
  margin-bottom: 24px;
}
</style>
