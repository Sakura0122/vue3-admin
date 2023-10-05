import request from '@/utils/request'
import type { TradeMark, TradeMarkResponseData } from './type'

/**
 * 获取品牌数据
 * @param page 当前页码
 * @param limit 一页几条
 */
export function getTrademarkDataApi(page: number, limit: number) {
  return request<TradeMarkResponseData>(`/admin/product/baseTrademark/${page}/${limit}`)
}

/**
 * 新增或修改品牌数据
 * @param data 品牌数据
 */
export function addOrUpdateTrademarkApi(data: TradeMark) {
  if (data.id) {
    return request<any>('/admin/product/baseTrademark/update', 'put', data)
  } else {
    return request<any>('/admin/product/baseTrademark/save', 'post', data)
  }
}

export function delTrademarkApi(id: number) {
  return request<any>(`/admin/product/baseTrademark/remove/${id}`, 'delete')
}
