<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/stores/modules/category'

defineOptions({ name: 'Category' })
defineProps<{
  scene: boolean
}>()

const categoryStore = useCategoryStore()

// 获取一级分类数据
const getFirstLevelCategoryData = () => {
  categoryStore.getFirstLevelCategoryData()
}

onMounted(() => {
  getFirstLevelCategoryData()
})

// 一级分类值发生变化
const onFirstLevelChange = () => {
  categoryStore.getSecondLevelCategoryData()
  categoryStore.secondLevelCategoryId = ''
  categoryStore.thirdLevelCategoryId = ''
}
// 二级分类发生变化
const onSecondLevelChange = () => {
  categoryStore.getThirdLevelCategoryData()
  categoryStore.thirdLevelCategoryId = ''
}
</script>

<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.firstLevelCategoryId" @change="onFirstLevelChange" :disabled="!scene">
          <el-option
            v-for="item in categoryStore.firstLevelCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.secondLevelCategoryId" @change="onSecondLevelChange" :disabled="!scene">
          <el-option
            v-for="item in categoryStore.secondLevelCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.thirdLevelCategoryId" :disabled="!scene">
          <el-option
            v-for="item in categoryStore.thirdLevelCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss"></style>
