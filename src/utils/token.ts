// 封装本地存储存储数据与读取数据方法
import Cookies from 'js-cookie'

// 存储数据
export const setToken = (token: string) => {
  Cookies.set('TOKEN', token)
}
// 获取数据
export const getToken = () => {
  return Cookies.get('TOKEN')
}
// 删除数据
export const removeToken = () => {
  Cookies.remove('TOKEN')
}
