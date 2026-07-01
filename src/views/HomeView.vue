<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingCart, Search, UserFilled, Star, Bell, Sunny, Plus, Warning, Location
} from '@element-plus/icons-vue'
import { getTrades } from '../api/trade'
import { getLostFounds } from '../api/lostFound'
import { getGroupBuys } from '../api/groupBuy'
import { getErrands } from '../api/errand'

const router = useRouter()
const searchKeyword = ref('')
const loading = ref(false)

interface PostItem {
  id: number
  type: string
  typeName: string
  title: string
  price: number | null
  campus: string
  location: string
  image: string
  avatar: string
  publisher: string
  time: string
  favoriteCount: number
  isFavorite: boolean
}

const posts = ref<PostItem[]>([])

const fetchAllData = async () => {
  loading.value = true
  try {
    const [tradesRes, lostFoundsRes, groupBuysRes, errandsRes] = await Promise.all([
      getTrades().catch(() => ({ data: [] })),
      getLostFounds().catch(() => ({ data: [] })),
      getGroupBuys().catch(() => ({ data: [] })),
      getErrands().catch(() => ({ data: [] })),
    ])

    const tradeItems: PostItem[] = (tradesRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'secondhand',
      typeName: '二手',
      title: item.title,
      price: item.price,
      campus: item.campus,
      location: item.location,
      image: item.image,
      avatar: item.publisherAvatar,
      publisher: item.publisher,
      time: item.publishTime,
      favoriteCount: item.favoriteCount || 0,
      isFavorite: false,
    }))

    const lostFoundItems: PostItem[] = (lostFoundsRes.data || []).map((item: any) => ({
      id: item.id,
      type: item.type,
      typeName: item.typeName,
      title: item.title,
      price: null,
      campus: item.campus,
      location: item.location,
      image: item.image,
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      publisher: item.publisher || '匿名用户',
      time: item.time,
      favoriteCount: 0,
      isFavorite: false,
    }))

    const groupBuyItems: PostItem[] = (groupBuysRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'group',
      typeName: '拼单',
      title: item.title,
      price: null,
      campus: item.location,
      location: item.location,
      image: item.image,
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      publisher: item.publisher || '匿名用户',
      time: item.deadline,
      favoriteCount: 0,
      isFavorite: false,
    }))

    const errandItems: PostItem[] = (errandsRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'errand',
      typeName: '跑腿',
      title: item.title,
      price: item.reward,
      campus: item.campus,
      location: item.deliveryLocation,
      image: item.image,
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      publisher: item.publisher || '匿名用户',
      time: item.deadline,
      favoriteCount: 0,
      isFavorite: false,
    }))

    posts.value = [...tradeItems, ...lostFoundItems, ...groupBuyItems, ...errandItems]
  } catch (err) {
    console.error('获取数据失败:', err)
  } finally {
    loading.value = false
  }
}

const notices = ref([
  { id: 1, title: '交易安全温馨提示', time: '今天' },
  { id: 2, title: '本周失物招领统计', time: '昨天' },
])

const categoryIcons: Record<string, any> = {
  secondhand: ShoppingCart,
  lost: Search,
  group: UserFilled,
  errand: Sunny,
}

const categories = ref([
  { key: 'secondhand', name: '二手交易' },
  { key: 'lost', name: '失物招领' },
  { key: 'group', name: '拼单搭子' },
  { key: 'errand', name: '跑腿委托' },
])

const currentPage = ref(1)
const pageSize = ref(6)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return posts.value.slice(start, end)
})

const goToDetail = (item: any) => {
  const typeMap: Record<string, string> = {
    secondhand: 'trade',
    lost: 'lostFound',
    found: 'lostFound',
    group: 'groupBuy',
    errand: 'errand',
  }
  const type = typeMap[item.type] || ''
  router.push({ path: `/detail/${item.id}`, query: type ? { type } : {} }).catch(err => {
    console.error('跳转失败:', err)
  })
}

const formatPrice = (price: number | null) => {
  return price ? `¥${price}` : '面议'
}

const goToCategory = (key: string) => {
  router.push(`/list?type=${key}`)
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/list?keyword=${searchKeyword.value}`)
  }
}

onMounted(() => {
  fetchAllData()
})
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">校园轻集市</h1>
        <p class="hero-subtitle">二手交易 · 失物招领 · 拼单搭子 · 跑腿委托</p>

        <div class="hero-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索校园好物..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-prefix-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="hero-categories">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="category-item"
            @click="goToCategory(cat.key)"
          >
            <el-icon :size="20" class="category-icon"><component :is="categoryIcons[cat.key]" /></el-icon>
            <span class="category-name">{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="content-wrapper">
      <div class="main-content">
        <div class="section-header">
          <h2>最新发布</h2>
          <el-button type="primary" link @click="router.push('/list')">查看全部</el-button>
        </div>

        <div class="card-grid">
          <div
            v-for="post in paginatedPosts"
            :key="post.id"
            class="post-card"
            @click="goToDetail(post)"
          >
            <div class="card-image">
              <img :src="post.image" :alt="post.title" loading="lazy" />
              <span class="type-tag">{{ post.typeName }}</span>
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ post.title }}</h3>

              <div class="card-meta">
                <span class="price" v-if="post.price">{{ formatPrice(post.price) }}</span>
                <span class="price free" v-else>免费</span>
              </div>

              <div class="card-footer">
                <span class="location">
                  <el-icon :size="12"><Location /></el-icon>
                  {{ post.campus }}
                </span>
                <span class="favorite-count">
                  <el-icon :size="12"><Star /></el-icon>
                  {{ post.favoriteCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="posts.length"
            layout="prev, pager, next"
          />
        </div>
      </div>

      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="card-header">
            <el-icon :size="16"><Bell /></el-icon>
            <span>校园公告</span>
          </div>
          <div class="notice-list">
            <div v-for="notice in notices" :key="notice.id" class="notice-item">
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-time">{{ notice.time }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <div class="card-header">
            <el-icon :size="16"><Plus /></el-icon>
            <span>快速发布</span>
          </div>
          <el-button type="primary" class="publish-btn" @click="router.push('/publish')">
            发布信息
          </el-button>
        </div>

        <div class="sidebar-card">
          <div class="card-header">
            <el-icon :size="16"><Warning /></el-icon>
            <span>安全提示</span>
          </div>
          <ul class="safety-tips">
            <li>公共场所当面交易</li>
            <li>贵重物品当面验真</li>
            <li>保护个人隐私信息</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.hero-section {
  padding: 96px 0 80px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.hero-content {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-5);
  text-align: center;
}

.hero-title {
  font-size: 44px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 15px;
  color: var(--color-text-tertiary);
  margin: 0 0 56px 0;
  letter-spacing: 0.02em;
}

.hero-search {
  max-width: 560px;
  margin: 0 auto 40px;
}

.search-input :deep(.el-input__wrapper) {
  padding: 0 var(--space-4);
  height: 48px;
}

.search-input :deep(.el-input__inner) {
  font-size: 15px;
  height: 48px;
}

.search-prefix-icon {
  font-size: 18px;
  color: var(--color-text-tertiary);
}

.hero-categories {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
  font-size: 14px;
}

.category-item:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-primary);
}

.category-icon {
  font-size: 18px;
}

.content-wrapper {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 64px var(--space-5) 80px;
  display: flex;
  gap: 48px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  letter-spacing: -0.01em;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.post-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
}

.post-card:hover {
  border-color: var(--color-text-tertiary);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-border-light);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.post-card:hover .card-image img {
  transform: scale(1.02);
}

.type-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 3px 10px;
  background: rgba(26, 26, 26, 0.85);
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  border-radius: var(--radius-sm);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.price.free {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.location,
.favorite-count {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 56px;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.sidebar-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-light);
}

.notice-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.notice-title {
  color: var(--color-text-secondary);
  flex: 1;
  line-height: 1.6;
}

.notice-time {
  color: var(--color-text-muted);
  font-size: 12px;
  white-space: nowrap;
  margin-left: var(--space-3);
}

.publish-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
}

.safety-tips {
  margin: 0;
  padding-left: var(--space-4);
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 2;
}

.safety-tips li {
  margin: 0;
}
</style>
