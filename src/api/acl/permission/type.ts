// 菜单数据与按钮数据的ts类型
export interface Permission {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: Permission[]
  select: boolean
}

// 添加与修改菜单携带的参数的ts类型
export interface MenuParams {
  // ID
  id?: number
  // 权限数值
  code: string
  // 几级菜单
  level: number
  // 菜单的名字
  name: string
  // 菜单的ID
  pid: number
}
