import router from '@/router/index'
import setting from '@/setting'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from '@/stores/modules/user'

/** 免登录白名单 */
const whiteList = ['/login', '/404']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  document.title = `${setting.title} - ${to.meta.title}`
  const userStore = useUserStore()
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStore.userInfo()
          // 万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (e) {
          // token过期:获取不到用户信息了
          // 用户手动修改本地存储token
          // 退出登录->用户相关的数据清空
          await userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  } else {
    //用户未登录判断
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
