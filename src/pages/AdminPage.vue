<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShopOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 模拟统计数据
const statistics = ref({
  merchantCount: 128,
  userCount: 1024,
  orderCount: 5280,
})

// 模拟最近活动
const recentActivities = ref([
  {
    time: '2023-12-01 14:30',
    content: '管理员批准了新的店铺申请',
  },
  {
    time: '2023-12-01 13:45',
    content: '用户投诉了订单#12345的配送问题',
  },
  {
    time: '2023-12-01 10:20',
    content: '系统自动生成了月度报表',
  },
  {
    time: '2023-11-30 16:50',
    content: '管理员处理了退款申请',
  },
])

onMounted(() => {
  // 在真实项目中，可以在这里加载统计数据和最近活动
})
</script>

<template>
  <div class="admin-container">
    <a-card title="管理员控制台" :bordered="false" class="admin-card">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-card
            class="module-card"
            :bordered="false"
            @click="router.push('/admin/merchant')"
          >
            <template #cover>
              <div class="card-cover">
                <shop-outlined />
              </div>
            </template>
            <a-card-meta title="店铺管理">
              <template #description>管理平台所有店铺信息，包括审核、编辑和删除操作</template>
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            class="module-card"
            :bordered="false"
            @click="router.push('/admin/user')"
          >
            <template #cover>
              <div class="card-cover">
                <user-outlined />
              </div>
            </template>
            <a-card-meta title="用户管理">
              <template #description>管理平台用户，包括封禁、解封和删除用户</template>
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            class="module-card"
            :bordered="false"
            @click="router.push('/admin/order')"
          >
            <template #cover>
              <div class="card-cover">
                <shopping-cart-outlined />
              </div>
            </template>
            <a-card-meta title="订单管理">
              <template #description>查看和管理所有订单，处理退款和投诉</template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>

      <a-divider />

      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="系统概览" :bordered="false" class="stat-card">
            <div class="statistics-wrapper">
              <div class="stat-item">
                <a-statistic
                  title="总店铺数"
                  :value="statistics.merchantCount"
                  :precision="0"
                >
                  <template #prefix>
                    <shop-outlined />
                  </template>
                </a-statistic>
              </div>
              <div class="stat-item">
                <a-statistic
                  title="总用户数"
                  :value="statistics.userCount"
                  :precision="0"
                >
                  <template #prefix>
                    <user-outlined />
                  </template>
                </a-statistic>
              </div>
              <div class="stat-item">
                <a-statistic
                  title="总订单数"
                  :value="statistics.orderCount"
                  :precision="0"
                >
                  <template #prefix>
                    <shopping-cart-outlined />
                  </template>
                </a-statistic>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="最近活动" :bordered="false" class="activity-card">
            <a-timeline>
              <a-timeline-item v-for="(item, index) in recentActivities" :key="index">
                {{ item.time }} - {{ item.content }}
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 16px;
}

.admin-card {
  margin-bottom: 24px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.module-card {
  height: 220px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}

.module-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.card-cover {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1890ff;
  color: #fff;
  font-size: 48px;
}

.stat-card {
  height: 100%;
}

.statistics-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-card {
  height: 100%;
  overflow-y: auto;
}

.stat-item {
  margin-bottom: 16px;
}
</style>
