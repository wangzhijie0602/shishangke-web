<template>
  <a-card title="店铺详情" :bordered="false">
    <a-form :model="form" @submit="handleSubmit" :rules="rules">
      <a-row :gutter="16">
        <!-- 基础信息 -->
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
          <a-form-item label="Logo地址" name="logo">
            <a-input v-model:value="form.logo" placeholder="请输入Logo图片地址" />
          </a-form-item>
        </a-col>

        <!-- 地址信息 -->
        <a-col :span="12">
          <a-form-item label="省份" name="province">
            <a-input v-model:value="form.province" placeholder="请输入省份" />
          </a-form-item>
          <a-form-item label="城市" name="city">
            <a-input v-model:value="form.city" placeholder="请输入城市" />
          </a-form-item>
          <a-form-item label="区/县" name="district">
            <a-input v-model:value="form.district" placeholder="请输入区/县" />
          </a-form-item>
          <a-form-item label="详细地址" name="addressDetail">
            <a-input v-model:value="form.addressDetail" placeholder="请输入详细地址" />
          </a-form-item>
        </a-col>

        <!-- 营业信息 -->
        <a-col :span="24">
          <a-row>
            <a-col :span="12">
              <a-form-item label="营业开始时间" name="openTime">
                <a-time-picker
                  v-model:value="form.openTime"
                  format="HH:mm"
                  placeholder="请选择营业开始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="营业结束时间" name="closeTime">
                <a-time-picker
                  v-model:value="form.closeTime"
                  format="HH:mm"
                  placeholder="请选择营业结束时间"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>

        <!-- 描述与价格 -->
        <a-form-item label="店铺描述" name="description">
          <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入店铺详细描述" />
        </a-form-item>
        <a-form-item label="最低起送价" name="minPrice">
          <a-input-number v-model:value="form.minPrice" :min="0" placeholder="请输入最低起送价" />
        </a-form-item>

        <!-- 状态 -->
        <a-form-item label="店铺状态" name="status">
          <a-select v-model:value="form.status" placeholder="请选择状态">
            <a-select-option value="ENABLED">正常</a-select-option>
            <a-select-option value="DISABLED">停用</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 操作按钮 -->
        <a-form-item>
          <a-button type="primary" html-type="submit">保存修改</a-button>
          <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { getMerchant, update } from '@/api/merchantController'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const form = ref(<API.MerchantVO>{})

const rules = {
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

onMounted(async () => {
  const merchantId = route.params.id as string
  try {
    const res = await getMerchant({ id: merchantId })
    if (res.data.code === 1) {
      const merchantData = res.data.data
      form.value = {
        ...merchantData,
        openTime: merchantData.openTime,
        closeTime: merchantData.closeTime,
      }
    } else {
      message.error('获取店铺信息失败')
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    message.error('网络异常，请重试')
  }
})

const handleSubmit = async () => {
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
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 24px;
}
</style>
