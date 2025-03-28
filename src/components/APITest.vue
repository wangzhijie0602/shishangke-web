<script setup lang="ts">
import { orderCreateOrder } from '@/api/orderController.ts'

const handleCreateOrder = async () => {
  try {
    const result = await orderCreateOrder({
      orderRequest: {
        customerId: '1901634638707740674',
        merchantId: '1898738248295518210',
        receiverName: '张三',
        receiverPhone: '13800138000',
        receiverAddress: '北京市朝阳区xxx街道',
        remark: '测试订单'
      },
      orderItemRequests: [
        {
          menuId: '1',
          quantity: 1
        },
        {
          menuId: '3',
          quantity: 1
        }
      ]
    })
    console.log('创建订单成功:', result)
  } catch (error) {
    console.error('创建订单失败:', error)
  }
}
</script>

<template>
  <div class="api-test">
    <el-button type="primary" @click="handleCreateOrder">创建订单</el-button>
  </div>
</template>

<style scoped>
.api-test {
  padding: 20px;
}
</style>
