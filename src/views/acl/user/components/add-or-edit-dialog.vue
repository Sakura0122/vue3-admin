<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { User } from '@/api/acl/user/type'
import { addOrUpdateUserApi } from '@/api/acl/user'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import useUserStore from '@/stores/modules/user'

defineOptions({ name: 'AddOrEditDialog' })
const emit = defineEmits(['save'])

const userStore = useUserStore()
const isReload = ref(false)

// 表单校验
const rules = reactive<FormRules<User>>({
  username: [
    { required: true, message: '请输入用户名字', trigger: 'blur' },
    { min: 5, message: '用户名字至少5位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 5, message: '用户名称至少5位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '用户密码至少6位', trigger: 'blur' }
  ]
})

// form组件实例
const formRef = ref<FormInstance>()
// 控制弹窗显示隐藏
const isVisible = ref(false)
const isAdd = ref(true)
const openDialog = (add = true, form: User = {}) => {
  isAdd.value = add
  if (!add) {
    if (form.username === userStore.username) {
      isReload.value = true
    }
    userParams.value = JSON.parse(JSON.stringify(form))
  }
  isVisible.value = true
}
// 用户数据
const userParams = ref<User>({
  username: '',
  name: '',
  password: ''
})
// 保存
const handleSave = async () => {
  await formRef.value?.validate()
  await addOrUpdateUserApi(userParams.value)
  isVisible.value = false
  if (userParams.value.id) {
    ElMessage.success('编辑成功')
    emit('save', 'update')
    if (isReload.value && userStore.username !== userParams.value.username) {
      setTimeout(() => {
        ElMessage.success('您修改了用户名，请重新登录')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }, 200)
    }
  } else {
    ElMessage.success('新增成功')
    emit('save', 'add')
  }
}

// 弹窗关闭
const handleClose = () => {
  isVisible.value = false
  formRef.value?.clearValidate()
  userParams.value = {
    username: '',
    name: '',
    password: ''
  }
}

defineExpose({
  openDialog
})
</script>

<template>
  <el-dialog width="30%" v-model="isVisible" :title="isAdd ? '新建' : '编辑'" @close="handleClose">
    <el-form ref="formRef" :model="userParams" :rules="rules">
      <el-form-item label="用户名字" prop="username" label-width="100px">
        <el-input v-model="userParams.username" />
      </el-form-item>
      <el-form-item label="用户名称" prop="name" label-width="100px">
        <el-input v-model="userParams.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password" label-width="100px">
        <el-input v-model="userParams.password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-input {
  width: 300px;
}
</style>
