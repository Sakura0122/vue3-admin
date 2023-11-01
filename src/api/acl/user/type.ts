// 一个账号信息的ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: null
  roleName?: string
}

export interface UserResponseData {
  records: User[]
  total: number
  size: number
  current: number
  pages: number
}

// 一个职位的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}

// 获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData {
  assignRoles: RoleData[]
  allRolesList: RoleData[]
}

// 给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
