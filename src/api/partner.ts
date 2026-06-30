import http from './http'

export interface Partner {
  id: number
  userId: number
  partnerId: number
  partnerName: string
  partnerAvatar: string
  type: string
  typeName: string
  itemTitle: string
  joinCount: number
  status: string
  statusText: string
  createTime: string
}

export const getPartners = (params?: { userId?: number; type?: string; status?: string }) => {
  return http.get<Partner[]>('/partners', { params })
}

export const createPartner = (data: Omit<Partner, 'id'>) => {
  return http.post<Partner>('/partners', data)
}

export const updatePartner = (id: number, data: Partial<Partner>) => {
  return http.put<Partner>(`/partners/${id}`, data)
}
