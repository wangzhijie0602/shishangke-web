<template>
  <a-card title="店铺管理（管理员）" :bordered="false" class="merchant-page">
    <!-- 搜索表单 -->
    <div class="search-wrapper">
      <a-form :model="searchForm" layout="inline" class="search-form">
        <a-row :gutter="16" style="width: 100%">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="店铺名称" name="name">
              <a-input v-model:value="searchForm.name" placeholder="请输入店铺名称" allow-clear />
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
                <a-select-option value="OPEN">营业中</a-select-option>
                <a-select-option value="CLOSED">休息中</a-select-option>
                <a-select-option value="SUSPENDED">暂停营业</a-select-option>
                <a-select-option value="PENDING_REVIEW">待审核</a-select-option>
                <a-select-option value="REJECTED">审核拒绝</a-select-option>
                <a-select-option value="BANNED">已封禁</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-form-item label="最低价格" name="minPrice">
              <a-input-number
                v-model:value="searchForm.minPrice"
                placeholder="请输入最低价格"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="6" class="action-buttons">
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">
                  <template #icon><search-outlined /></template>
                  搜索
                </a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 店铺列表 -->
    <a-table
      :columns="columns"
      :data-source="merchantList"
      :row-key="(record: any) => record.id"
      :loading="loading"
      :pagination="false"
      size="middle"
      class="merchant-table"
      :scroll="{ x: 1200 }"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logo'">
          <div class="logo-container">
            <img v-if="record.logo" :src="record.logo" alt="店铺Logo" />
            <a-avatar v-else shape="square" :size="50" class="default-logo">
              {{ record.name ? record.name.charAt(0) : '?' }}
            </a-avatar>
          </div>
        </template>
        <template v-if="column.key === 'fullAddress'">
          <a-tooltip
            :title="
              [record.province, record.city, record.district, record.street, record.addressDetail]
                .filter((s) => s)
                .join(' ') || '-'
            "
          >
            <span class="ellipsis-text">
              {{
                [record.province, record.city, record.district, record.street, record.addressDetail]
                  .filter((s) => s)
                  .join(' ') || '-'
              }}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'operatingHours'">
          {{ `${record.openTime || '-'} - ${record.closeTime || '-'}` }}
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'minPrice'">
          <span class="price">¥{{ record.minPrice || 0 }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleViewDetail(record)">
              <template #icon><eye-outlined /></template>
              详情
            </a-button>
            <a-divider type="vertical" />
            <a-button
              type="link"
              size="small"
              @click="handleUpdateStatus(record)"
              :disabled="record.status === 'BANNED'"
            >
              <template #icon>
                <check-circle-outlined v-if="record.status === 'BANNED'" />
                <stop-outlined v-else />
              </template>
              {{ record.status === 'BANNED' ? '解封' : '封禁' }}
            </a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除该店铺吗？"
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

    <!-- 状态更新确认弹窗 -->
    <a-modal
      v-model:open="statusModalVisible"
      :title="statusForm.status === 'OPEN' ? '启用店铺' : '停用店铺'"
      @ok="confirmUpdateStatus"
      :confirm-loading="statusModalLoading"
    >
      <p>{{ statusForm.status === 'OPEN' ? '确定要启用该店铺吗？' : '确定要停用该店铺吗？' }}</p>
      <p>店铺名称：{{ statusForm.name }}</p>
    </a-modal>

    <!-- 详情弹窗 -->
    <a-drawer
      v-model:open="detailVisible"
      title="店铺详情"
      placement="right"
      :width="600"
      :footer-style="{ textAlign: 'right' }"
    >
      <template #extra>
        <a-space>
          <a-button @click="detailVisible = false">关闭</a-button>
          <a-button type="primary" @click="handleEdit">编辑</a-button>
        </a-space>
      </template>
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="店铺ID">{{ detailInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="店铺名称">{{ detailInfo.name }}</a-descriptions-item>
        <a-descriptions-item label="联系电话">{{ detailInfo.phone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="店铺Logo">
          <div v-if="detailInfo.logo" class="detail-logo">
            <img :src="detailInfo.logo" alt="店铺Logo" />
          </div>
          <span v-else>-</span>
        </a-descriptions-item>
        <a-descriptions-item label="店铺地址">
          {{
            [
              detailInfo.province,
              detailInfo.city,
              detailInfo.district,
              detailInfo.street,
              detailInfo.addressDetail,
            ]
              .filter((s) => s)
              .join(' ') || '-'
          }}
        </a-descriptions-item>
        <a-descriptions-item label="营业时间">
          {{ `${detailInfo.openTime || '-'} - ${detailInfo.closeTime || '-'}` }}
        </a-descriptions-item>
        <a-descriptions-item label="最低价格">
          <span class="price">¥{{ detailInfo.minPrice || 0 }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(detailInfo.status || '')">
            {{ getStatusText(detailInfo.status || '') }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="店铺描述">
          {{ detailInfo.description || '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  merchants,
  merchantGet,
  merchantDelete,
  merchantUpdateStatus,
} from '@/api/merchantController'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const merchantList = ref<API.MerchantVO[]>([])
const total = ref(0)
const loading = ref(false)
const searchLoading = ref(false)
const current = ref(1)
const pageSize = ref(10)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
  minPrice: undefined,
})

// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '店铺Logo', key: 'logo', width: 100, align: 'center' },
  { title: '店铺名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
  {
    title: '详细地址',
    key: 'fullAddress',
    width: 200,
    ellipsis: true,
  },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
  {
    title: '营业时间',
    key: 'operatingHours',
    width: 150,
  },
  { title: '最低价格', key: 'minPrice', dataIndex: 'minPrice', width: 100, align: 'right' },
  { title: '状态', key: 'status', width: 80, align: 'center' },
  { title: '操作', key: 'action', fixed: 'right', width: 250, align: 'center' },
]

// 初始加载数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: current.value,
      pageSize: pageSize.value,
    }
    const res = await merchants(params, {
      name: searchForm.name || undefined,
      status: searchForm.status || undefined,
    })
    if (res.data.code === 20000) {
      merchantList.value = res.data.data?.records || []
      total.value = res.data.data?.total || 0
    } else {
      message.error(res.data.msg || '获取店铺列表失败')
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
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
    name: '',
    status: '',
    minPrice: undefined,
  })
  handleSearch()
}

// 分页变化
const handlePageChange = () => {
  fetchData()
}

// 删除店铺
const handleDelete = async (record: API.MerchantVO) => {
  try {
    if (record.id) {
      const res = await merchantDelete({ id: record.id })
      if (res.data.code === 20000) {
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
  name: '',
  status: 'OPEN',
})

const handleUpdateStatus = (record: API.MerchantVO) => {
  statusForm.id = record.id || ''
  statusForm.name = record.name || ''
  statusForm.status = record.status === 'BANNED' ? 'OPEN' : 'BANNED'
  statusModalVisible.value = true
}

const confirmUpdateStatus = async () => {
  statusModalLoading.value = true
  try {
    const res = await merchantUpdateStatus({
      id: statusForm.id,
      status: statusForm.status,
    })
    if (res.data.code === 20000) {
      message.success(
        `${statusForm.status === 'BANNED' ? '封禁' : '解封'}店铺成功`
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
const detailInfo = ref<API.MerchantVO>({})

const handleViewDetail = async (record: API.MerchantVO) => {
  try {
    if (record.id) {
      const res = await merchantGet({ id: record.id })
      if (res.data.code === 20000) {
        detailInfo.value = res.data.data || {}
        detailVisible.value = true
      } else {
        message.error(res.data.msg || '获取店铺详情失败')
      }
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    message.error('网络异常，请重试')
  }
}

// 编辑店铺
const handleEdit = () => {
  if (detailInfo.value.id) {
    router.push(`/admin/merchant/${detailInfo.value.id}`)
    detailVisible.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'success'
    case 'CLOSED':
      return 'warning'
    case 'SUSPENDED':
      return 'error'
    case 'PENDING_REVIEW':
      return 'processing'
    case 'REJECTED':
      return 'error'
    case 'BANNED':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'OPEN':
      return '营业中'
    case 'CLOSED':
      return '休息中'
    case 'SUSPENDED':
      return '暂停营业'
    case 'PENDING_REVIEW':
      return '待审核'
    case 'REJECTED':
      return '审核拒绝'
    case 'BANNED':
      return '已封禁'
    default:
      return '未知状态'
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.merchant-page {
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

.merchant-table {
  margin-bottom: 16px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container img,
.detail-logo img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-logo img {
  width: 100px;
  height: 100px;
}

.default-logo {
  background-color: #1890ff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.ellipsis-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-weight: 500;
  color: #ff4d4f;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
