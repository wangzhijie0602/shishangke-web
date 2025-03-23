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

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-address */
export async function updateAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAddressParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-address`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-business-hours */
export async function updateBusinessHours(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBusinessHoursParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-business-hours`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-description */
export async function updateDescription(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDescriptionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-description`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-logo */
export async function updateLogo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateLogoParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-logo`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-min-price */
export async function updateMinPrice(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateMinPriceParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-min-price`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-name */
export async function updateName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateNameParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-name`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-phone */
export async function updatePhone1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePhone1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-phone`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/merchant/${param0}/update-status */
export async function updateStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateStatusParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/merchant/${param0}/update-status`, {
    method: 'POST',
    params: {
      ...queryParams,
    },
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
