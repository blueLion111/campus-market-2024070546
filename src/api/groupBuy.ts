import http from './http'

export interface GroupBuy {
  id: number
  title: string
  type: string
  typeName: string
  description: string
  currentPeople: number
  totalPeople: number
  deadline: string
  location: string
  publisher: string
  publisherAvatar: string
  publishTime: string
  image: string
  status: string
}

export const getGroupBuys = (params?: { type?: string; location?: string }) => {
  return http.get<GroupBuy[]>('/groupBuys', { params })
}

export const getGroupBuyById = (id: number) => {
  return http.get<GroupBuy>(`/groupBuys/${id}`)
}

export interface CreateGroupBuyData {
  title: string
  type: string
  typeName: string
  description: string
  totalPeople: number
  deadline: string
  location: string
  image?: string
}

export const createGroupBuy = (data: CreateGroupBuyData) => {
  return http.post<GroupBuy>('/groupBuys', data)
}
