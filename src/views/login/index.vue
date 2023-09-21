<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import useUserStore from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { getTime } from '@/utils/time'

defineOptions({ name: 'Login' })

const router = useRouter()
const userStore = useUserStore()

// 账号密码
const account = ref({
  username: 'admin',
  password: 'atguigu123'
})
// 表单实例
const formRef = ref<FormInstance>()
// 定义校验规则
const accountRules: FormRules = {
  username: [{ required: true, message: '必须输入账号信息', trigger: 'blur' }],
  password: [{ required: true, message: '必须输入密码', trigger: 'blur' }]
}

// 登录
const handleLogin = async () => {
  const valid = await formRef.value?.validate()
  console.log(valid)
  if (!valid) return

  try {
    await userStore.userLogin(account.value)
    router.push('/')
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`
    })
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login">
      <h1 class="title">后台管理系统</h1>
      <el-form :model="account" :rules="accountRules" label-width="60px" ref="formRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="account.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="account.password" />
        </el-form-item>
      </el-form>
      <el-button class="login-btn" type="primary" size="large" @click="handleLogin">立即登录</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: url('@/assets/img/login-bg.svg');

  .login {
    width: 330px;
    margin-bottom: 150px;

    .title {
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 15px;
    }

    .login-btn {
      margin-top: 10px;
      width: 100%;
    }
  }
}
</style>
