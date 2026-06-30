import http from './http'

export interface Conversation {
  id: number
  itemId: number
  itemType: string
  itemTitle: string
  itemImage: string
  buyerId: number
  sellerId: number
  otherUserId: number
  otherUserName: string
  otherAvatar: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  currentUserId: number
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  time: string
  isMe: boolean
}

export const getConversations = (params?: { currentUserId?: number }) => {
  return http.get<Conversation[]>('/conversations', { params })
}

export const getConversationById = (id: number) => {
  return http.get<Conversation>(`/conversations/${id}`)
}

export const getMessages = (params?: { conversationId?: number }) => {
  return http.get<Message[]>('/messages', { params })
}

export const createMessage = (data: Omit<Message, 'id'>) => {
  return http.post<Message>('/messages', data)
}

export const updateConversation = (id: number, data: Partial<Conversation>) => {
  return http.put<Conversation>(`/conversations/${id}`, data)
}
