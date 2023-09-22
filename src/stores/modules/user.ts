import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, removeToken, setToken } from '@/utils/token'
import type { loginFormData } from '@/api/user/type'
import { getUserInfoApi, loginApi, logoutApi } from '@/api/user'
import { constantRoute } from '@/router/routes'
// import type { RouteRecordRaw } from 'vue-router'

const useUserStore = defineStore('user', () => {
  const token = ref(getToken() ?? '')
  // const menuRoutes = ref<RouteRecordRaw[]>(constantRoute)
  const menuRoutes = ref<any[]>(constantRoute)
  const avatar = ref('')
  const username = ref('')

  const userLogin = async (data: loginFormData) => {
    const res = await loginApi(data)
    token.value = res.data
    setToken(res.data)
  }

  const userInfo = async () => {
    const res = await getUserInfoApi()
    avatar.value = res.data.avatar
    username.value = res.data.name
  }

  const userLogout = async () => {
    await logoutApi()
    token.value = ''
    username.value = ''
    avatar.value = ''
    removeToken()
  }

  return { token, menuRoutes, avatar, username, userLogin, userInfo, userLogout }
})

export default useUserStore
