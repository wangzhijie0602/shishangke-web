// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 POST /api/v1/admin */
export async function create1(body: API.UserCreateRequest, options?: { [key: string]: any }) {
  return request<API.ResultLong>('/api/v1/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/admin/${param0} */
export async function get(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultUserVO>(`/api/v1/admin/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/admin/${param0}/ban */
export async function ban(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.banParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultVoid>(`/api/v1/admin/${param0}/ban`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/admin/${param0}/delete */
export async function delete1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.delete1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultVoid>(`/api/v1/admin/${param0}/delete`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/admin/${param0}/role */
export async function getRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoleParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultString>(`/api/v1/admin/${param0}/role`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/admin/${param0}/unban */
export async function unban(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unbanParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.ResultVoid>(`/api/v1/admin/${param0}/unban`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/admin/list */
export async function getUserList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserListParams,
  body: API.UserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageUserVO>('/api/v1/admin/list', {
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

/** 此处后端没有提供注释 POST /api/v1/admin/update */
export async function update1(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.ResultVoid>('/api/v1/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
