<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePagination } from '@/hooks/usePagination'
import { delRoleApi, getAllRoleDataApi } from '@/api/acl/role'
import type { RoleData } from '@/api/acl/role/type'
import AddOrEditDialog from './components/add-or-edit-dialog.vue'
import { ElMessageBox } from 'element-plus'
import AssignPermission from '@/views/acl/role/components/assign-permission.vue'

defineOptions({ name: 'Role' })

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 获取角色数据
const role = ref('')
const roleList = ref<RoleData[]>([])
const getRoleData = async () => {
  const res = await getAllRoleDataApi(paginationData.currentPage, paginationData.pageSize, role.value)
  roleList.value = res.data.records
  paginationData.total = res.data.total
}
watch([() => paginationData.pageSize, () => paginationData.currentPage], getRoleData, { immediate: true })

// 搜索
const searchRole = () => {
  paginationData.currentPage === 1 ? getRoleData() : (paginationData.currentPage = 1)
}

// 重置
const resetRole = () => {
  role.value = ''
  searchRole()
}

// 新增或编辑
const addOrEditDialogRef = ref<InstanceType<typeof AddOrEditDialog> | null>(null)
const addRole = () => {
  addOrEditDialogRef.value?.openDialog()
}
const updateRole = (row: RoleData) => {
  addOrEditDialogRef.value?.openDialog(false, row)
}
// 删除
const delRole = (row: RoleData) => {
  ElMessageBox.confirm('确定删除吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await delRoleApi(row.id as number)
      ElMessage.success('删除成功')
      getRoleData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
  console.log(row)
}

// 分配权限
const assignPermissionRef = ref<InstanceType<typeof AssignPermission> | null>(null)
const setPermission = (row: RoleData) => {
  assignPermissionRef.value?.openDialog(row)
}

const saveRole = (type: 'add' | 'update') => {
  type === 'add' ? resetRole() : getRoleData()
}
</script>

<template>
  <div class="role-container">
    <el-card>
      <el-form class="form">
        <el-form-item label="角色名:">
          <el-input placeholder="请输入角色名" v-model="role" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRole">搜索</el-button>
          <el-button type="primary" @click="resetRole">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table border style="margin: 10px 0" :data="roleList">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建世间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <!-- row:已有的职位对象 -->
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="delRole(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :currentPage="paginationData.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 新增或编辑角色信息 -->
    <add-or-edit-dialog ref="addOrEditDialogRef" @save="saveRole" />
    <!-- 分配权限 -->
    <assign-permission ref="assignPermissionRef" />
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  align-items: center;

  .el-form-item {
    margin-bottom: 0;
    margin-right: 20px;
  }
}
</style>
