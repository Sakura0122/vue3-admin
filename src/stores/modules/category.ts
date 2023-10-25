import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CategoryObj } from '@/api/product/attr/type'
import { getFirstLevelCategoryApi, getSecondLevelCategoryApi, getThirdLevelCategoryApi } from '@/api/product/attr'

const useCategoryStore = defineStore('category', () => {
  const firstLevelCategoryList = ref<CategoryObj[]>([])
  const secondLevelCategoryList = ref<CategoryObj[]>([])
  const thirdLevelCategoryList = ref<CategoryObj[]>([])
  const firstLevelCategoryId = ref('')
  const secondLevelCategoryId = ref('')
  const thirdLevelCategoryId = ref('')

  const getFirstLevelCategoryData = async () => {
    const res = await getFirstLevelCategoryApi()
    firstLevelCategoryList.value = res.data
  }

  const getSecondLevelCategoryData = async () => {
    const res = await getSecondLevelCategoryApi(firstLevelCategoryId.value)
    secondLevelCategoryList.value = res.data
  }

  const getThirdLevelCategoryData = async () => {
    const res = await getThirdLevelCategoryApi(secondLevelCategoryId.value)
    thirdLevelCategoryList.value = res.data
  }

  const reset = () => {
    firstLevelCategoryList.value = []
    secondLevelCategoryList.value = []
    thirdLevelCategoryList.value = []
    firstLevelCategoryId.value = ''
    secondLevelCategoryId.value = ''
    thirdLevelCategoryId.value = ''
  }

  return {
    firstLevelCategoryList,
    secondLevelCategoryList,
    thirdLevelCategoryList,
    firstLevelCategoryId,
    secondLevelCategoryId,
    thirdLevelCategoryId,
    getFirstLevelCategoryData,
    getSecondLevelCategoryData,
    getThirdLevelCategoryData,
    reset
  }
})

export default useCategoryStore
