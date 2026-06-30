import http from './http'

export interface LostFound {
  id: number
  title: string
  type: string
  typeName: string
  itemName: string
  location: string
  time: string
  contact: string
  description: string
  publisher: string
  publisherAvatar: string
  campus: string
  image: string
  status: string
}

export const getLostFounds = (params?: { type?: string; campus?: string }) => {
  return http.get<LostFound[]>('/lostFounds', { params })
}

export const getLostFoundById = (id: string | number) => {
  return http.get<LostFound>(`/lostFounds/${id}`)
}

export interface CreateLostFoundData {
  title: string
  type: string
  typeName: string
  itemName: string
  location: string
  time: string
  contact: string
  campus: string
  image?: string
  description: string
}

export const createLostFound = (data: CreateLostFoundData) => {
  return http.post<LostFound>('/lostFounds', data)
}
