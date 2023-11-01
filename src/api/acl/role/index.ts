import request from '@/utils/request'
import type { MenuData, RoleData, RoleResponseData } from '@/api/acl/role/type'

/**
 * 获取全部角色
 * @param page 页码
 * @param limit 页容量
 * @param roleName 角色关键字
 */
export function getAllRoleDataApi(page: number, limit: number, roleName: string) {
  return request<RoleResponseData>(`/admin/acl/role/${page}/${limit}/?roleName=${roleName}`)
}

/**
 * 新增或修改角色
 * @param data 角色数据
 */
export function addOrUpdateRoleApi(data: RoleData) {
  if (data.id) {
    return request<any>('/admin/acl/role/update', 'put', data)
  } else {
    return request<any>('/admin/acl/role/save', 'post', data)
  }
}

/**
 * 获取全部菜单与按钮权限数据
 * @param roleId 角色id
 */
export function getAllMenuDataApi(roleId: number) {
  return request<MenuData[]>(`/admin/acl/permission/toAssign/${roleId}`)
}

/**
 * 给职位下发权限
 * @param roleId
 * @param permissionId
 */
export function setPermissionApi(roleId: number, permissionId: number[]) {
  return request<any>(`/admin/acl/permission/doAssign/?roleId=${roleId}&permissionId=${permissionId}`, 'post')
}

/**
 * 删除角色
 * @param roleId 角色id
 */
export function delRoleApi(roleId: number) {
  return request<any>(`/admin/acl/role/remove/${roleId}`, 'delete')
}
