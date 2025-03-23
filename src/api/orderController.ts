// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 GET /api/v1/order/${param0} */
export async function getOrderDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderDetailParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultOrderVO>(`/api/v1/order/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/order/${param0}/cancel */
export async function cancelOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelOrderParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/order/${param0}/cancel`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/order/${param0}/delete */
export async function deleteOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteOrderParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/order/${param0}/delete`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/order/${param0}/pay */
export async function payOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payOrderParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/order/${param0}/pay`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/order/${param0}/update-status */
export async function updateOrderStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateOrderStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/order/${param0}/update-status`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/order/create */
export async function createOrder(body: API.OrderCreateRequest, options?: { [key: string]: any }) {
  return request<API.ResultLong>('/api/v1/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/order/list */
export async function getOrderList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderListParams,
  body: API.OrderQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageOrderVO>('/api/v1/order/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      // pageNum has a default value: 1
      pageNum: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    data: body,
    ...(options || {}),
  })
}
