<template>
  <div class="merchant-detail-container">
    <a-card title="店铺详情（管理员）" :bordered="false" class="detail-card">
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
              <div v-else class="logo-upload-btn">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  style="display: none"
                  ref="logoInput"
                  @change="handleLogoChange"
                />
                <a-button type="dashed" @click="logoInput?.click()" :loading="uploading">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  上传Logo
                </a-button>
                <div class="upload-hint">建议尺寸: 200px x 200px, 支持jpg、png格式</div>
              </div>
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
                <a-select-option value="OPEN">营业中</a-select-option>
                <a-select-option value="CLOSED">休息中</a-select-option>
                <a-select-option value="SUSPENDED">暂停营业</a-select-option>
                <a-select-option value="PENDING_REVIEW">待审核</a-select-option>
                <a-select-option value="REJECTED">审核拒绝</a-select-option>
                <a-select-option value="BANNED">已封禁</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />
        <div class="form-actions">
          <a-button type="primary" html-type="submit" size="large" :loading="submitLoading">
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
    <a-modal v-model:open="previewVisible" title="Logo预览" :footer="null" centered>
      <img alt="Logo预览" style="width: 100%" :src="form.logo" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  merchantGet,
  merchantUpdateName,
  merchantUpdatePhone,
  merchantUpdateAddress,
  merchantUpdateBusinesshours,
  merchantUpdateDescription,
  merchantUpdateLogo,
  merchantUpdateMinprice,
  merchantUpdateStatus,
} from '@/api/merchantController'
import {
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import type { AreaItemType } from '@/components/AreaCascader'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 扩展API.MerchantVO类型以支持Date类型的时间
interface MerchantForm extends Omit<API.MerchantVO, 'openTime' | 'closeTime'> {
  openTime?: dayjs.Dayjs | null
  closeTime?: dayjs.Dayjs | null
}

const form = ref<MerchantForm>({})
const uploading = ref(false)
const previewVisible = ref(false)
const regionLoading = ref(false)
const submitLoading = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

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
    const res = await merchantGet({ id: merchantId })
    if (res.data.code === 20000) {
      const merchantData = res.data.data || {}

      // 使用dayjs处理时间格式
      const openTime = merchantData?.openTime ? dayjs(merchantData.openTime, 'HH:mm:ss') : undefined
      const closeTime = merchantData?.closeTime
        ? dayjs(merchantData.closeTime, 'HH:mm:ss')
        : undefined

      form.value = {
        ...merchantData,
        openTime,
        closeTime,
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

  submitLoading.value = true
  try {
    // 分别调用不同的更新API
    const merchantId = form.value.id
    const promises = []

    // 更新名称
    promises.push(
      merchantUpdateName({
        id: merchantId || '',
        name: form.value.name || '',
      }),
    )

    // 更新电话
    promises.push(
      merchantUpdatePhone({
        id: merchantId || '',
        phone: form.value.phone || '',
      }),
    )

    // 更新地址
    promises.push(
      merchantUpdateAddress({
        id: merchantId || '',
        province: form.value.province || '',
        city: form.value.city || '',
        district: form.value.district || '',
        street: form.value.street || '',
        addressDetail: form.value.addressDetail || '',
      }),
    )

    // 更新营业时间 - 转换为字符串格式
    if (form.value.openTime && form.value.closeTime) {
      const openTimeStr = form.value.openTime.format('HH:mm:ss')
      const closeTimeStr = form.value.closeTime.format('HH:mm:ss')

      promises.push(
        merchantUpdateBusinesshours({
          id: merchantId || '',
          openTime: openTimeStr,
          closeTime: closeTimeStr,
        }),
      )
    }

    // 更新描述
    promises.push(
      merchantUpdateDescription({
        id: merchantId || '',
        description: form.value.description || '',
      }),
    )

    // 更新最低价格
    promises.push(
      merchantUpdateMinprice({
        id: merchantId || '',
        minPrice: form.value.minPrice || 0,
      }),
    )

    // 更新Logo
    if (form.value.logo) {
      promises.push(
        merchantUpdateLogo(
          {
            id: merchantId || '',
          },
          {},
        ),
      )
    }

    // 更新状态
    promises.push(
      merchantUpdateStatus({
        id: merchantId || '',
        status: form.value.status || 'OPEN',
      }),
    )

    await Promise.all(promises)
    message.success('店铺信息更新成功')
    await router.push('/admin/merchant')
  } catch (error) {
    console.error('更新店铺信息失败:', error)
    message.error('网络异常，请重试')
  } finally {
    submitLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/merchant')
}

// Logo上传相关方法
const handleLogoChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  // 验证文件类型和大小
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式的图片!')
    return
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
    return
  }

  uploading.value = true
  try {
    const merchantId = form.value.id
    if (!merchantId) {
      message.error('店铺ID不能为空')
      return
    }

    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)

    // 调用更新logo接口
    const res = await merchantUpdateLogo(
      {
        id: merchantId,
      },
      {},
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      },
    )

    if (res.data.code === 20000) {
      // 更新成功后直接重新获取店铺信息
      const refreshRes = await merchantGet({ id: merchantId })
      if (refreshRes.data.code === 20000 && refreshRes.data.data) {
        form.value.logo = refreshRes.data.data.logo
        message.success('Logo更新成功')
      }
    } else {
      message.error(res.data.msg || 'Logo更新失败')
    }
  } catch (error) {
    console.error('Logo更新失败:', error)
    message.error('网络异常，请重试')
  } finally {
    uploading.value = false
    // 重置input，确保可以重复选择同一个文件
    if (logoInput.value) {
      logoInput.value.value = ''
    }
  }
}

const handleViewLogo = () => {
  previewVisible.value = true
}

const handleRemoveLogo = async () => {
  try {
    const merchantId = form.value.id
    if (!merchantId) {
      message.error('店铺ID不能为空')
      return
    }

    // 调用更新logo接口，传入空文件表示删除logo
    const res = await merchantUpdateLogo(
      {
        id: merchantId.toString(),
      },
      {},
      {},
    )

    if (res.data.code === 20000) {
      form.value.logo = ''
      message.success('Logo删除成功')
    } else {
      message.error(res.data.msg || 'Logo删除失败')
    }
  } catch (error) {
    console.error('Logo删除失败:', error)
    message.error('网络异常，请重试')
  }
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

.logo-upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 200px;
  height: 200px;
  padding: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  justify-content: center;
}

.logo-upload-btn .ant-btn {
  height: 40px;
  width: 100%;
}
</style>
