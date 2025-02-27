// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 此处后端没有提供注释 GET /api/v1/user/current */
export async function current(options?: { [key: string]: any }) {
  return request<API.Result>('/api/v1/user/current', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/user/login */
export async function login(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loginParams,
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Result>('/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /api/v1/user/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.Result>('/api/v1/user/logout', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /api/v1/user/register */
export async function register(body: API.UserRegisterRequest, options?: { [key: string]: any }) {
  return request<API.Result>('/api/v1/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
