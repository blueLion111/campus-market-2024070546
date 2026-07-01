<script setup lang="ts">
import { ref, nextTick, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getConversations, getMessages, createMessage, type Conversation, type Message } from '../api/message'

const router = useRouter()

const currentUserId = 1
const conversations = ref<Conversation[]>([])
const activeConversationId = ref<number | ''>('')
const searchKeyword = ref('')
const myAvatar = 'https://picsum.photos/seed/avatar-zhangwei/100/100'

const messages = ref<Message[]>([])

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const quickReplies = [
  '还在吗？',
  '可以便宜点吗？',
  '什么时候方便交易？',
  '在哪个校区？',
]

const fetchConversations = async () => {
  try {
    const res = await getConversations({ currentUserId })
    conversations.value = res.data
    if (res.data.length > 0 && !activeConversationId.value) {
      const firstConv = res.data[0]
      if (firstConv) {
        activeConversationId.value = firstConv.id
        fetchMessages(firstConv.id)
      }
    }
  } catch (err) {
    console.error('获取会话列表失败:', err)
  }
}

const fetchMessages = async (conversationId: number) => {
  try {
    const res = await getMessages({ conversationId })
    messages.value = res.data
    nextTick(() => {
      scrollToBottom()
    })
  } catch (err) {
    console.error('获取消息列表失败:', err)
  }
}

const selectConversation = (conv: Conversation) => {
  activeConversationId.value = conv.id
  conv.unreadCount = 0
  fetchMessages(conv.id)
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !activeConversationId.value) return

  const newMsg: Omit<Message, 'id'> = {
    conversationId: activeConversationId.value as number,
    senderId: currentUserId,
    content: inputMessage.value.trim(),
    time: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isMe: true,
  }

  try {
    const res = await createMessage(newMsg)
    messages.value.push(res.data)
  } catch {
    messages.value.push({ ...newMsg, id: Date.now() })
  }

  const conv = conversations.value.find(c => c.id === activeConversationId.value)
  if (conv) {
    conv.lastMessage = newMsg.content
    conv.lastTime = newMsg.time
  }

  inputMessage.value = ''

  nextTick(() => {
    scrollToBottom()
  })

  setTimeout(() => {
    const reply: Omit<Message, 'id'> = {
      conversationId: activeConversationId.value as number,
      senderId: conv?.otherUserId || 0,
      content: '好的，收到！',
      time: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
    }
    messages.value.push({ ...reply, id: Date.now() + 1 })
    if (conv) {
      conv.lastMessage = reply.content
      conv.lastTime = reply.time
    }
    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const goToDetail = () => {
  if (!activeConversation.value) return
  router.push({
    path: `/detail/${activeConversation.value.itemId}`,
    query: { type: activeConversation.value.itemType }
  })
}

const sendQuickReply = (text: string) => {
  inputMessage.value = text
  sendMessage()
}

const activeConversation = computed(() => {
  return conversations.value.find(c => c.id === activeConversationId.value)
})

const filteredConversations = computed(() => {
  if (!searchKeyword.value) return conversations.value
  return conversations.value.filter(conv =>
    conv.otherUserName.includes(searchKeyword.value) ||
    conv.itemTitle.includes(searchKeyword.value)
  )
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    sendMessage()
  }
}

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <div class="message-page">
    <h2 class="page-title">消息中心</h2>

    <div class="message-container">
      <div class="conversation-list">
        <div class="search-box">
          <el-input v-model="searchKeyword" placeholder="搜索联系人或商品">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="conv-list">
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            :class="['conv-item', { active: activeConversationId === conv.id }]"
            @click="selectConversation(conv)"
          >
            <div class="conv-avatar">
              <el-avatar :size="48" :src="conv.otherAvatar" />
              <el-badge v-if="conv.unreadCount > 0" :value="conv.unreadCount" :max="9" class="unread-badge" />
            </div>
            <div class="conv-content">
              <div class="conv-header">
                <span class="conv-name">{{ conv.otherUserName }}</span>
                <span class="conv-time">{{ conv.lastTime }}</span>
              </div>
              <div class="conv-item-info">
                <el-avatar :size="24" :src="conv.itemImage" class="conv-item-thumb" />
                <span class="conv-last">{{ conv.lastMessage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-section">
        <div class="chat-header">
          <div class="chat-user">
            <el-avatar :size="40" :src="activeConversation?.otherAvatar" />
            <div class="chat-user-info">
              <span class="chat-username">{{ activeConversation?.otherUserName }}</span>
              <span class="chat-status">在线</span>
            </div>
          </div>
          <el-card v-if="activeConversation" shadow="never" class="item-card-mini">
            <el-image :src="activeConversation?.itemImage" style="width: 44px; height: 44px; border-radius: 6px" fit="cover" />
            <div class="item-card-info">
              <span class="item-title">{{ activeConversation?.itemTitle }}</span>
              <el-button type="primary" size="small" link @click="goToDetail">查看详情</el-button>
            </div>
          </el-card>
        </div>

        <div class="messages-container" ref="messagesContainer">
          <div class="time-divider">
            <span>今天 10:20</span>
          </div>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-item', msg.isMe ? 'me' : 'other']"
          >
            <el-avatar
              v-if="!msg.isMe"
              :size="36"
              :src="activeConversation?.otherAvatar"
              class="msg-avatar"
            />
            <div class="msg-bubble">
              <span>{{ msg.content }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
            <el-avatar
              v-if="msg.isMe"
              :size="36"
              :src="myAvatar"
              class="msg-avatar"
            />
          </div>
        </div>

        <div class="quick-replies">
          <span class="quick-label">快捷回复：</span>
          <el-tag
            v-for="reply in quickReplies"
            :key="reply"
            size="small"
            effect="plain"
            class="quick-tag"
            @click="sendQuickReply(reply)"
          >
            {{ reply }}
          </el-tag>
        </div>

        <div class="input-section">
          <div class="input-wrapper">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入消息..."
              @keydown="handleKeyDown"
              resize="none"
            />
          </div>
          <div class="input-actions">
            <span class="tip">Ctrl + Enter 快速发送</span>
            <el-button type="primary" @click="sendMessage" class="send-btn">
              <el-icon><Promotion /></el-icon>
              发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
}

.page-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 20px 0;
}

.message-container {
  display: flex;
  flex: 1;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.conversation-list {
  width: 320px;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.conv-list {
  flex: 1;
  overflow-y: auto;
}

.conv-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f5f7fa;
}

.conv-item:hover {
  background: #ecf5ff;
}

.conv-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.conv-avatar {
  position: relative;
  flex-shrink: 0;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.conv-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.conv-time {
  font-size: 12px;
  color: #909399;
}

.conv-item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.conv-item-thumb {
  border-radius: 4px;
  flex-shrink: 0;
}

.conv-last {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-username {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chat-status {
  font-size: 12px;
  color: #67c23a;
}

.item-card-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: #f5f7fa;
  border-radius: 8px;
  border: none;
}

.item-card-mini :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
}

.item-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 13px;
  color: #606266;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #f5f7fa;
}

.time-divider {
  text-align: center;
  margin-bottom: 20px;
}

.time-divider span {
  font-size: 12px;
  color: #909399;
  background: #fff;
  padding: 4px 12px;
  border-radius: 4px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-item.me {
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  position: relative;
}

.message-item.other .msg-bubble {
  background: #fff;
  color: #303133;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.message-item.me .msg-bubble {
  background: #409eff;
  color: #fff;
  border-top-right-radius: 4px;
}

.msg-time {
  display: block;
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.quick-replies {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 24px;
  background: #fff;
  border-top: 1px solid #ebeef5;
}

.quick-label {
  font-size: 12px;
  color: #909399;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.quick-tag:hover {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.input-section {
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
  background: #fff;
}

.input-wrapper :deep(.el-textarea__inner) {
  border-radius: 8px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.tip {
  font-size: 12px;
  color: #909399;
}

.send-btn {
  min-width: 100px;
}
</style>
