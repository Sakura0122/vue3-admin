//封装本地存储存储数据与读取数据方法

// 存储数据
export const setToken = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
// 获取数据
export const getToken = () => {
  return localStorage.getItem('TOKEN')
}
// 删除数据
export const removeToken = () => {
  localStorage.removeItem('TOKEN')
}
