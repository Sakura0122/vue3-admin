<script setup lang="ts">
import Category from '@/components/category/index.vue'
import useCategoryStore from '@/stores/modules/category'
import { addOrUpdateAttrApi, delAttrApi, getAttrDataApi } from '@/api/product/attr'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'Attr' })

const categoryStore = useCategoryStore()

// 获取属性值
const attrList = ref<Attr[]>([])
const getAttrData = async () => {
  const { firstLevelCategoryId, secondLevelCategoryId, thirdLevelCategoryId } = categoryStore
  const res = await getAttrDataApi(firstLevelCategoryId, secondLevelCategoryId, thirdLevelCategoryId)
  attrList.value = res.data
}

// 监听三级分类id变化
watch(
  () => categoryStore.thirdLevelCategoryId,
  () => {
    attrList.value = []
    if (!categoryStore.thirdLevelCategoryId) return
    getAttrData()
  }
)

// 定义card内容切换的变量
const scene = ref(true)
// 新增属性
const addAttr = () => {
  Object.assign(attrParams.value, {
    attrName: '',
    categoryId: categoryStore.thirdLevelCategoryId,
    categoryLevel: 3,
    attrValueList: []
  })
  scene.value = false
}
// 编辑属性
const editAttr = (row: Attr) => {
  attrParams.value = JSON.parse(JSON.stringify(row))
  scene.value = false
}
// 删除属性
const delAttr = (id: number) => {
  ElMessageBox.confirm('确认删除吗', '温馨提示', { type: 'warning' }).then(async () => {
    await delAttrApi(id)
    ElMessage.success('删除成功')
    getAttrData()
  })
}
// 取消新增属性
const cancelAddAttr = () => {
  scene.value = true
}

// 属性数据
const attrParams = ref<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: []
})
// 添加属性值
const addAttrValue = () => {
  attrParams.value.attrValueList.push({ valueName: '' })
  nextTick(() => {
    elInputArr.value[elInputArr.value.length - 1].focus()
  })
}
// 填写属性值
const onInputBlur = (row: AttrValue, index: number) => {
  const isEmpty = row.valueName.trim() === ''
  const duplicateItem = attrParams.value.attrValueList.find(item => item !== row && item.valueName === row.valueName)
  if (isEmpty || duplicateItem) {
    attrParams.value.attrValueList.splice(index, 1)
  }
  if (isEmpty) {
    return ElMessage.error('属性值不能为空')
  }
  if (duplicateItem) {
    return ElMessage.error('属性值不能重复')
  }
}
// 保存input的数组
const elInputArr = ref<any>([])
// 保存属性
const saveAttr = async () => {
  await addOrUpdateAttrApi(attrParams.value)
  scene.value = true
  ElMessage.success(attrParams.value.id ? '修改成功' : '新增成功')
  getAttrData()
}

// 组件销毁清空仓库数据
onBeforeUnmount(() => {
  categoryStore.reset()
})
</script>

<template>
  <div class="attr-container">
    <category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div class="table-content" v-show="scene">
        <el-button type="primary" icon="Plus" :disabled="!categoryStore.thirdLevelCategoryId" @click="addAttr">
          添加属性
        </el-button>
        <el-table style="margin: 10px 0" border :data="attrList">
          <el-table-column label="序号" type="index" align="center" width="80px" />
          <el-table-column label="属性名称" align="center" width="120px" prop="attrName" />
          <el-table-column label="属性值">
            <template #default="{ row }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240px">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="editAttr(row)">编辑</el-button>
              <el-button type="primary" size="small" icon="Delete" @click="delAttr(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="add-edit-content" v-show="!scene">
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttrValue"
          >添加属性值
        </el-button>
        <el-button type="primary" @click="cancelAddAttr">取消</el-button>
        <el-table style="margin: 10px 0" border :data="attrParams.attrValueList">
          <el-table-column width="80px" label="序号" align="center" type="index" />
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                :ref="(vc: any) => (elInputArr[$index] = vc)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                @blur="onInputBlur(row, $index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ row, index }">
              <el-button type="primary" size="small" icon="Delete" @click="attrParams.attrValueList.splice(index, 1)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrParams.attrValueList.length === 0" @click="saveAttr">保存</el-button>
        <el-button type="primary" @click="cancelAddAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.add-edit-content {
  .el-table {
    :deep(.el-input) {
      .el-input__wrapper {
        box-shadow: none !important;
        padding: 0;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
          padding: 1px 11px;
        }
      }
    }
  }
}
</style>
