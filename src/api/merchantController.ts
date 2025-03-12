// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 GET /api/v1/merchant/${param0}/delete */
export async function deleteUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/delete`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/merchant/${param0}/get */
export async function getMerchant(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultMerchantVO>(`/api/v1/merchant/${param0}/get`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/create */
export async function create(body: API.MerchantCreateRequest, options?: { [key: string]: any }) {
  return request<API.ResultLong>('/api/v1/merchant/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/list */
export async function getMerchantList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantListParams,
  body: API.MerchantQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantVO>('/api/v1/merchant/list', {
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

/** 此处后端没有提供注释 POST /api/v1/merchant/update */
export async function update(body: API.MerchantUpdateRequest, options?: { [key: string]: any }) {
  return request<API.ResultString>('/api/v1/merchant/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
