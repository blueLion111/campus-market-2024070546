import http from './http'

export interface Order {
  id: number
  orderNo: string
  userId: number
  itemId: number
  itemType: string
  title: string
  image: string
  price: number
  type: string
  typeName: string
  sellerName?: string
  buyerName?: string
  publisherName?: string
  ownerName?: string
  status: string
  statusText: string
  createTime: string
  campus: string
}

export const getOrders = (params?: { userId?: number; type?: string; status?: string }) => {
  return http.get<Order[]>('/orders', { params })
}

export const getOrderById = (id: number) => {
  return http.get<Order>(`/orders/${id}`)
}

export const createOrder = (data: Omit<Order, 'id'>) => {
  return http.post<Order>('/orders', data)
}

export const updateOrder = (id: number, data: Partial<Order>) => {
  return http.put<Order>(`/orders/${id}`, data)
}
