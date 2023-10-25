<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { addOrUpdateTrademarkApi, delTrademarkApi, getTrademarkDataApi } from '@/api/product/trademark'
import type { TradeMark } from '@/api/product/trademark/type'
import { usePagination } from '@/hooks/usePagination'
import { addHttpToUrl } from '@/utils/helpers'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'Trademark' })

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 品牌数据
const trademarkList = ref<TradeMark[]>([])
const getTrademarkData = async () => {
  const res = await getTrademarkDataApi(paginationData.currentPage, paginationData.pageSize)
  const { records, total } = res.data
  trademarkList.value = records
  paginationData.total = total
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTrademarkData, { immediate: true })

// 品牌自定义校验规则方法
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  // 是当表单元素触发blur时候,会触发此方法
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    // 校验未通过返回的错误的提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
// 品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}
// 表单校验规则对象
const rules = {
  tmName: [
    // required:这个字段务必校验,表单项前面出来五角星
    // trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}

// 是否显示弹窗
const isVisible = ref(false)
// 新增品牌数据
const formInfo = () => ({
  tmName: '',
  logoUrl: ''
})
const formData = reactive<TradeMark>(formInfo())
// 表单ref
const ruleFormRef = ref<FormInstance>()
// 重置表单
const closeForm = () => {
  Object.assign(formData, formInfo())
  ruleFormRef.value?.clearValidate()
}
// 图片上传之前
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  if (!['image/png', 'image/jpeg', 'image/gif'].includes(rawFile.type)) {
    ElMessage.error('上传文件格式必须是PNG|JPG|GIF!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小不应超过4M!')
    return false
  }
  return true
}
// 图片上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = response => {
  formData.logoUrl = response.data
  ruleFormRef.value?.clearValidate('logoUrl')
}
// 确认
const handleCreate = () => {
  ruleFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      try {
        await addOrUpdateTrademarkApi(formData)
        ElMessage.success(formData.id ? '修改成功' : '添加成功')
        getTrademarkData()
      } finally {
        isVisible.value = false
      }
    } else {
      console.error('表单校验不通过', fields)
    }
  })
}

// 添加品牌
const addTrademark = () => {
  isVisible.value = true
}
// 编辑品牌
const editTrademark = (row: TradeMark) => {
  Object.assign(formData, row)
  isVisible.value = true
}
// 删除品牌
const delTradeMark = async (id: number) => {
  await delTrademarkApi(id)
  ElMessage.success('删除成功')
  getTrademarkData()
}
</script>

<template>
  <div class="trademark-container">
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <el-table style="margin: 10px 0" border :data="trademarkList">
        <el-table-column label="序号" width="80px" align="center" type="index" />
        <el-table-column label="品牌名称" prop="tmName" />
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img :src="addHttpToUrl(row.logoUrl)" style="width: 100px; height: 100px" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="editTrademark(row)"></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="delTradeMark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
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
    <el-dialog v-model="isVisible" :title="formData.id ? '修改品牌' : '添加品牌'" @close="closeForm">
      <el-form style="width: 80%" ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="formData.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.logoUrl" :src="formData.logoUrl" class="avatar" alt="" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽:footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="isVisible = false">取消</el-button>
        <el-button type="primary" size="default" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.avatar-uploader) {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
