import axios from 'axios'
import type { Method, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { hideLoading, showLoading } from './loading'
import { getToken } from './token'

// let baseURL: string
// // 是否是开发环境
// if (import.meta.env.DEV) {
//   baseURL = 'http://123.207.32.32:5000'
// } else {
//   baseURL = 'http://123.207.32.32:6000'
// }

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    showLoading()
    const token = getToken()
    if (config.headers && token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    setTimeout(() => {
      hideLoading()
    }, 200)
    if (res.data.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.data.data || '网络异常')
      return Promise.reject(res.data)
    }
  },
  (error) => {
    setTimeout(() => {
      hideLoading()
    }, 200)
    const errorMessages: { [key: number]: string } = {
      400: '请求错误',
      401: 'TOKEN过期',
      403: '拒绝访问',
      404: '请求地址出错',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
      505: 'HTTP 版本不受支持'
    }
    const status: number = error.response.status
    const message: string = errorMessages[status] || '请求错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

type Data<T> = {
  code: string
  data: T
  message: string
  ok: boolean
}

const request = <T>(url: string, method: Method = 'get', submitData?: object, config?: AxiosRequestConfig) => {
  return service.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
    ...config
  })
}

export default request
