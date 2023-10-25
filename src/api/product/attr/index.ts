import request from '@/utils/request'
import type { Attr, CategoryObj } from '@/api/product/attr/type'

/**
 * 获取一级分类数据
 */
export function getFirstLevelCategoryApi() {
  return request<CategoryObj[]>('/admin/product/getCategory1')
}

/**
 * 获取二级分类数据
 * @param firstLevelId 一级分类id
 */
export function getSecondLevelCategoryApi(firstLevelId: number | string) {
  return request<CategoryObj[]>(`/admin/product/getCategory2/${firstLevelId}`)
}

/**
 * 获取三级分类数据
 * @param secondLevelId 二级分类id
 */
export function getThirdLevelCategoryApi(secondLevelId: number | string) {
  return request<CategoryObj[]>(`/admin/product/getCategory3/${secondLevelId}`)
}

/**
 * 获取对应分类下已有的属性与属性值
 * @param firstLevelId 一级分类id
 * @param secondLevelId 二级分类id
 * @param thirdLevelId 三级分类id
 */
export function getAttrDataApi(
  firstLevelId: number | string,
  secondLevelId: number | string,
  thirdLevelId: number | string
) {
  return request<Attr[]>(`/admin/product/attrInfoList/${firstLevelId}/${secondLevelId}/${thirdLevelId}`)
}

/**
 * 新增或修改属性
 * @param data 属性值
 */
export function addOrUpdateAttrApi(data: Attr) {
  return request<any>('/admin/product/saveAttrInfo', 'post', data)
}

/**
 * 删除属性
 * @param attrId 属性id
 */
export function delAttrApi(attrId: number) {
  return request<any>(`/admin/product/deleteAttr/${attrId}`, 'delete')
}
