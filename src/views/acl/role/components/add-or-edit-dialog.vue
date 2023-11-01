<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { RoleData } from '@/api/acl/role/type'
import { addOrUpdateRoleApi } from '@/api/acl/role'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'AddOrEditDialog' })

const emit = defineEmits<{
  save: [type: 'add' | 'update']
}>()

// 表单校验
const rules = reactive<FormRules<RoleData>>({
  roleName: [{ required: true, message: '请输入角色名字', trigger: 'blur' }]
})

// form组件实例
const formRef = ref<FormInstance>()
const isVisible = ref(false)
const isAdd = ref(true)
const roleParams = ref<RoleData>({
  roleName: ''
})
const openDialog = (add = true, roleData?: RoleData) => {
  isAdd.value = add
  if (roleData) {
    roleParams.value = JSON.parse(JSON.stringify(roleData))
  }
  isVisible.value = true
}
const handleClose = () => {
  roleParams.value = { roleName: '' }
  formRef.value?.clearValidate()
}
const handleSave = async () => {
  await formRef.value?.validate()
  await addOrUpdateRoleApi(roleParams.value)
  isVisible.value = false
  if (roleParams.value.id) {
    ElMessage.success('编辑成功')
    emit('save', 'update')
  } else {
    ElMessage.success('新增成功')
    emit('save', 'add')
  }
}

defineExpose({ openDialog })
</script>

<template>
  <el-dialog width="30%" v-model="isVisible" :title="isAdd ? '新建' : '编辑'" @close="handleClose">
    <el-form ref="formRef" :model="roleParams" :rules="rules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="roleParams.roleName" />
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

<style scoped lang="less"></style>
