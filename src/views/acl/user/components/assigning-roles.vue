<script setup lang="ts">
import { ref } from 'vue'
import type { RoleData, User } from '@/api/acl/user/type'
import type { CheckboxValueType } from 'element-plus'
import { getAllRoleApi, setUserRoleApi } from '@/api/acl/user'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'AssigningRoles' })
const emit = defineEmits(['save'])

// 控制弹窗显示隐藏
const isVisible = ref(false)
const formParams = ref<User>({})
const openDialog = (row: User) => {
  formParams.value = row
  isVisible.value = true
  getAllRoleData()
}

// 全选
const checkAll = ref(false)
const isIndeterminate = ref(true)
// 点击全选框
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedRoles.value = val ? roles.value : []
  isIndeterminate.value = false
}
// 点击子选择框
const handleCheckedRolesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === roles.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < roles.value.length
}

// 获取全部角色数据
const roles = ref<RoleData[]>([])
const checkedRoles = ref<RoleData[]>([])
const getAllRoleData = async () => {
  const res = await getAllRoleApi(<number>formParams.value.id)
  roles.value = res.data.allRolesList
  checkedRoles.value = res.data.assignRoles
}

// 保存
const handleSave = async () => {
  isVisible.value = false
  const data = {
    userId: <number>formParams.value.id,
    roleIdList: checkedRoles.value.map(item => item.id) as number[]
  }
  await setUserRoleApi(data)
  ElMessage.success('编辑成功')
  emit('save')
}

defineExpose({
  openDialog
})
</script>

<template>
  <el-dialog width="30%" v-model="isVisible" title="分配角色">
    <el-form>
      <el-form-item label="用户名字：">
        <el-input v-model="formParams.username" disabled />
      </el-form-item>
      <el-form-item label="角色列表：">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
          <el-checkbox v-for="role in roles" :key="role.id" :label="role">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
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
