import http from './http'

export interface Errand {
  id: number
  title: string
  type: string
  typeName: string
  description: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  deadline: string
  publisher: string
  publisherAvatar: string
  publishTime: string
  campus: string
  image: string
  status: string
}

export const getErrands = (params?: { type?: string; campus?: string }) => {
  return http.get<Errand[]>('/errands', { params })
}

export const getErrandById = (id: number) => {
  return http.get<Errand>(`/errands/${id}`)
}

export interface CreateErrandData {
  title: string
  type: string
  typeName: string
  description: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  deadline: string
  campus: string
  image?: string
}

export const createErrand = (data: CreateErrandData) => {
  return http.post<Errand>('/errands', data)
}
