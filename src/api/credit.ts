import http from './http'

export interface CreditRecord {
  id: number
  userId: number
  type: string
  change: number
  reason: string
  orderNo: string
  balanceAfter: number
  createTime: string
}

export const getCreditRecords = (params?: { userId?: number }) => {
  return http.get<CreditRecord[]>('/creditRecords', { params })
}

export const createCreditRecord = (data: Omit<CreditRecord, 'id'>) => {
  return http.post<CreditRecord>('/creditRecords', data)
}
