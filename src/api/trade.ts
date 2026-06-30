import http from './http'

export interface Trade {
  id: number
  title: string
  price: number
  originalPrice: number
  category: string
  categoryName: string
  condition: string
  publisher: string
  publisherAvatar: string
  publishTime: string
  campus: string
  location: string
  image: string
  description: string
  status: string
  viewCount: number
  favoriteCount: number
}

export const getTrades = (params?: { category?: string; campus?: string }) => {
  return http.get<Trade[]>('/trades', { params })
}

export const getTradeById = (id: string | number) => {
  return http.get<Trade>(`/trades/${id}`)
}

export interface CreateTradeData {
  title: string
  price: number
  originalPrice: number
  category: string
  categoryName: string
  condition: string
  campus: string
  location: string
  image?: string
  description: string
}

export const createTrade = (data: CreateTradeData) => {
  return http.post<Trade>('/trades', data)
}
