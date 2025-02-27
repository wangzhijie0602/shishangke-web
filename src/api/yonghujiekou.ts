// @ts-ignore
/* eslint-disable */
import request from '@/requests'

/** 获取当前用户信息 获取当前登录用户的信息 GET /api/v1/user/current */
export async function current(options?: { [key: string]: any }) {
  return request<API.Result>('/api/v1/user/current', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 用户登录 用户登录接口 POST /api/v1/user/login */
export async function login(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.Result>('/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户注册 用户注册接口 POST /api/v1/user/register */
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
