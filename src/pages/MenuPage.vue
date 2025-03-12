<template>
  <div class="menu-management">
    <a-card :title="`${merchantName || '未知商铺'} - 菜单管理`" :bordered="false">
      <!-- 搜索表单 -->
      <a-form :model="searchForm" layout="inline" class="search-form" @finish="handleSearch">
        <a-form-item label="菜单名称" name="name">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入菜单名称"
            style="width: 150px"
          />
        </a-form-item>
        <a-form-item label="分类" name="category">
          <a-select
            v-model:value="searchForm.category"
            placeholder="请选择分类"
            style="width: 150px"
            allow-clear
          >
            <a-select-option
              v-for="category in categoryOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select
            v-model:value="searchForm.status"
            style="width: 150px"
            placeholder="请选择状态"
            allow-clear
          >
            <a-select-option value="AVAILABLE">可用</a-select-option>
            <a-select-option value="UNAVAILABLE">不可用</a-select-option>
            <a-select-option value="SOLD_OUT">售罄</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="最低价格" name="minPrice">
          <a-input-number v-model:value="searchForm.minPrice" style="width: 150px" />
        </a-form-item>
        <a-form-item label="最高价格" name="maxPrice">
          <a-input-number v-model:value="searchForm.maxPrice" style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleAddMenu">添加菜单</a-button>
            <a-button @click="goBack">返回商铺列表</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <!-- 菜单列表表格 -->
      <a-table
        :columns="columns"
        :data-source="menuList"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: any) => `共 ${total} 条记录`,
        }"
        :row-key="(record: any) => record.menuId"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'imageUrl'">
            <div class="menu-image-container">
              <img
                v-if="record.imageUrl"
                :src="record.imageUrl"
                alt="菜品图片"
                class="menu-image"
                @click="previewImage(record.imageUrl)"
              />
              <div v-else class="menu-image-placeholder">暂无图片</div>
            </div>
          </template>
          <template v-if="column.key === 'price'"> ¥{{ record.price?.toFixed(2) }}</template>
          <template v-if="column.key === 'status'">
            <span :style="{ color: getStatusColor(record.status) }">
              {{ getStatusText(record.status) }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEditMenu(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除这个菜单项吗？"
                @confirm="() => handleDeleteMenu(record.menuId)"
                ok-text="确定"
                cancel-text="取消"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑菜单模态框 -->
    <a-modal
      :visible="modalVisible"
      :title="editingMenu ? '编辑菜单' : '添加菜单'"
      @ok="handleSaveMenu"
      @cancel="() => (modalVisible = false)"
      width="700px"
    >
      <a-form ref="menuFormRef" :model="menuForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="菜单名称"
              name="name"
              :rules="[{ required: true, message: '请输入菜单名称' }]"
            >
              <a-input v-model:value="menuForm.name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="价格"
              name="price"
              :rules="[{ required: true, message: '请输入价格' }]"
            >
              <a-input-number
                v-model:value="menuForm.price"
                style="width: 100%"
                :min="0"
                :precision="2"
                :formatter="(value: any) => `¥ ${value}`"
                :parser="(value: any) => value.replace(/¥\s?/g, '')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="分类" name="category">
              <a-select v-model:value="menuForm.category">
                <a-select-option
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :value="category.value"
                >
                  {{ category.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="menuForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="菜品图片" name="imageUrl">
          <div class="upload-container">
            <div class="image-preview" v-if="menuForm.imageUrl">
              <img :src="menuForm.imageUrl" alt="菜品图片预览" />
              <div class="image-actions">
                <a-button type="primary" danger size="small" @click="removeImage">
                  删除图片
                </a-button>
              </div>
            </div>
            <a-upload
              v-else
              name="file"
              list-type="picture-card"
              :show-upload-list="false"
              :before-upload="beforeUpload"
              :customRequest="handleUpload"
            >
              <div v-if="uploadLoading">
                <a-spin />
              </div>
              <div v-else>
                <plus-outlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="menuForm.status">
                <a-select-option value="AVAILABLE">可用</a-select-option>
                <a-select-option value="UNAVAILABLE">不可用</a-select-option>
                <a-select-option value="SOLD_OUT">售罄</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 图片预览 -->
    <a-image
      :visible="previewVisible"
      :src="previewImageUrl"
      @visibleChange="(visible: boolean) => (previewVisible = visible)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  getMenuByMerchant,
  create1 as createMenu,
  update1 as updateMenu,
  delete1 as deleteMenu,
  getMenu,
  uploadImage,
} from '@/api/menuController'
import { getMerchant } from '@/api/merchantController'

// 路由相关
const route = useRoute()
const router = useRouter()
const merchantId = ref<string | null>(null)
const merchantName = ref<string>('')

// 表单引用
const menuFormRef = ref()

// 状态定义
const loading = ref<boolean>(false)
const uploadLoading = ref<boolean>(false)
const modalVisible = ref<boolean>(false)
const editingMenu = ref<API.MenuVO | null>(null)
const menuList = ref<API.MenuVO[]>([])
const previewVisible = ref<boolean>(false)
const previewImageUrl = ref<string>('')

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 搜索表单
const searchForm = reactive<API.MenuQueryRequest>({
  merchantId: undefined,
  name: undefined,
  category: undefined,
  status: undefined,
  minPrice: undefined,
  maxPrice: undefined,
})

// 菜单表单
const menuForm = reactive<API.MenuCreateRequest & { menuId?: string }>({
  merchantId: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  status: 'AVAILABLE',
  sortOrder: 0,
})

// 表格列定义 - 调整列顺序和宽度
const columns = [
  {
    title: '菜单ID',
    dataIndex: 'menuId',
    key: 'menuId',
    width: 100,
  },
  {
    title: '菜品图片',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    width: 120,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: 200,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: 100,
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
  },
]

// 分类选项
const categoryOptions = [
  { value: '热菜', label: '热菜' },
  { value: '凉菜', label: '凉菜' },
  { value: '主食', label: '主食' },
  { value: '汤品', label: '汤品' },
  { value: '小吃', label: '小吃' },
  { value: '甜点', label: '甜点' },
  { value: '饮品', label: '饮品' },
  { value: '酒水', label: '酒水' },
  { value: '特色菜', label: '特色菜' },
]

// 获取商家信息
const fetchMerchantInfo = async () => {
  if (!merchantId.value) return

  try {
    const response = await getMerchant({ id: merchantId.value })
    if (response.data.code === 1 && response.data.data) {
      merchantName.value = response.data.data.name || '未知商铺'
    }
  } catch (error) {
    console.error('获取商家信息出错:', error)
  }
}

// 获取特定商家的菜单
const fetchMenuByMerchant = async () => {
  if (!merchantId.value) {
    message.warning('商家ID不存在')
    return
  }

  loading.value = true
  try {
    const params = {
      merchantId: merchantId.value,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }

    // 构建搜索条件
    const searchBody: API.MenuQueryRequest = {
      merchantId: merchantId.value,
      name: searchForm.name,
      category: searchForm.category,
      status: searchForm.status,
      minPrice: searchForm.minPrice,
      maxPrice: searchForm.maxPrice,
    }

    const response = await getMenuByMerchant(params, searchBody)
    if (response.data.code === 1 && response.data.data) {
      menuList.value = response.data.data.records || []
      pagination.total = response.data.data.total || 0
    } else {
      message.error(response.data.msg || '获取商家菜单失败')
    }
  } catch (error) {
    console.error('获取商家菜单出错:', error)
    message.error('获取商家菜单失败')
  } finally {
    loading.value = false
  }
}

// 图片上传前检查
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
  }
  return isImage && isLt2M
}

// 处理图片上传
const handleUpload = async (options: { file: File }) => {
  const { file } = options
  uploadLoading.value = true

  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)

    // 调用上传接口
    const response = await uploadImage(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.code === 1 && response.data.data) {
      // 上传成功，设置图片URL
      menuForm.imageUrl = response.data.data
      message.success('图片上传成功')
    } else {
      message.error(response.data.msg || '图片上传失败')
    }
  } catch (error) {
    console.error('上传图片出错:', error)
    message.error('图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

// 删除已上传的图片
const removeImage = () => {
  menuForm.imageUrl = ''
}

// 添加或更新菜单项
const handleSaveMenu = async () => {
  try {
    await menuFormRef.value.validate()

    if (editingMenu.value && editingMenu.value.menuId) {
      // 更新现有菜单
      const updateData: API.MenuUpdateRequest = {
        menuId: editingMenu.value.menuId,
        merchantId: merchantId.value || undefined,
        name: menuForm.name,
        description: menuForm.description,
        price: menuForm.price,
        category: menuForm.category,
        imageUrl: menuForm.imageUrl,
        status: menuForm.status,
        sortOrder: menuForm.sortOrder,
      }

      const response = await updateMenu(updateData)
      if (response.data.code === 1) {
        message.success('菜单更新成功')
        modalVisible.value = false
        await fetchMenuByMerchant()
      } else {
        message.error(response.data.msg || '菜单更新失败')
      }
    } else {
      // 创建新菜单
      const createData: API.MenuCreateRequest = {
        merchantId: merchantId.value || '',
        name: menuForm.name,
        description: menuForm.description,
        price: menuForm.price,
        category: menuForm.category,
        imageUrl: menuForm.imageUrl,
        status: menuForm.status,
        sortOrder: menuForm.sortOrder,
      }

      const response = await createMenu(createData)
      if (response.data.code === 1) {
        message.success('菜单创建成功')
        modalVisible.value = false
        await fetchMenuByMerchant()
      } else {
        message.error(response.data.msg || '菜单创建失败')
      }
    }
  } catch (error) {
    console.error('保存菜单出错:', error)
  }
}

// 删除菜单项
const handleDeleteMenu = async (id: string) => {
  try {
    const response = await deleteMenu({ id })
    if (response.data.code === 1) {
      message.success('菜单删除成功')
      await fetchMenuByMerchant()
    } else {
      message.error(response.data.msg || '菜单删除失败')
    }
  } catch (error) {
    console.error('删除菜单出错:', error)
    message.error('删除菜单失败')
  }
}

// 编辑菜单项
const handleEditMenu = async (record: API.MenuVO) => {
  if (record.menuId) {
    try {
      const response = await getMenu({ id: record.menuId })
      if (response.data.code === 1 && response.data.data) {
        editingMenu.value = response.data.data

        // 设置表单值
        Object.assign(menuForm, {
          name: response.data.data.name,
          description: response.data.data.description,
          price: response.data.data.price,
          category: response.data.data.category,
          imageUrl: response.data.data.imageUrl,
          status: response.data.data.status,
          sortOrder: response.data.data.sortOrder,
        })

        modalVisible.value = true
      }
    } catch (error) {
      console.error('获取菜单详情出错:', error)
      message.error('获取菜单详情失败')
    }
  }
}

// 添加新菜单
const handleAddMenu = () => {
  editingMenu.value = null

  // 重置表单
  Object.assign(menuForm, {
    name: '',
    description: '',
    price: 0,
    category: categoryOptions[0].value,
    imageUrl: '',
    status: 'AVAILABLE',
    sortOrder: 0,
  })

  modalVisible.value = true
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchMenuByMerchant()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: undefined,
    category: undefined,
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  })
  pagination.current = 1
  fetchMenuByMerchant()
}

// 分页变化
const handleTableChange = (pag: API.PageMenuVO) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.size || 10
  fetchMenuByMerchant()
}

// 返回商铺列表
const goBack = () => {
  router.push('/merchant')
}

// 获取状态文本
const getStatusText = (status: string | undefined) => {
  const statusMap: Record<string, string> = {
    AVAILABLE: '可用',
    UNAVAILABLE: '不可用',
    SOLD_OUT: '售罄',
  }
  return status ? statusMap[status] || status : ''
}

// 获取状态颜色
const getStatusColor = (status: string | undefined) => {
  const colorMap: Record<string, string> = {
    AVAILABLE: 'green',
    UNAVAILABLE: 'red',
    SOLD_OUT: 'orange',
  }
  return status ? colorMap[status] || 'default' : 'default'
}

// 预览图片
const previewImage = (url: string) => {
  previewImageUrl.value = url
  previewVisible.value = true
}

// 初始加载
onMounted(() => {
  // 从路由参数获取商家ID
  const id = route.params.id
  if (id) {
    merchantId.value = id as string
    searchForm.merchantId = merchantId.value
    fetchMerchantInfo()
    fetchMenuByMerchant()
  } else {
    message.error('商家ID不存在，请返回商家列表')
    router.push('/merchant')
  }
})
</script>

<style scoped>
.menu-management {
  padding: 24px;
}

.search-form {
  margin-bottom: 24px;
}

.menu-image-container {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  margin: 0 auto;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s;
}

.menu-image:hover {
  transform: scale(1.05);
}

.menu-image-placeholder {
  color: #999;
  font-size: 12px;
  text-align: center;
}

.upload-container {
  display: flex;
  flex-direction: column;
}

.image-preview {
  position: relative;
  width: 104px;
  height: 104px;
  margin-bottom: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-actions {
  opacity: 1;
}
</style>
