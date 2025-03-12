<template>
  <a-card title="店铺管理" :bordered="false">
    <!-- 搜索表单 -->
    <a-form :model="searchForm" layout="inline" class="mb-4">
      <a-form-item label="店铺名称" name="name">
        <a-input v-model:value="searchForm.name" placeholder="请输入店铺名称" allow-clear />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear>
          <a-select-option value="1">正常</a-select-option>
          <a-select-option value="0">停用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="最低价格" name="minPrice">
        <a-input-number v-model:value="searchForm.minPrice" placeholder="请输入最低价格" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch" :loading="searchLoading">
          <template #icon>
            <search-outlined />
          </template>
          搜索
        </a-button>
        <a-button class="ml-4" @click="handleReset">重置</a-button>
        <a-button class="ml-4" type="primary" @click="showCreateModal">
          <template #icon>
            <plus-outlined />
          </template>
          添加店铺
        </a-button>
      </a-form-item>
    </a-form>

    <!-- 店铺列表 -->
    <a-table
      :columns="columns"
      :data-source="merchantList"
      :row-key="(record: any) => record.id"
      :loading="loading"
      :pagination="false"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'logo'">
          <img v-if="record.logo" :src="record.logo" style="width: 50px; height: 50px" />
          <span v-else>-</span>
        </template>
        <template v-if="column.key === 'fullAddress'">
          {{
            [record.province, record.city, record.district, record.street, record.addressDetail]
              .filter((s) => s)
              .join(' ') || '-'
          }}
        </template>
        <template v-if="column.key === 'operatingHours'">
          {{ `${record.openTime || '-'} - ${record.closeTime || '-'}` }}
        </template>
        <template v-if="column.key === 'status'">
          <a-badge
            :color="record.status === 1 ? '#52c41a' : '#f50'"
            :text="record.status === 1 ? '正常' : '停用'"
          />
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <router-link :to="`/merchant/${record.id}`">
              <a-button type="primary">详情</a-button>
            </router-link>
            <a-popconfirm
              title="确定要删除该店铺吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record)"
            >
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <a-pagination
      class="mt-4"
      v-model:current="current"
      v-model:page-size="pageSize"
      :total="total"
      show-size-changer
      show-quick-jumper
      @change="handlePageChange"
    />

    <!-- 新增弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      title="新增店铺"
      :confirm-loading="modalLoading"
      @ok="handleSave"
    >
      <a-form :model="form" :rules="rules" ref="formRef">
        <a-form-item label="店铺名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入店铺名称" />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="最低价格" name="minPrice">
          <a-input-number v-model:value="form.minPrice" placeholder="请输入最低价格" :min="0" />
        </a-form-item>
        <a-form-item label="店铺Logo" name="logo">
          <a-upload name="logo" :show-upload-list="false" :before-upload="() => false">
            <a-button>上传图片</a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { create, getMerchantList, deleteUsingGet } from '@/api/merchantController'
import { message } from 'ant-design-vue'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue'

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
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '店铺Logo', key: 'logo' },
  { title: '店铺名称', dataIndex: 'name', key: 'name' },
  {
    title: '详细地址',
    key: 'fullAddress',
    customRender: (record: API.MerchantVO) =>
      [record.province, record.city, record.district, record.street, record.addressDetail]
        .filter((s) => s)
        .join(' ') || '-',
  },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  {
    title: '营业时间',
    key: 'operatingHours',
    customRender: (record: API.MerchantVO) =>
      `${record.openTime || '-'} - ${record.closeTime || '-'}`,
  },
  { title: '最低价格', key: 'minPrice', dataIndex: 'minPrice', align: 'right' },
  { title: '状态', key: 'status', align: 'center' },
  { title: '操作', key: 'action', align: 'center', width: 200 },
]

// 弹窗相关
const modalVisible = ref(false)
const modalLoading = ref(false)
const form = reactive({
  name: '',
  phone: '',
  minPrice: 0,
  logo: '',
})
const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
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
img {
  border-radius: 4px;
  object-fit: cover;
}
</style>
