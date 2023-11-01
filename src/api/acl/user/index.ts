import request from '@/utils/request'
import type { AllRoleResponseData, SetRoleData, User, UserResponseData } from '@/api/acl/user/type'

/**
 * 获取用户数据
 * @param page 当前页数
 * @param limit 页容量
 * @param username 搜索关键字
 */
export function getUserDataApi(page: number, limit: number, username: string) {
  return request<UserResponseData>(`/admin/acl/user/${page}/${limit}/?username=${username}`)
}

/**
 * 新增或编辑用户信息
 * @param data 用户信息
 */
export function addOrUpdateUserApi(data: User) {
  if (data.id) {
    return request<any>('/admin/acl/user/update', 'put', data)
  } else {
    return request<any>('/admin/acl/user/save', 'post', data)
  }
}

/**
 * 获取全部角色以及自身角色数据
 * @param userId
 */
export function getAllRoleApi(userId: number) {
  return request<AllRoleResponseData>(`/admin/acl/user/toAssign/${userId}`)
}

/**
 * 给用户分配角色
 * @param data 用户id和角色数组
 */
export function setUserRoleApi(data: SetRoleData) {
  return request<any>('/admin/acl/user/doAssignRole', 'post', data)
}

/**
 * 删除用户
 * @param userId 用户id
 */
export function delUserApi(userId: number) {
  return request<any>(`/admin/acl/user/remove/${userId}`, 'delete')
}

/**
 * 批量删除用户
 * @param idList 用户id数组
 */
export function delUserListApi(idList: number[]) {
  return request<any>('/admin/acl/user/batchRemove', 'delete', idList)
}
