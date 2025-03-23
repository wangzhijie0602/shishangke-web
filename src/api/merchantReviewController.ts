// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 GET /api/v1/merchant-review/${param0} */
export async function getReview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultMerchantReviewVO>(`/api/v1/merchant-review/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/merchant-review/${param0}/delete */
export async function deleteReview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteReviewParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant-review/${param0}/delete`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant-review/create */
export async function createReview(
  body: API.MerchantReviewCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>('/api/v1/merchant-review/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant-review/list */
export async function getReviewList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewListParams,
  body: API.MerchantReviewQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantReviewVO>('/api/v1/merchant-review/list', {
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

/** 此处后端没有提供注释 GET /api/v1/merchant-review/merchant/${param0} */
export async function getMerchantReviews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMerchantReviewsParams,
  options?: { [key: string]: any }
) {
  const { merchantId: param0, ...queryParams } = params
  return request<API.ResultPageMerchantReviewVO>(`/api/v1/merchant-review/merchant/${param0}`, {
    method: 'GET',
    params: {
      // pageNum has a default value: 1
      pageNum: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant-review/update */
export async function updateReview(
  body: API.MerchantReviewUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/merchant-review/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/merchant-review/user */
export async function getUserReviews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserReviewsParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMerchantReviewVO>('/api/v1/merchant-review/user', {
    method: 'GET',
    params: {
      // pageNum has a default value: 1
      pageNum: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  })
}
