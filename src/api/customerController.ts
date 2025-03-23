// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 POST /api/v1/customer/create */
export async function createCustomer(
  body: API.CustomerCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>('/api/v1/customer/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/customer/current */
export async function getCurrentCustomer(options?: { [key: string]: any }) {
  return request<API.ResultCustomerVO>('/api/v1/customer/current', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/customer/delete */
export async function deleteCustomer(options?: { [key: string]: any }) {
  return request<API.ResultString>('/api/v1/customer/delete', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/customer/info */
export async function getCustomerInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCustomerInfoParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultCustomerVO>('/api/v1/customer/info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/login */
export async function login1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.login1Params,
  options?: { [key: string]: any }
) {
  return request<API.ResultCustomerVO>('/api/v1/customer/login', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.ResultString>('/api/v1/customer/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/register */
export async function registerCustomer(
  body: API.CustomerCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultLong>('/api/v1/customer/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update */
export async function updateCustomer(
  body: API.CustomerUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update-address */
export async function updateDefaultAddress(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateDefaultAddressParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update-address', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update-birth-date */
export async function updateBirthDate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateBirthDateParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update-birth-date', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update-gender */
export async function updateGender(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateGenderParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update-gender', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update-name */
export async function updateRealName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateRealNameParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update-name', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/customer/update-preferences */
export async function updatePreferences(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updatePreferencesParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultString>('/api/v1/customer/update-preferences', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
