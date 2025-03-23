// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 GET /api/v1/menu-review/${param0} */
export async function getReview1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReview1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultMenuReviewVO>(`/api/v1/menu-review/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/menu-review/${param0}/delete */
export async function deleteReview1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteReview1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/menu-review/${param0}/delete`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/menu-review/${param0}/like */
export async function likeReview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.likeReviewParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultInteger>(`/api/v1/menu-review/${param0}/like`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/menu-review/create */
export async function createReview1(
  body: API.MenuReviewCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>('/api/v1/menu-review/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/menu-review/list */
export async function getReviewList1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReviewList1Params,
  body: API.MenuReviewQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMenuReviewVO>('/api/v1/menu-review/list', {
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

/** 此处后端没有提供注释 GET /api/v1/menu-review/menu/${param0} */
export async function getMenuReviews(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMenuReviewsParams,
  options?: { [key: string]: any }
) {
  const { menuId: param0, ...queryParams } = params
  return request<API.ResultPageMenuReviewVO>(`/api/v1/menu-review/menu/${param0}`, {
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

/** 此处后端没有提供注释 POST /api/v1/menu-review/update */
export async function updateReview1(
  body: API.MenuReviewUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/menu-review/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/menu-review/user */
export async function getUserReviews1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserReviews1Params,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageMenuReviewVO>('/api/v1/menu-review/user', {
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
