<template>
  <a-card title="店铺管理" :bordered="false" class="merchant-page">
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
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">停用</a-select-option>
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
                <a-button type="primary" @click="showCreateModal">
                  <template #icon><plus-outlined /></template>
                  添加店铺
                </a-button>
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
          <a-tag :color="record.status === 'AUTO' ? 'success' : 'error'">
            {{ record.status === 'AUTO' ? '正常' : '停用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'minPrice'">
          <span class="price">¥{{ record.minPrice || 0 }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="router.push(`/merchant/${record.id}`)">
              <template #icon><eye-outlined /></template>
              详情
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" size="small" @click="router.push(`/menu/${record.id}`)">
              <template #icon><menu-outlined /></template>
              管理菜单
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

    <!-- 新增弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      title="新增店铺"
      :confirm-loading="modalLoading"
      @ok="handleSave"
      width="600px"
    >
      <a-form
        :model="form"
        :rules="rules"
        ref="formRef"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="店铺名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入店铺名称" />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="所在地区" name="region" required>
          <area-cascader
            type="street"
            :value="areaValue"
            placeholder="请选择省/市/区/街道"
            :onChange="handleAreaChange"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="详细地址" name="addressDetail">
          <a-input v-model:value="form.addressDetail" placeholder="请输入详细地址" />
        </a-form-item>
        <a-form-item label="最低价格" name="minPrice">
          <a-input-number
            v-model:value="form.minPrice"
            placeholder="请输入最低价格"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="店铺Logo" name="logo">
          <a-upload
            name="logo"
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="() => false"
            class="logo-uploader"
          >
            <div v-if="form.logo">
              <img :src="form.logo" alt="logo" style="width: 100%" />
            </div>
            <div v-else class="upload-placeholder">
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { create, getMerchantList, deleteUsingGet } from '@/api/merchantController'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  MenuOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import router from '@/router'

const merchantList = ref<API.MerchantVO[]>([])
const total = ref(0)
const loading = ref(false)
const searchLoading = ref(false)
const current = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  name: '',
  status: '',
  minPrice: undefined,
})

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

// 弹窗相关
const modalVisible = ref(false)
const modalLoading = ref(false)
const form = reactive({
  name: '',
  phone: '',
  minPrice: 0,
  logo: '',
  province: '',
  city: '',
  district: '',
  street: '',
  addressDetail: '',
})

// 计算地址选择器的值
const areaValue = computed(() => {
  const { province, city, district, street } = form
  return [province, city, district, street].filter(Boolean)
})

// 处理地址选择器变化
const handleAreaChange = (values?: string[]) => {
  if (values && values.length > 0) {
    form.province = values[0] || ''
    form.city = values.length > 1 ? values[1] : ''
    form.district = values.length > 2 ? values[2] : ''
    form.street = values.length > 3 ? values[3] : ''
  } else {
    form.province = ''
    form.city = ''
    form.district = ''
    form.street = ''
  }
}

const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
  addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  minPrice: [{ required: true, type: 'number', message: '请输入最低价格', trigger: 'change' }],
}

// 初始加载数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: current.value,
      pageSize: pageSize.value,
    }
    const res = await getMerchantList(params, searchForm)
    if (res.data.code === 1) {
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
    status: undefined,
    minPrice: undefined,
  })
  handleSearch()
}

// 分页变化
const handlePageChange = () => {
  fetchData()
}

// 显示创建弹窗
const showCreateModal = () => {
  modalVisible.value = true
  form.name = ''
  form.phone = ''
  form.minPrice = 0
  form.logo = ''
  form.province = ''
  form.city = ''
  form.district = ''
  form.street = ''
  form.addressDetail = ''
}

// 保存操作（新增）
const handleSave = async () => {
  try {
    await formRef.value.validate()
    modalLoading.value = true
    const res = await create(form)
    if (res.data.code === 1) {
      message.success('新增成功')
    } else {
      message.error(res.data.msg || '新增失败')
    }
    modalVisible.value = false
    await fetchData()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    modalLoading.value = false
  }
}

// 删除店铺
const handleDelete = async (record: API.MerchantVO) => {
  try {
    if (record.id) {
      const res = await deleteUsingGet({ id: record.id })
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

.logo-container img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.logo-uploader {
  width: 128px;
  height: 128px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

:deep(.ant-upload-select-picture-card) {
  width: 128px;
  height: 128px;
  margin-right: 8px;
  margin-bottom: 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s;
}

:deep(.ant-upload-select-picture-card:hover) {
  border-color: #1890ff;
}
</style>
