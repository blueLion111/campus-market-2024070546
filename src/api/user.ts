import http from './http'

export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  college: string
  major: string
  grade: string
  studentId: string
  campus: string
  creditScore: number
  level: string
  publishCount: number
  favoriteCount: number
  orderCount: number
  messageCount: number
  joinDate: string
  phone: string
  email: string
}

export const getUsers = () => {
  return http.get<User[]>('/users')
}

export const getUserById = (id: number) => {
  return http.get<User>(`/users/${id}`)
}

export const createUser = (data: Partial<User>) => {
  return http.post<User>('/users', data)
}

export const updateUser = (id: number, data: Partial<User>) => {
  return http.put<User>(`/users/${id}`, data)
}
