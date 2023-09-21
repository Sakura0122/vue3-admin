// 获取当前是什么时间
export const getTime = () => {
  const hours = new Date().getHours()
  return hours <= 9 ? '早上' : hours <= 12 ? '上午' : hours <= 18 ? '下午' : '晚上'
}
