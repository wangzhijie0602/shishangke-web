<template>
  <div class="merchant-detail-container">
    <a-card title="店铺详情" :bordered="false" class="detail-card">
      <a-form :model="form" @submit="handleSubmit" :rules="rules" layout="vertical">
        <a-divider orientation="left">基础信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="店铺ID" name="id">
              <a-input v-model:value="form.id" disabled />
            </a-form-item>
            <a-form-item label="店铺名称" name="name" required>
              <a-input v-model:value="form.name" placeholder="请输入店铺名称" />
            </a-form-item>
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店铺Logo" name="logo" class="logo-upload-container">
              <div class="logo-preview" v-if="form.logo">
                <img :src="form.logo" alt="店铺Logo" />
                <div class="logo-actions">
                  <a-button type="primary" size="small" @click="handleViewLogo">
                    <template #icon>
                      <EyeOutlined />
                    </template>
                    预览
                  </a-button>
                  <a-button danger size="small" @click="handleRemoveLogo">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                    删除
                  </a-button>
                </div>
              </div>
              <a-upload
                v-else
                name="logo"
                list-type="picture-card"
                class="logo-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleLogoChange"
              >
                <div v-if="uploading">
                  <a-spin />
                </div>
                <div v-else class="upload-placeholder">
                  <PlusOutlined />
                  <div class="ant-upload-text">上传Logo</div>
                </div>
              </a-upload>
              <div class="upload-hint">建议尺寸: 200px x 200px, 支持jpg、png格式</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">地址信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="所在地区" name="province" required>
              <a-spin :spinning="regionLoading" tip="加载地区数据中...">
                <area-cascader
                  type="street"
                  :value="areaValue"
                  placeholder="请选择省/市/区/街道"
                  :onChange="handleAreaChange"
                  style="width: 100%"
                />
              </a-spin>
              <div
                class="address-preview"
                v-if="form.province || form.city || form.district || form.street"
              >
                当前选择: {{ form.province }} {{ form.city }} {{ form.district }} {{ form.street }}
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详细地址" name="addressDetail">
              <a-textarea
                v-model:value="form.addressDetail"
                :rows="2"
                placeholder="请输入详细地址，如街道名称、门牌号等"
                show-count
                :maxlength="100"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">营业信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="营业开始时间" name="openTime">
              <a-time-picker
                v-model:value="form.openTime"
                format="HH:mm"
                placeholder="请选择营业开始时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="营业结束时间" name="closeTime">
              <a-time-picker
                v-model:value="form.closeTime"
                format="HH:mm"
                placeholder="请选择营业结束时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">其他信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="店铺描述" name="description">
              <a-textarea
                v-model:value="form.description"
                :rows="4"
                placeholder="请输入店铺详细描述"
                show-count
                :maxlength="500"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低起送价" name="minPrice">
              <a-input-number
                v-model:value="form.minPrice"
                :min="0"
                placeholder="请输入最低起送价"
                style="width: 100%"
                addon-after="元"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店铺状态" name="status">
              <a-select v-model:value="form.status" placeholder="请选择状态">
                <a-select-option value="ENABLED">正常营业</a-select-option>
                <a-select-option value="DISABLED">暂停营业</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />
        <div class="form-actions">
          <a-button type="primary" html-type="submit" size="large">
            <template #icon>
              <SaveOutlined />
            </template>
            保存修改
          </a-button>
          <a-button size="large" @click="handleCancel" style="margin-left: 16px">
            <template #icon>
              <RollbackOutlined />
            </template>
            返回
          </a-button>
        </div>
      </a-form>
    </a-card>

    <!-- Logo预览弹窗 -->
    <a-modal v-model:visible="previewVisible" title="Logo预览" footer="{null}" centered>
      <img alt="Logo预览" style="width: 100%" :src="form.logo" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { getMerchant, update } from '@/api/merchantController'
import {
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import type { AreaItemType } from '@/components/AreaCascader'

const router = useRouter()
const route = useRoute()

const form = ref<API.MerchantVO>({})
const uploading = ref(false)
const previewVisible = ref(false)
const regionLoading = ref(false)

// 计算地址选择器的值
const areaValue = computed(() => {
  const { province, city, district, street } = form.value
  return [province, city, district, street].filter(Boolean)
})

// 处理地址选择器变化
const handleAreaChange = (values?: string[], options?: AreaItemType[]) => {
  if (values && values.length > 0) {
    form.value.province = values[0] || ''
    form.value.city = values.length > 1 ? values[1] : ''
    form.value.district = values.length > 2 ? values[2] : ''
    form.value.street = values.length > 3 ? values[3] : ''

    // 如果有区级数据，获取区级的地区码
    if (options && options.length > 2 && options[2]) {
      // 存储区域编码，如果需要可以添加到form中
      const areaCode = options[2].code
      console.log('区域编码:', areaCode)
    }
  } else {
    form.value.province = ''
    form.value.city = ''
    form.value.district = ''
    form.value.street = ''
  }
}

const rules = {
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  province: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
  addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

onMounted(async () => {
  regionLoading.value = true

  const merchantId = route.params.id as string
  try {
    const res = await getMerchant({ id: merchantId })
    if (res.data.code === 1) {
      const merchantData = res.data.data || {}
      form.value = {
        ...merchantData,
        openTime: merchantData?.openTime,
        closeTime: merchantData?.closeTime,
      }
    } else {
      message.error('获取店铺信息失败')
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    message.error('网络异常，请重试')
  } finally {
    regionLoading.value = false
  }
})

const handleSubmit = async () => {
  // 验证地区是否已选择
  if (!form.value.province) {
    message.error('请选择所在地区')
    return
  }

  try {
    const res = await update(form.value)
    if (res.data.code === 1) {
      message.success('店铺信息更新成功')
      router.back()
    } else {
      message.error(res.data.msg || '更新失败')
    }
  } catch (error) {
    console.error('更新店铺信息失败:', error)
    message.error('网络异常，请重试')
  }
}

const handleCancel = () => {
  router.back()
}

// Logo上传相关方法
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
  }
  return isJpgOrPng && isLt2M
}

interface UploadChangeInfo {
  file: {
    status: string
    originFileObj: File
  }
}

const handleLogoChange = (info: UploadChangeInfo) => {
  if (info.file.status === 'uploading') {
    uploading.value = true
    return
  }

  if (info.file.status === 'done') {
    // 这里模拟上传成功后获取到的URL
    // 实际项目中应该从上传接口的响应中获取URL
    getBase64(info.file.originFileObj, (url: string) => {
      uploading.value = false
      form.value.logo = url
    })
  } else if (info.file.status === 'error') {
    uploading.value = false
    message.error('上传失败')
  }
}

const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const handleViewLogo = () => {
  previewVisible.value = true
}

const handleRemoveLogo = () => {
  form.value.logo = ''
}
</script>

<style scoped>
.merchant-detail-container {
  padding: 0 16px;
}

.detail-card {
  margin-bottom: 24px;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.logo-upload-container {
  display: flex;
  flex-direction: column;
}

.logo-uploader {
  width: 200px;
  height: 200px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  padding: 8px;
  gap: 8px;
}

.upload-hint {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

:deep(.ant-divider-inner-text) {
  font-weight: bold;
  color: #1890ff;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-cascader-menu) {
  height: 300px;
}

.address-preview {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.empty-content {
  text-align: center;
  padding: 20px 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>
