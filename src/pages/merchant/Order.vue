<template>
  <div class="merchant-order-management">
    <a-card title="订单管理" :bordered="false">
      <!-- 搜索栏 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="订单状态">
          <a-select v-model:value="searchForm.status" style="width: 120px" placeholder="订单状态">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="PENDING">待处理</a-select-option>
            <a-select-option value="PROCESSING">处理中</a-select-option>
            <a-select-option value="DELIVERING">配送中</a-select-option>
            <a-select-option value="COMPLETED">已完成</a-select-option>
            <a-select-option value="CANCELLED">已取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付状态">
          <a-select v-model:value="searchForm.paymentStatus" style="width: 120px" placeholder="支付状态">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="UNPAID">未支付</a-select-option>
            <a-select-option value="PAID">已支付</a-select-option>
            <a-select-option value="REFUNDED">已退款</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="下单时间">
          <a-range-picker v-model:value="dateRange" @change="onDateChange" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchOrders">搜索</a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 订单表格 -->
      <a-table
        :columns="columns"
        :data-source="orderList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        rowKey="orderId"
      >
        <template #bodyCell="{ column, record }">
          <!-- 订单号列 -->
          <template v-if="column.dataIndex === 'orderNumber'">
            <a @click="showOrderDetail(record)">{{ record.orderNumber }}</a>
          </template>

          <!-- 状态列 -->
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>

          <!-- 支付状态列 -->
          <template v-if="column.dataIndex === 'paymentStatus'">
            <a-tag :color="getPaymentStatusColor(record.paymentStatus)">{{ getPaymentStatusText(record.paymentStatus) }}</a-tag>
          </template>

          <!-- 操作列 -->
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showOrderDetail(record)">查看</a-button>

              <!-- 根据订单状态显示不同操作按钮 -->
              <template v-if="record.status === 'PENDING' && record.paymentStatus === 'PAID'">
                <a-button type="link" size="small" @click="updateStatus(record, 'PROCESSING')">接单</a-button>
              </template>

              <template v-if="record.status === 'PROCESSING'">
                <a-button type="link" size="small" @click="updateStatus(record, 'DELIVERING')">配送</a-button>
              </template>

              <template v-if="record.status === 'DELIVERING'">
                <a-button type="link" size="small" @click="updateStatus(record, 'COMPLETED')">完成</a-button>
              </template>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 订单详情弹窗 -->
      <a-modal v-model:visible="detailVisible" title="订单详情" :footer="null" width="700px">
        <template v-if="currentOrder">
          <a-descriptions bordered>
            <a-descriptions-item label="订单号" span="3">{{ currentOrder.orderNumber }}</a-descriptions-item>
            <a-descriptions-item label="下单时间" span="3">{{ currentOrder.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="订单状态">{{ getStatusText(currentOrder.status) }}</a-descriptions-item>
            <a-descriptions-item label="支付状态">{{ getPaymentStatusText(currentOrder.paymentStatus) }}</a-descriptions-item>
            <a-descriptions-item label="支付方式">{{ currentOrder.paymentMethod || '未支付' }}</a-descriptions-item>
            <a-descriptions-item label="收货地址" span="3">{{ currentOrder.address }}</a-descriptions-item>
            <a-descriptions-item label="联系电话">{{ currentOrder.phone }}</a-descriptions-item>
            <a-descriptions-item label="订单金额">{{ currentOrder.totalAmount }} 元</a-descriptions-item>
            <a-descriptions-item label="配送费">{{ currentOrder.deliveryFee || 0 }} 元</a-descriptions-item>
            <a-descriptions-item label="备注" span="3">{{ currentOrder.remark || '无' }}</a-descriptions-item>
          </a-descriptions>

          <div style="margin-top: 20px; text-align: right;">
            <template v-if="currentOrder.status === 'PENDING' && currentOrder.paymentStatus === 'PAID'">
              <a-button type="primary" @click="updateStatus(currentOrder, 'PROCESSING')">接单</a-button>
            </template>

            <template v-if="currentOrder.status === 'PROCESSING'">
              <a-button type="primary" @click="updateStatus(currentOrder, 'DELIVERING')">配送</a-button>
            </template>

            <template v-if="currentOrder.status === 'DELIVERING'">
              <a-button type="primary" @click="updateStatus(currentOrder, 'COMPLETED')">完成</a-button>
            </template>

            <a-button style="margin-left: 8px" @click="detailVisible = false">关闭</a-button>
          </div>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
// import { getOrderList, getOrderDetail, updateOrderStatus } from '@/api/orderController';
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import type { Dayjs } from 'dayjs';

const userInfoStore = useUserInfoStore();

// 搜索表单数据
const searchForm = reactive({
  status: '',
  paymentStatus: '',
  merchantId: undefined, // 这个值会从用户信息中获取
  startTime: '',
  endTime: ''
});

// 日期范围
const dateRange = ref<[Dayjs, Dayjs] | null>(null);

// 列表数据
const orderList = ref<API.OrderVO[]>([]); // 暂时使用空数组
const loading = ref<boolean>(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条数据`
});

// 详情数据
const detailVisible = ref<boolean>(false);
const currentOrder = ref<API.OrderVO | null>(null);

// 表格列定义
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    sorter: true
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    filters: [
      { text: '待处理', value: 'PENDING' },
      { text: '处理中', value: 'PROCESSING' },
      { text: '配送中', value: 'DELIVERING' },
      { text: '已完成', value: 'COMPLETED' },
      { text: '已取消', value: 'CANCELLED' }
    ]
  },
  {
    title: '支付状态',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
    filters: [
      { text: '未支付', value: 'UNPAID' },
      { text: '已支付', value: 'PAID' },
      { text: '已退款', value: 'REFUNDED' }
    ]
  },
  {
    title: '收货地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 200
  }
];

// 获取当前用户的商户ID
const getMerchantId = () => {
  // 从store中获取当前登录用户的merchantId
  return userInfoStore.userInfo.merchantId;
};

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true;
  try {
    // 暂时注释掉API调用
    // const params = {
    //   pageNum: pagination.current,
    //   pageSize: pagination.pageSize
    // };
    // const queryParams = {
    //   ...searchForm,
    //   merchantId: getMerchantId()
    // };
    // const res = await getOrderList(params, queryParams);
    // if (res.data.code === 20000 && res.data.data) {
    //   orderList.value = res.data.data.records || [];
    //   pagination.total = res.data.data.total || 0;
    // } else {
    //   message.error(res.data.msg || '获取订单列表失败');
    // }

    // 使用空数据
    orderList.value = [];
    pagination.total = 0;
  } catch (error) {
    console.error('获取订单列表出错:', error);
    message.error('获取订单列表出错');
  } finally {
    loading.value = false;
  }
};

// 搜索订单
const searchOrders = () => {
  pagination.current = 1;
  fetchOrderList();
};

// 重置搜索条件
const resetSearch = () => {
  searchForm.status = '';
  searchForm.paymentStatus = '';
  searchForm.startTime = '';
  searchForm.endTime = '';
  dateRange.value = null;
  pagination.current = 1;
  fetchOrderList();
};

// 日期变更
const onDateChange = (dates: [Dayjs, Dayjs] | null) => {
  if (dates) {
    searchForm.startTime = dates[0].format('YYYY-MM-DD HH:mm:ss');
    searchForm.endTime = dates[1].format('YYYY-MM-DD HH:mm:ss');
  } else {
    searchForm.startTime = '';
    searchForm.endTime = '';
  }
};

// 表格变更事件（排序、筛选、分页）
const handleTableChange = (pag: any, filters: any, sorter: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;

  // 处理过滤
  if (filters.status && filters.status.length) {
    searchForm.status = filters.status[0];
  }

  if (filters.paymentStatus && filters.paymentStatus.length) {
    searchForm.paymentStatus = filters.paymentStatus[0];
  }

  // 处理排序
  // 这里可以根据后端API支持的排序字段进行排序

  fetchOrderList();
};

// 查看订单详情
const showOrderDetail = async (order: API.OrderVO) => {
  try {
    // 暂时注释掉API调用
    // const res = await getOrderDetail(order.orderId);
    // if (res.data.code === 20000 && res.data.data) {
    //   currentOrder.value = res.data.data;
    //   detailVisible.value = true;
    // } else {
    //   message.error(res.data.msg || '获取订单详情失败');
    // }

    // 使用当前订单数据
    currentOrder.value = order;
    detailVisible.value = true;
  } catch (error) {
    console.error('获取订单详情出错:', error);
    message.error('获取订单详情出错');
  }
};

// 更新订单状态
const updateStatus = async (order: API.OrderVO, newStatus: string) => {
  try {
    // 暂时注释掉API调用
    // const res = await updateOrderStatus({
    //   orderId: order.orderId,
    //   status: newStatus
    // });
    // if (res.data.code === 20000) {
    //   message.success('订单状态更新成功');
    //   fetchOrderList();
    //   if (detailVisible.value) {
    //     detailVisible.value = false;
    //   }
    // } else {
    //   message.error(res.data.msg || '订单状态更新失败');
    // }

    message.success('订单状态更新成功');
    fetchOrderList();
    if (detailVisible.value) {
      detailVisible.value = false;
    }
  } catch (error) {
    console.error('更新订单状态出错:', error);
    message.error('更新订单状态出错');
  }
};

// 获取状态文本
const getStatusText = (status: string | undefined) => {
  if (!status) return '未知';
  const statusMap: Record<string, string> = {
    'PENDING': '待处理',
    'PROCESSING': '处理中',
    'DELIVERING': '配送中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

// 获取状态颜色
const getStatusColor = (status: string | undefined) => {
  if (!status) return 'default';
  const colorMap: Record<string, string> = {
    'PENDING': 'orange',
    'PROCESSING': 'blue',
    'DELIVERING': 'purple',
    'COMPLETED': 'green',
    'CANCELLED': 'red'
  };
  return colorMap[status] || 'default';
};

// 获取支付状态文本
const getPaymentStatusText = (status: string | undefined) => {
  if (!status) return '未知';
  const statusMap: Record<string, string> = {
    'UNPAID': '未支付',
    'PAID': '已支付',
    'REFUNDED': '已退款'
  };
  return statusMap[status] || status;
};

// 获取支付状态颜色
const getPaymentStatusColor = (status: string | undefined) => {
  if (!status) return 'default';
  const colorMap: Record<string, string> = {
    'UNPAID': 'red',
    'PAID': 'green',
    'REFUNDED': 'gray'
  };
  return colorMap[status] || 'default';
};

// 页面加载时获取订单列表
onMounted(() => {
  searchForm.merchantId = getMerchantId();
  fetchOrderList();
});
</script>

<style scoped>
.merchant-order-management {
  padding: 24px;
}
</style>
