<script setup lang="ts">
import { ref } from 'vue'
import type { MenuData, RoleData } from '@/api/acl/role/type'
import { getAllMenuDataApi, setPermissionApi } from '@/api/acl/role'
import { ElTree } from 'element-plus'

defineOptions({ name: 'AssignPermission' })

const roleParams = ref<RoleData>({ roleName: '' })
// 打开弹窗
const isVisible = ref(false)
const openDialog = (role: RoleData) => {
  roleParams.value = role
  isVisible.value = true
  getAllMenuData(role)
}

// 获取权限数据
const menuList = ref<MenuData[]>([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
const getAllMenuData = async (role: RoleData) => {
  const res = await getAllMenuDataApi(role.id as number)
  menuList.value = res.data
  selectList.value = filterSelectList(menuList.value, [])
}
// select为true的权限数据
const selectList = ref<number[]>([])
const filterSelectList = (menuList: MenuData[], arr: number[]) => {
  menuList.forEach(item => {
    if (item.select && item.children?.length === 0) arr.push(item.id)
    if (item.children?.length) filterSelectList(item.children, arr)
  })

  return arr
}

// tree组件实例
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)
// 点击确认
const handleSave = async () => {
  // 半选的节点
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() as number[]
  // 全选的节点
  const checkedKeys = treeRef.value?.getCheckedKeys() as number[]
  const allCheckedKeys = halfCheckedKeys?.concat(checkedKeys)
  console.log(allCheckedKeys)
  const id = roleParams.value.id as number
  await setPermissionApi(id, allCheckedKeys)
  ElMessage.success('分配成功，两秒后自动刷新页面')
  isVisible.value = false
  setTimeout(() => {
    window.location.reload()
  }, 2000)
}

defineExpose({ openDialog })
</script>

<template>
  <el-dialog width="30%" v-model="isVisible" title="分配权限">
    <el-scrollbar height="500px">
      <el-tree
        ref="treeRef"
        :data="menuList"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectList"
        :props="defaultProps"
      />
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
