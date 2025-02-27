import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建 Axios 实例
const myAxios = axios.create({
  timeout: 10000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做处理
    return config
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录处理
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户当前不在登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // 处理响应错误（状态码不在2xx范围内的响应）
    return Promise.reject(error)
  },
)

export default myAxios
