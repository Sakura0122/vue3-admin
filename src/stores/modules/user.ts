import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken } from '@/utils/token'
import type { loginFormData } from '@/api/user/type'
import { loginApi } from '@/api/user'

const useUserStore = defineStore('user', () => {
  const token = ref(getToken() ?? '')

  const userLogin = async (data: loginFormData) => {
    const res = await loginApi(data)
    token.value = res.data
    setToken(res.data)
  }

  return { token, userLogin }
})

export default useUserStore
