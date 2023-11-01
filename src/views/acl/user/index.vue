<script setup lang="ts">
import { usePagination } from '@/hooks/usePagination'
import { ref, watch } from 'vue'
import type { User } from '@/api/acl/user/type'
import { delUserApi, delUserListApi, getUserDataApi } from '@/api/acl/user'
import AddOrEditDialog from './components/add-or-edit-dialog.vue'
import AssigningRoles from './components/assigning-roles.vue'
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'User' })

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 获取用户数据
const username = ref('')
const userList = ref<User[]>([])
const getUserData = async () => {
  const res = await getUserDataApi(paginationData.currentPage, paginationData.pageSize, username.value)
  userList.value = res.data.records
  paginationData.total = res.data.total
}
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUserData, { immediate: true })

// 搜索
const searchUser = () => {
  paginationData.currentPage === 1 ? getUserData() : (paginationData.currentPage = 1)
}
// 重置
const resetUser = () => {
  username.value = ''
  searchUser()
}

// 组件实例
const addOrEditDialogRef = ref<InstanceType<typeof AddOrEditDialog> | null>(null)
const assigningRolesRef = ref<InstanceType<typeof AssigningRoles> | null>(null)

// 新增用户
const addUser = () => {
  addOrEditDialogRef.value?.openDialog()
}

// 批量删除
const selectUserArr = ref<User[]>([])
const selectChange = (value: User[]) => {
  selectUserArr.value = value
}
const delUserList = async () => {
  const idList = selectUserArr.value.map(item => item.id) as number[]
  ElMessageBox.confirm('确定删除吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await delUserListApi(idList)
      ElMessage.success('删除成功')
      getUserData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 分配角色
const setRole = (row: User) => {
  assigningRolesRef.value?.openDialog(row)
}
// 编辑
const updateUser = (row: User) => {
  addOrEditDialogRef.value?.openDialog(false, row)
}
// 删除
const delUser = (row: User) => {
  ElMessageBox.confirm('确定删除吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await delUserApi(row.id as number)
      ElMessage.success('删除成功')
      getUserData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

// 保存信息
const save = (operate: 'add' | 'update') => {
  if (operate === 'add' && paginationData.currentPage !== 1) {
    paginationData.currentPage = 1
  } else {
    getUserData()
  }
}
</script>

<template>
  <div class="user-container">
    <el-card>
      <el-form class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="请输入用户名" v-model="username" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">搜索</el-button>
          <el-button type="primary" @click="resetUser">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="danger" @click="delUserList">批量删除</el-button>

      <el-table border style="margin: 10px 0" :data="userList" @selection-change="selectChange">
        <el-table-column type="selection" align="center" />
        <el-table-column label="#" type="index" align="center" />
        <el-table-column label="ID" align="center" width="80px" prop="id" />
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip />
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180px" show-overflow-tooltip />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180px" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="320px">
          <template #default="{ row }">
            <el-button type="primary" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-button type="primary" icon="Delete" @click="delUser(row)">删除</el-button>
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

    <!-- 新增或编辑用户信息 -->
    <add-or-edit-dialog ref="addOrEditDialogRef" @save="save" />
    <!-- 分配角色 -->
    <assigning-roles ref="assigningRolesRef" @save="getUserData" />
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
