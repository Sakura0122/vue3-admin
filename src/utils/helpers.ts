// 获取当前是什么时间
export function getTime(): string {
  const hours = new Date().getHours()
  return hours <= 9 ? '早上' : hours <= 12 ? '上午' : hours <= 18 ? '下午' : '晚上'
}

// 补齐http
export function addHttpToUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`
  }
  return url
}
