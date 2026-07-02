<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document, Star, Box, ChatDotRound, Wallet, UserFilled, Medal, Setting, User
} from '@element-plus/icons-vue'
import { getTrades } from '../api/trade'
import { getLostFounds } from '../api/lostFound'
import { getGroupBuys } from '../api/groupBuy'
import { getErrands } from '../api/errand'
import { getOrders } from '../api/order'
import { getConversations } from '../api/message'
import { deleteFavorite } from '../api/favorite'
import { useUserStore } from '../stores/user'
import { useFavoriteStore } from '../stores/favorite'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const loading = ref(false)

const realStats = ref({
  published: 0,
  orders: 0,
  messages: 0,
})

const recentActivities = ref<any[]>([])

const stats = computed(() => [
  { label: '我的发布', value: realStats.value.published, icon: Document, route: '/profile', tab: 'published' },
  { label: '我的收藏', value: favoriteStore.total, icon: Star, route: '/profile', tab: 'favorites' },
  { label: '我的订单', value: realStats.value.orders, icon: Box, route: '/profile', tab: 'orders' },
  { label: '消息通知', value: realStats.value.messages, icon: ChatDotRound, route: '/message', tab: '' },
])

const menuItems = [
  { icon: Document, label: '我的发布', route: '/profile', tab: 'published' },
  { icon: Star, label: '我的收藏', route: '/profile', tab: 'favorites' },
  { icon: Wallet, label: '我的钱包', route: '/profile', tab: 'wallet' },
  { icon: Box, label: '我的订单', route: '/profile', tab: 'orders' },
  { icon: ChatDotRound, label: '消息中心', route: '/message', tab: '' },
  { icon: UserFilled, label: '我的搭子', route: '/profile', tab: 'partners' },
  { icon: Medal, label: '信用分', route: '/profile', tab: 'credit' },
  { icon: Setting, label: '账号设置', route: '/profile', tab: 'settings' },
]

const userInfo = computed(() => userStore.currentUser!)

const handleStatClick = (stat: any) => {
  if (stat.route) {
    router.push(stat.tab ? { path: stat.route, query: { tab: stat.tab } } : stat.route)
  }
}

const handleMenuClick = (item: any) => {
  if (item.route) {
    router.push(item.tab ? { path: item.route, query: { tab: item.tab } } : item.route)
  }
}

const fetchAllData = async () => {
  loading.value = true
  try {
    const currentUserId = 1
    const [tradesRes, lostFoundsRes, groupBuysRes, errandsRes, orderRes, convRes] = await Promise.all([
      getTrades().catch(() => ({ data: [] })),
      getLostFounds().catch(() => ({ data: [] })),
      getGroupBuys().catch(() => ({ data: [] })),
      getErrands().catch(() => ({ data: [] })),
      getOrders({ userId: currentUserId }).catch(() => ({ data: [] })),
      getConversations({ currentUserId }).catch(() => ({ data: [] })),
    ])

    const trades = (tradesRes as any).data || []
    const lostFounds = (lostFoundsRes as any).data || []
    const groupBuys = (groupBuysRes as any).data || []
    const errands = (errandsRes as any).data || []
    const orders = (orderRes as any).data || []
    const conversations = (convRes as any).data || []

    realStats.value = {
      published: trades.length + lostFounds.length + groupBuys.length + errands.length,
      orders: orders.length,
      messages: conversations.length,
    }

    const activities: any[] = []
    trades.slice(0, 2).forEach((t: any) => {
      activities.push({
        type: 'publish',
        title: `发布了：${t.title}`,
        time: t.publishTime || '',
      })
    })
    favoriteStore.favorites.slice(0, 1).forEach((f: any) => {
      activities.push({
        type: 'favorite',
        title: `收藏了：${f.title}`,
        time: f.favoriteTime || '',
      })
    })
    orders.slice(0, 1).forEach((o: any) => {
      activities.push({
        type: 'order',
        title: `${o.typeName}：${o.title}`,
        time: o.createTime || '',
      })
    })

    recentActivities.value = activities
      .sort((a, b) => (b.time || '').localeCompare(a.time || ''))
      .slice(0, 4)
  } finally {
    loading.value = false
  }
}

const handleRemoveFavorite = async (itemId: string | number, itemType: string) => {
  const favId = favoriteStore.getItemId(itemId, itemType)
  if (favId !== null) {
    try {
      await deleteFavorite(Number(favId))
    } catch (err) {
      console.warn('取消收藏后端同步失败:', err)
    }
  }
  favoriteStore.remove(itemId, itemType)
  ElMessage.info('已取消收藏')
}

watch(
  () => favoriteStore.total,
  () => {
    if (recentActivities.value.length > 0) {
      const activities: any[] = []
      favoriteStore.favorites.slice(0, 2).forEach((f: any) => {
        activities.push({
          type: 'favorite',
          title: `收藏了：${f.title}`,
          time: f.favoriteTime || '',
        })
      })
      const otherActivities = recentActivities.value.filter(a => a.type !== 'favorite')
      recentActivities.value = [...activities, ...otherActivities]
        .sort((a, b) => (b.time || '').localeCompare(a.time || ''))
        .slice(0, 4)
    }
  }
)

onMounted(() => {
  fetchAllData()
})
</script>

<template>
  <div class="user-center-page">
    <div class="container">
      <section v-if="!userStore.isLoggedIn" class="not-logged-in">
        <div class="not-logged-in-card">
          <div class="not-logged-in-icon">
            <el-icon :size="48"><User /></el-icon>
          </div>
          <h2 class="not-logged-in-title">请先登录</h2>
          <p class="not-logged-in-desc">登录后查看个人资料、收藏信息和发布记录</p>
          <el-button type="primary" @click="router.push('/login')">去登录</el-button>
        </div>
      </section>

      <template v-else>
      <section class="profile-section">
        <div class="profile-header">
          <div class="avatar">
            <span class="avatar-text">{{ userInfo.nickname.charAt(0) }}</span>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ userInfo.nickname }}</h1>
            <p class="user-detail">
              {{ userInfo.college }} · {{ userInfo.major }} · {{ userInfo.grade }}
            </p>
            <p class="user-campus">{{ userInfo.campus }}</p>
          </div>
        </div>
        <div class="credit-info">
          <span class="credit-score">{{ userInfo.creditScore }}</span>
          <span class="credit-label">信用分</span>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-grid">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-item"
            @click="handleStatClick(stat)"
          >
            <el-icon :size="18" class="stat-icon"><component :is="stat.icon" /></el-icon>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <section class="menu-section">
        <h2 class="section-title">功能入口</h2>
        <div class="menu-list">
          <div
            v-for="item in menuItems"
            :key="item.label"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <div class="menu-left">
              <el-icon :size="18" class="menu-icon"><component :is="item.icon" /></el-icon>
              <span class="menu-label">{{ item.label }}</span>
            </div>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </section>

      <section class="favorites-section">
        <div class="section-header">
          <h2 class="section-title">我的收藏 <span class="title-count">({{ favoriteStore.total }})</span></h2>
          <span class="section-more" @click="router.push({ path: '/profile', query: { tab: 'favorites' } })">查看全部</span>
        </div>
        <div v-if="favoriteStore.total > 0" class="favorites-grid">
          <div
            v-for="item in favoriteStore.favorites.slice(0, 4)"
            :key="item.itemType + '-' + item.itemId"
            class="favorite-card"
          >
            <img :src="item.image" :alt="item.title" class="favorite-image" />
            <div class="favorite-info">
              <h4 class="favorite-title">{{ item.title }}</h4>
              <p class="favorite-price" v-if="item.price">¥{{ item.price }}</p>
            </div>
            <button class="remove-btn" @click="handleRemoveFavorite(item.itemId, item.itemType)">取消</button>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-icon :size="32" class="empty-icon"><Star /></el-icon>
          <p class="empty-text">暂无收藏</p>
        </div>
      </section>

      <section class="activity-section">
        <div class="section-header">
          <h2 class="section-title">最近动态</h2>
        </div>
        <div class="activity-list">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="activity-item"
          >
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
          <div v-if="recentActivities.length === 0" class="empty-state small">
            <p class="empty-text">暂无动态</p>
          </div>
        </div>
      </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--space-7) var(--space-5);
}

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-7);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.user-name {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

.user-detail {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.user-campus {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.credit-info {
  text-align: right;
}

.credit-score {
  display: block;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.credit-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.stats-section {
  margin-bottom: var(--space-7);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.stat-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.stat-item:hover {
  border-color: var(--color-text-tertiary);
}

.stat-icon {
  color: var(--color-text-tertiary);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.menu-section {
  margin-bottom: var(--space-7);
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 var(--space-4) 0;
}

.menu-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: var(--color-bg);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.menu-icon {
  color: var(--color-text-tertiary);
}

.menu-label {
  font-size: 14px;
  color: var(--color-text-primary);
}

.menu-arrow {
  font-size: 18px;
  color: var(--color-text-muted);
  font-weight: 300;
}

.favorites-section {
  margin-bottom: var(--space-7);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.section-header .section-title {
  margin: 0;
}

.title-count {
  font-size: 13px;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.section-more {
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.section-more:hover {
  color: var(--color-text-primary);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.favorite-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.favorite-card:hover {
  border-color: var(--color-text-tertiary);
}

.favorite-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.favorite-info {
  padding: var(--space-3);
}

.favorite-title {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 var(--space-2) 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-price {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.remove-btn {
  display: block;
  width: calc(100% - 16px);
  margin: 0 8px 8px 8px;
  padding: 6px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.remove-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.activity-section {
  margin-bottom: var(--space-7);
}

.activity-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  font-size: 13px;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-title {
  color: var(--color-text-secondary);
}

.activity-time {
  color: var(--color-text-muted);
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: var(--space-7) 0;
  color: var(--color-text-tertiary);
}

.empty-state.small {
  padding: var(--space-5) 0;
}

.empty-icon {
  display: block;
  margin: 0 auto var(--space-3);
  color: var(--color-text-muted);
}

.empty-text {
  font-size: 13px;
  margin: 0;
  color: var(--color-text-tertiary);
}

.not-logged-in {
  padding: var(--space-8) 0;
}

.not-logged-in-card {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: var(--space-8) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.not-logged-in-icon {
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
}

.not-logged-in-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--space-2) 0;
  color: var(--color-text-primary);
}

.not-logged-in-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-5) 0;
}
</style>
