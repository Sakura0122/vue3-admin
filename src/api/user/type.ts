// 定义用户相关数据的ts类型

// 用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

// 定义获取用户信息返回数据类型
export interface userInfoResponseData {
  routes: string[]
  buttons: string[]
  roles: string[]
  name: string
  avatar: string
}
