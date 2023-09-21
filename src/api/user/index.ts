import request from '@/utils/request'
import type { loginFormData, userInfoResponseData } from './type'

/**
 * 登录
 * @param data 账号密码
 */
export function loginApi(data: loginFormData) {
  return request<string>('/admin/acl/index/login', 'post', data)
}

/**
 * 获取用户信息
 */
export function getUserInfoApi() {
  return request<userInfoResponseData>('/admin/acl/index/info')
}
