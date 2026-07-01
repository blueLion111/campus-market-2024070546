<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
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
  { label: '我的发布', value: realStats.value.published, icon: '📝', color: '#409EFF', route: '/profile', tab: 'published' },
  { label: '我的收藏', value: favoriteStore.total, icon: '⭐', color: '#E6A23C', route: '/profile', tab: 'favorites' },
  { label: '我的订单', value: realStats.value.orders, icon: '📦', color: '#67C23A', route: '/profile', tab: 'orders' },
  { label: '消息通知', value: realStats.value.messages, icon: '💬', color: '#F56C6C', route: '/message', tab: '' },
])

const menuItems = [
  { icon: '📝', label: '我的发布', desc: '查看我发布的所有信息', color: '#ECF5FF', route: '/profile', tab: 'published' },
  { icon: '⭐', label: '我的收藏', desc: '收藏的商品和信息', color: '#FDF6EC', route: '/profile', tab: 'favorites' },
  { icon: '💰', label: '我的钱包', desc: '余额和交易记录', color: '#F0F9EB', route: '/profile', tab: 'wallet' },
  { icon: '📦', label: '我的订单', desc: '购买和出售的订单', color: '#FEF0F0', route: '/profile', tab: 'orders' },
  { icon: '💬', label: '消息中心', desc: '系统消息和私信', color: '#F4F4F5', route: '/message', tab: '' },
  { icon: '🤝', label: '我的搭子', desc: '一起拼单的小伙伴', color: '#ECF5FF', route: '/profile', tab: 'partners' },
  { icon: '🎯', label: '信用分', desc: '查看信用等级详情', color: '#FDF6EC', route: '/profile', tab: 'credit' },
  { icon: '⚙️', label: '账号设置', desc: '个人资料和隐私设置', color: '#F0F9EB', route: '/profile', tab: 'settings' },
]

const userInfo = computed(() => userStore.currentUser)

// 根据昵称生成稳定的头像背景色
const avatarColor = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  const name = userInfo.value?.nickname || '用户'
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
})

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
        title: `发布了二手商品：${t.title}`,
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
    <section class="profile-hero" v-if="userInfo">
      <div class="hero-bg">
        <div class="bg-pattern"></div>
        <div class="bg-circle c1"></div>
        <div class="bg-circle c2"></div>
        <div class="bg-circle c3"></div>
      </div>
      <div class="profile-content">
        <div class="profile-left">
          <div class="avatar-wrapper">
            <div class="avatar" :style="{ background: avatarColor }">
              <span class="avatar-text">{{ userInfo.nickname.charAt(0) }}</span>
            </div>
            <div class="avatar-badge">
              <span class="badge-text">{{ userInfo.level }}</span>
            </div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ userInfo.nickname }}</h1>
            <div class="user-detail">
              <span class="user-college">{{ userInfo.college }}</span>
              <span class="user-divider">·</span>
              <span class="user-major">{{ userInfo.major }}</span>
            </div>
            <div class="user-meta">
              <span class="meta-tag">{{ userInfo.grade }}</span>
              <span class="meta-tag">{{ userInfo.campus }}</span>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="credit-card">
            <div class="credit-header">
              <span class="credit-icon">★</span>
              <span class="credit-label">信用分</span>
            </div>
            <div class="credit-score">{{ userInfo.creditScore }}</div>
            <div class="credit-level">优秀</div>
            <div class="credit-bar">
              <div class="credit-fill" :style="{ width: userInfo.creditScore + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <el-skeleton v-else :rows="5" animated />

    <section class="stats-section">
      <div class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
          style="cursor: pointer"
          @click="handleStatClick(stat)"
        >
          <div class="stat-icon" :style="{ backgroundColor: stat.color + '15', color: stat.color }">
            {{ stat.icon }}
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="menu-section">
      <h2 class="section-title">功能入口</h2>
      <div class="menu-grid">
        <div
          v-for="item in menuItems"
          :key="item.label"
          class="menu-item"
          style="cursor: pointer"
          @click="handleMenuClick(item)"
        >
          <div class="menu-icon" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
          </div>
          <div class="menu-info">
            <span class="menu-label">{{ item.label }}</span>
            <span class="menu-desc">{{ item.desc }}</span>
          </div>
          <div class="menu-arrow">›</div>
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
            <p class="favorite-type">{{ item.itemType === 'trade' ? '二手交易' : item.itemType }}</p>
          </div>
          <button class="remove-btn" @click="handleRemoveFavorite(item.itemId, item.itemType)">取消</button>
        </div>
      </div>
      <div v-else class="empty-favorites">
        <span class="empty-icon">☆</span>
        <p class="empty-text">还没有收藏的内容，去列表页看看吧~</p>
      </div>
    </section>

    <section class="activity-section">
      <div class="section-header">
        <h2 class="section-title">最近动态</h2>
        <span class="section-more">查看全部</span>
      </div>
      <div class="activity-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.title"
          class="activity-item"
        >
          <div class="activity-dot"></div>
          <div class="activity-content">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-center-page {
  padding-bottom: 48px;
}

.profile-hero {
  position: relative;
  border-radius: 16px;
  padding: 48px 56px;
  margin-bottom: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 40%, #79BBFF 100%);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%);
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.bg-circle.c1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -50px;
}

.bg-circle.c2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: 60%;
}

.bg-circle.c3 {
  width: 80px;
  height: 80px;
  top: 30%;
  left: 30%;
  background: rgba(255, 255, 255, 0.08);
}

.profile-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-text {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #E6A23C, #F0C78E);
  padding: 3px 10px;
  border-radius: 12px;
  border: 2px solid #fff;
}

.badge-text {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.user-info {
  color: #fff;
}

.user-name {
  font-size: 30px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.user-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  opacity: 0.95;
}

.user-divider {
  opacity: 0.6;
}

.user-meta {
  display: flex;
  gap: 10px;
}

.meta-tag {
  font-size: 13px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
}

.profile-right {
  flex-shrink: 0;
}

.credit-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.credit-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.credit-icon {
  font-size: 20px;
  color: #fff;
}

.credit-label {
  font-size: 14px;
  opacity: 0.9;
}

.credit-score {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.credit-level {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.credit-bar {
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.credit-fill {
  height: 100%;
  background: #fff;
  border-radius: 3px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.menu-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.menu-label {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.menu-desc {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-arrow {
  font-size: 22px;
  color: #C0C4CC;
  font-weight: 300;
  flex-shrink: 0;
}

.favorites-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.favorites-section .section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.title-count {
  font-size: 14px;
  color: #909399;
  font-weight: 400;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.favorite-card {
  border: 1px solid #EBEEF5;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s ease;
  background: #FAFBFC;
}

.favorite-card:hover {
  border-color: #409EFF;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.favorite-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.favorite-info {
  padding: 10px 12px;
}

.favorite-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-price {
  font-size: 15px;
  font-weight: 600;
  color: #F56C6C;
  margin: 0 0 4px 0;
}

.favorite-type {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.remove-btn {
  display: block;
  width: calc(100% - 24px);
  margin: 0 12px 12px 12px;
  padding: 6px 0;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  background: #fff;
  color: #909399;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  border-color: #F56C6C;
  color: #F56C6C;
  background: #FEF0F0;
}

.empty-favorites {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

.activity-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header .section-title {
  margin: 0;
}

.section-more {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
  transition: color 0.2s;
}

.section-more:hover {
  color: #66B1FF;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #F2F6FC;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409EFF;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-title {
  font-size: 14px;
  color: #606266;
}

.activity-time {
  font-size: 13px;
  color: #C0C4CC;
  flex-shrink: 0;
}
</style>
