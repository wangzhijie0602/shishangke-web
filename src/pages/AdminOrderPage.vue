<template>
  <div class="admin-order-management">
    <a-card title="订单管理" :bordered="false">
      <!-- 搜索栏 -->
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="商户">
          <a-select
            v-model:value="searchForm.merchantId"
            style="width: 200px"
            placeholder="选择商户"
            allowClear
            :options="merchantOptions"
            :fieldNames="{ label: 'name', value: 'id' }"
            :filterOption="filterMerchantOption"
            showSearch
          />
        </a-form-item>
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
          <!-- 商户名称列 -->
          <template v-if="column.dataIndex === 'merchantName'">
            <a @click="viewMerchant(record.merchantId)">{{ record.merchantName }}</a>
          </template>

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
              <a-popconfirm
                title="确定要删除此订单吗?"
                @confirm="deleteOrderItem(record)"
                okText="确定"
                cancelText="取消"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 订单详情弹窗 -->
      <a-modal v-model:visible="detailVisible" title="订单详情" :footer="null" width="700px">
        <template v-if="currentOrder">
          <a-descriptions bordered>
            <a-descriptions-item label="订单号" span="3">{{ currentOrder.orderNumber }}</a-descriptions-item>
            <a-descriptions-item label="商户名称">{{ currentOrder.merchantName }}</a-descriptions-item>
            <a-descriptions-item label="下单时间" span="2">{{ currentOrder.createdAt }}</a-descriptions-item>
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
            <a-popconfirm
              title="确定要删除此订单吗?"
              @confirm="deleteOrderItem(currentOrder)"
              okText="确定"
              cancelText="取消"
            >
              <a-button danger>删除订单</a-button>
            </a-popconfirm>
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
import { useRouter } from 'vue-router';
import { getOrderList, getOrderDetail, deleteOrder } from '@/api/orderController';
import { getMerchantList1 } from '@/api/adminController';
import type { Dayjs } from 'dayjs';

const router = useRouter();

// 搜索表单数据
const searchForm = reactive({
  status: '',
  paymentStatus: '',
  merchantId: undefined,
  startTime: '',
  endTime: ''
});

// 日期范围
const dateRange = ref<[Dayjs, Dayjs] | null>(null);

// 列表数据
const orderList = ref<API.OrderVO[]>([]);
const loading = ref<boolean>(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条数据`
});

// 商户数据
const merchantOptions = ref<API.MerchantVO[]>([]);

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
    title: '商户名称',
    dataIndex: 'merchantName',
    key: 'merchantName',
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
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 150
  }
];

// 获取订单列表
const fetchOrderList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    };

    const queryParams = { ...searchForm };

    const res = await getOrderList(params, queryParams);
    if (res.data.code === 1 && res.data.data) {
      orderList.value = res.data.data.records || [];
      pagination.total = res.data.data.total || 0;
    } else {
      message.error(res.data.msg || '获取订单列表失败');
    }
  } catch (error) {
    console.error('获取订单列表出错:', error);
    message.error('获取订单列表出错');
  } finally {
    loading.value = false;
  }
};

// 获取商户列表
const fetchMerchantList = async () => {
  try {
    const params = {
      pageNum: 1,
      pageSize: 100 // 获取更多商户
    };

    const res = await getMerchantList1(params, {});
    if (res.data.code === 1 && res.data.data) {
      merchantOptions.value = res.data.data.records || [];
    } else {
      message.error(res.data.msg || '获取商户列表失败');
    }
  } catch (error) {
    console.error('获取商户列表出错:', error);
    message.error('获取商户列表出错');
  }
};

// 商户选择筛选
const filterMerchantOption = (input: string, option: any) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
  searchForm.merchantId = undefined;
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
    const res = await getOrderDetail({ id: order.orderId as number });
    if (res.data.code === 1 && res.data.data) {
      currentOrder.value = res.data.data;
      detailVisible.value = true;
    } else {
      message.error(res.data.msg || '获取订单详情失败');
    }
  } catch (error) {
    console.error('获取订单详情出错:', error);
    message.error('获取订单详情出错');
  }
};

// 删除订单
const deleteOrderItem = async (order: API.OrderVO) => {
  try {
    const res = await deleteOrder({ id: order.orderId as number });
    if (res.data.code === 1) {
      message.success('订单删除成功');

      // 如果当前正在查看该订单详情，则关闭弹窗
      if (detailVisible.value && currentOrder.value && currentOrder.value.orderId === order.orderId) {
        detailVisible.value = false;
      }

      // 刷新订单列表
      fetchOrderList();
    } else {
      message.error(res.data.msg || '订单删除失败');
    }
  } catch (error) {
    console.error('删除订单出错:', error);
    message.error('删除订单出错');
  }
};

// 查看商户详情
const viewMerchant = (merchantId: number | undefined) => {
  if (merchantId) {
    router.push(`/admin/merchant/${merchantId}`);
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

// 页面加载时获取数据
onMounted(() => {
  fetchMerchantList();
  fetchOrderList();
});
</script>

<style scoped>
.admin-order-management {
  padding: 24px;
}
</style>