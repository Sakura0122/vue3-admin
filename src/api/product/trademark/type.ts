// 品牌类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

// 全部品牌的数据类型
export interface TradeMarkResponseData {
  records: TradeMark[]
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}
