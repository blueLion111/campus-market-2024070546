import http from './http'

export interface Wallet {
  id: number
  userId: number
  balance: number
  frozenAmount: number
  totalIncome: number
  totalExpense: number
  todayIncome: number
  todayExpense: number
}

export interface WalletRecord {
  id: number
  userId: number
  type: string
  typeName: string
  amount: number
  title: string
  orderNo: string
  balanceAfter: number
  createTime: string
}

export const getWallet = (userId: number) => {
  return http.get<Wallet[]>(`/wallets?userId=${userId}`)
}

export const getWalletRecords = (params?: { userId?: number; type?: string }) => {
  return http.get<WalletRecord[]>('/walletRecords', { params })
}

export const createWalletRecord = (data: Omit<WalletRecord, 'id'>) => {
  return http.post<WalletRecord>('/walletRecords', data)
}
