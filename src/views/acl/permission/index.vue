<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { MenuParams, Permission } from '@/api/acl/permission/type'
import { addOrUpdatePermissionApi, delPermissionApi, getAllPermissionApi } from '@/api/acl/permission'
import { ElMessageBox } from 'element-plus'
import { delUserListApi } from '@/api/acl/user'

// 获取权限数据
const permissionList = ref<Permission[]>([])
const getAllPermissionData = async () => {
  const res = await getAllPermissionApi()
  permissionList.value = res.data
}
onMounted(() => {
  getAllPermissionData()
})

const isVisible = ref(false)
const handleClose = () => {
  menuData.value = {
    code: '',
    level: 0,
    name: '',
    pid: 0
  }
}
const menuData = ref<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})

// 删除
const delPermission = async (row: MenuParams) => {
  ElMessageBox.confirm('确定删除吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await delPermissionApi(row.id as number)
      ElMessage.success('删除成功')
      getAllPermissionData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 添加
const addPermission = (row: MenuParams) => {
  menuData.value.level = row.level + 1
  menuData.value.pid = row.id as number
  isVisible.value = true
}
// 编辑
const updatePermission = (row: MenuParams) => {
  menuData.value = row
  isVisible.value = true
}
// 保存
const handleSave = async () => {
  await addOrUpdatePermissionApi(menuData.value)
  isVisible.value = false
  ElMessage.success(menuData.value.id ? '编辑成功' : '添加成功')
  getAllPermissionData()
}
</script>

<template>
  <div class="permission-container">
    <el-table :data="permissionList" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
        <template #default="{ row }">
          <el-button type="primary" @click="addPermission(row)" size="small" :disabled="row.level === 4">
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="primary" @click="updatePermission(row)" size="small" :disabled="row.level === 1">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="delPermission(row)" :disabled="row.level === 1">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="30%" v-model="isVisible" :title="menuData.id ? '新建' : '编辑'" @close="handleClose">
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
