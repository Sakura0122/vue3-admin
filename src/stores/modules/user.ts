import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken } from '@/utils/token'
import type { loginFormData } from '@/api/user/type'
import { loginApi } from '@/api/user'
import { constantRoute } from '@/router/routes'
// import type { RouteRecordRaw } from 'vue-router'

const useUserStore = defineStore('user', () => {
  const token = ref(getToken() ?? '')
  // const menuRoutes = ref<RouteRecordRaw[]>(constantRoute)
  const menuRoutes = ref<any[]>(constantRoute)

  const userLogin = async (data: loginFormData) => {
    const res = await loginApi(data)
    token.value = res.data
    setToken(res.data)
  }

  return { token, menuRoutes, userLogin }
})

export default useUserStore
