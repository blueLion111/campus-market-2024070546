<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingCart, Search, User, Star, Bell, Fire, Plus, WarningFilled, Location
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
  typeColor: string
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
      typeName: '二手交易',
      typeColor: '#409EFF',
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
      typeColor: '#E6A23C',
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
      typeName: '拼单搭子',
      typeColor: '#67C23A',
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
      typeName: '跑腿委托',
      typeColor: '#F56C6C',
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
  { id: 1, title: '关于校园集市交易安全的温馨提示', time: '今天' },
  { id: 2, title: '本周失物招领统计：已找回15件物品', time: '昨天' },
  { id: 3, title: '拼单搭子活动火热进行中', time: '本周' },
])

const hotPosts = ref([
  { id: 1, title: '全新iPad 低价转让', views: 256 },
  { id: 2, title: '英语四级资料打包出售', views: 189 },
  { id: 3, title: '代取快递长期接单', views: 142 },
])

const categoryIcons: Record<string, any> = {
  secondhand: markRaw(ShoppingCart),
  lost: markRaw(Search),
  group: markRaw(User),
  errand: markRaw(Fire),
}

const categories = ref([
  {
    key: 'secondhand',
    name: '二手交易',
    description: '闲置物品，一键转卖',
    color: '#409EFF',
    bgColor: 'rgba(64, 158, 255, 0.1)',
  },
  {
    key: 'lost',
    name: '失物招领',
    description: '失物寻回，温暖校园',
    color: '#E6A23C',
    bgColor: 'rgba(230, 162, 60, 0.1)',
  },
  {
    key: 'group',
    name: '拼单搭子',
    description: '省钱省心，一起拼团',
    color: '#67C23A',
    bgColor: 'rgba(103, 194, 58, 0.1)',
  },
  {
    key: 'errand',
    name: '跑腿委托',
    description: '代取代办，省时省力',
    color: '#F56C6C',
    bgColor: 'rgba(245, 108, 108, 0.1)',
  },
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
  console.log('点击卡片，跳转到详情页:', item.id, '类型:', type)
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
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">校园轻集市</h1>
          <p class="hero-subtitle">
            让校园生活更便捷
            <span class="divider">·</span>
            二手交易
            <span class="divider">·</span>
            失物招领
            <span class="divider">·</span>
            拼单搭子
            <span class="divider">·</span>
            跑腿委托
          </p>
        </div>

        <div class="hero-search">
          <el-input
            v-model="searchKeyword"
            size="large"
            placeholder="搜索你想要的校园好物、服务..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-prefix-icon"><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" size="large" @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>

        <div class="hero-categories">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="category-card"
            @click="goToCategory(cat.key)"
          >
            <div class="category-icon" :style="{ backgroundColor: cat.bgColor }">
              <component :is="categoryIcons[cat.key]" class="category-icon-svg" />
            </div>
            <div class="category-info">
              <h3 class="category-name" :style="{ color: cat.color }">{{ cat.name }}</h3>
              <p class="category-desc">{{ cat.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主体内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧信息流卡片 -->
      <div class="main-content">
        <div class="section-header">
          <h2>今日集市</h2>
          <span class="subtitle">最新发布的校园信息</span>
          <el-button type="primary" size="small" link @click="router.push('/list')">
            查看更多
          </el-button>
        </div>

        <div class="card-grid">
          <div
            v-for="post in paginatedPosts"
            :key="post.id"
            class="post-card"
            @click="goToDetail(post)"
          >
            <div class="type-tag" :style="{ backgroundColor: post.typeColor }">
              {{ post.typeName }}
            </div>

            <div class="card-image">
              <img :src="post.image" :alt="post.title" loading="lazy" />
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ post.title }}</h3>

              <div class="card-meta">
                <span class="price" v-if="post.price">{{ formatPrice(post.price) }}</span>
                <span class="price free" v-else>免费</span>
                <span class="location">
                  <el-icon class="location-icon"><Location /></el-icon>
                  {{ post.campus }}
                </span>
              </div>

              <div class="card-footer">
                <div class="publisher">
                  <el-avatar :size="24" :src="post.avatar" />
                  <span class="publisher-name">{{ post.publisher }}</span>
                </div>

                <div class="actions">
                  <span class="favorite-count" :class="{ active: post.isFavorite }">
                    <el-icon class="favorite-icon"><Star /></el-icon>
                    {{ post.favoriteCount }}
                  </span>
                </div>
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
            background
          />
        </div>
      </div>

      <!-- 右侧侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-card notice-card">
          <div class="card-header">
            <el-icon class="sidebar-icon notice-icon"><Bell /></el-icon>
            <span>校园公告</span>
          </div>
          <div class="notice-list">
            <div v-for="notice in notices" :key="notice.id" class="notice-item">
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-time">{{ notice.time }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card hot-card">
          <div class="card-header">
            <el-icon class="sidebar-icon hot-icon"><Fire /></el-icon>
            <span>热门推荐</span>
          </div>
          <div class="hot-list">
            <div v-for="(hot, index) in hotPosts" :key="hot.id" class="hot-item">
              <span class="hot-index" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <span class="hot-title">{{ hot.title }}</span>
              <span class="hot-views">{{ hot.views }}浏览</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card quick-publish">
          <div class="publish-header">
            <el-icon class="publish-icon"><Plus /></el-icon>
            <span>快速发布</span>
          </div>
          <el-button type="primary" size="large" class="publish-btn" @click="router.push('/publish')">
            发布信息
          </el-button>
          <div class="publish-types">
            <el-tag :color="'#409EFF'" effect="dark" size="small" @click="router.push('/publish')">
              二手交易
            </el-tag>
            <el-tag :color="'#E6A23C'" effect="dark" size="small" @click="router.push('/publish')">
              失物招领
            </el-tag>
            <el-tag :color="'#67C23A'" effect="dark" size="small" @click="router.push('/publish')">
              拼单搭子
            </el-tag>
            <el-tag :color="'#F56C6C'" effect="dark" size="small" @click="router.push('/publish')">
              跑腿委托
            </el-tag>
          </div>
        </div>

        <div class="sidebar-card safety-card">
          <div class="card-header">
            <el-icon class="sidebar-icon safety-icon"><WarningFilled /></el-icon>
            <span>交易安全提示</span>
          </div>
          <ul class="safety-tips">
            <li>选择公共安全场所交易</li>
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
  background: #f5f7fa;
}

/* Hero 区域 */
.hero-section {
  position: relative;
  width: 100%;
  padding: 60px 0 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #e8f3ff 0%, #d4e8ff 50%, #ecf5ff 100%);
  z-index: 0;
}

.hero-bg::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-bg::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(102, 177, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.hero-text {
  margin-bottom: 40px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: #606266;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.divider {
  color: #409EFF;
  margin: 0 8px;
  font-weight: 600;
}

.hero-search {
  max-width: 680px;
  margin: 0 auto 50px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 50px;
  padding: 8px 8px 8px 24px;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.15);
  background: #fff;
}

.search-input :deep(.el-input__inner) {
  font-size: 16px;
  height: 48px;
}

.search-input :deep(.el-input-group__append) {
  border: none;
  background: transparent;
  padding: 0;
}

.search-input :deep(.el-button--primary) {
  border-radius: 50px;
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
}

.hero-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.category-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  text-align: left;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(64, 158, 255, 0.2);
}

.category-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon-svg {
  width: 28px;
  height: 28px;
  color: #409EFF;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
}

.category-desc {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

/* 内容区域 */
.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  display: flex;
  gap: 28px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  flex: 1;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
}

.type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.card-image {
  height: 180px;
  overflow: hidden;
  background: #f0f2f5;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .card-image img {
  transform: scale(1.05);
}

.card-body {
  padding: 14px;
}

.card-title {
  font-size: 15px;
  color: #303133;
  margin: 0 0 10px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #F56C6C;
}

.price.free {
  font-size: 14px;
  color: #67C23A;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f7fa;
}

.publisher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publisher-name {
  font-size: 12px;
  color: #606266;
}

.favorite-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #c0c4cc;
}

.favorite-count.active {
  color: #F56C6C;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 侧边栏 */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
  font-size: 15px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f7fa;
}

.notice-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.notice-title {
  color: #606266;
  flex: 1;
  line-height: 1.5;
}

.notice-time {
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 8px;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.hot-index {
  width: 22px;
  height: 22px;
  background: #e6e8eb;
  color: #909399;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.hot-index.top {
  background: #409EFF;
  color: #fff;
}

.hot-title {
  flex: 1;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-views {
  color: #c0c4cc;
  font-size: 12px;
  flex-shrink: 0;
}

.quick-publish {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
}

.publish-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 14px;
}

.publish-btn {
  width: 100%;
  background: #fff;
  color: #409EFF;
  border: none;
  font-weight: 600;
  margin-bottom: 12px;
}

.publish-btn:hover {
  background: #f0f7ff;
}

.publish-types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.safety-card {
  border: 1px solid #fdf6ec;
  background: #fdf6ec;
}

.safety-tips {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #865a21;
  line-height: 1.8;
}

.safety-tips li {
  margin-bottom: 4px;
}

.search-prefix-icon {
  font-size: 16px;
  margin-right: 4px;
}

.category-emoji {
  font-size: 32px;
  line-height: 1;
}

.location-icon {
  font-size: 12px;
  margin-right: 2px;
}

.favorite-icon {
  font-size: 14px;
  margin-right: 2px;
}

.sidebar-icon {
  font-size: 18px;
  line-height: 1;
}

.publish-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
