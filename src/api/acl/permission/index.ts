import request from '@/utils/request'
import type { MenuParams, Permission } from '@/api/acl/permission/type'

/**
 * 获取全部菜单与按钮的标识数据
 */
export function getAllPermissionApi() {
  return request<Permission[]>('/admin/acl/permission')
}

export function addOrUpdatePermissionApi(data: MenuParams) {
  if (data.id) {
    return request<any>('/admin/acl/permission/update', 'put', data)
  } else {
    return request<any>('/admin/acl/permission/save', 'post', data)
  }
}

export function delPermissionApi(id: number) {
  return request(`/admin/acl/permission/remove/${id}`, 'delete')
}
