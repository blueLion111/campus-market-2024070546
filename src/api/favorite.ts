import http from './http'

export interface Favorite {
  id: number
  userId: number
  itemId: number
  itemType: string
  title: string
  price: number | null
  image: string
  publisher: string
  campus: string
  favoriteTime: string
  status: string
}

export const getFavorites = (params?: { userId?: number; itemType?: string }) => {
  return http.get<Favorite[]>('/favorites', { params })
}

export const createFavorite = (data: Omit<Favorite, 'id'>) => {
  return http.post<Favorite>('/favorites', data)
}

export const deleteFavorite = (id: number) => {
  return http.delete(`/favorites/${id}`)
}
