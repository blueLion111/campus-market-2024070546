<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { getTrades, type Trade } from '../api/trade'
import { createFavorite, deleteFavorite } from '../api/favorite'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import SearchBar from '../components/SearchBar.vue'
import { useFavoriteStore } from '../stores/favorite'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const currentUserId = 1

const activeCategory = ref('all')
const loading = ref(false)
const error = ref(false)
const errorMsg = ref('')
const searchKeyword = ref('')
const products = ref<Trade[]>([])

const categories = [
  { key: 'all', label: '全部' },
  { key: 'textbook', label: '教材数码' },
  { key: 'daily', label: '生活用品' },
  { key: 'transport', label: '交通工具' },
  { key: 'clothing', label: '服饰鞋包' },
  { key: 'other', label: '其他' },
]

const fetchTrades = async () => {
  loading.value = true
  error.value = false
  try {
    const params = activeCategory.value !== 'all'
      ? { category: activeCategory.value }
      : undefined
    const res = await getTrades(params)
    products.value = res.data
  } catch (err) {
    console.error('获取二手商品列表失败:', err)
    error.value = true
    errorMsg.value = '获取数据失败，请检查网络或服务器是否启动'
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.campus.toLowerCase().includes(keyword) ||
      p.location.toLowerCase().includes(keyword)
    )
  }
  return result
})

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
  fetchTrades()
}

const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
}

const handleRetry = () => {
  fetchTrades()
}

const goToDetail = (id: string | number) => {
  router.push({ path: `/detail/${id}`, query: { type: 'trade' } })
}

const handleToggleFavorite = async (e: MouseEvent, product: Trade) => {
  e.stopPropagation()
  const isCurrentlyFavorite = favoriteStore.hasItem(product.id, 'trade')

  if (isCurrentlyFavorite) {
    // 取消收藏：先调后端 API，再更新前端 Store
    const favId = favoriteStore.getItemId(product.id, 'trade')
    if (favId !== null) {
      try {
        await deleteFavorite(Number(favId))
      } catch (err) {
        console.warn('取消收藏后端同步失败:', err)
      }
    }
    favoriteStore.remove(product.id, 'trade')
    ElMessage.info('已取消收藏')
  } else {
    // 添加收藏：先调后端 API，再更新前端 Store
    try {
      await createFavorite({
        userId: currentUserId,
        itemId: Number(product.id),
        itemType: 'trade',
        title: product.title,
        price: product.price ?? null,
        image: product.image,
        publisher: product.publisher || '匿名用户',
        campus: product.campus || '',
        favoriteTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'active',
      })
    } catch (err) {
      console.warn('添加收藏后端同步失败:', err)
    }
    favoriteStore.add({
      itemId: product.id,
      itemType: 'trade',
      title: product.title,
      price: product.price ?? null,
      image: product.image,
      publisher: product.publisher || '匿名用户',
      campus: product.campus || '',
    })
    ElMessage.success('收藏成功')
  }
}

onMounted(() => {
  fetchTrades()
})
</script>

<template>
  <div class="trade-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">二手交易</h1>
          <p class="hero-subtitle">校园闲置物品流转平台</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">12,580+</span>
              <span class="stat-label">在售商品</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">8,920+</span>
              <span class="stat-label">成交订单</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">3,650+</span>
              <span class="stat-label">活跃用户</span>
            </div>
          </div>
        </div>
        <div class="hero-decor">
          <div class="decor-circle c1"></div>
          <div class="decor-circle c2"></div>
          <div class="decor-circle c3"></div>
        </div>
      </div>
    </section>

    <section class="category-section">
      <div class="category-tabs">
        <div
          v-for="cat in categories"
          :key="cat.key"
          :class="['category-tab', { active: activeCategory === cat.key }]"
          @click="handleCategoryChange(cat.key)"
        >
          {{ cat.label }}
        </div>
      </div>
    </section>

    <section class="products-section">
      <div class="section-header">
        <h2 class="section-title">精选好物</h2>
        <span class="section-count">共 {{ filteredProducts.length }} 件商品</span>
      </div>
      <div class="search-wrapper">
        <SearchBar
          v-model="searchKeyword"
          @search="handleSearch"
          placeholder="搜索商品名称、描述、地点..."
        />
      </div>
      <LoadingState v-if="loading" text="商品加载中..." />
      <ErrorState
        v-else-if="error"
        title="加载失败"
        :description="errorMsg"
        retry-text="重新加载"
        @retry="handleRetry"
      />
      <EmptyState v-else-if="filteredProducts.length === 0" title="暂无商品" description="换个关键词试试吧~" />
      <div v-else class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="goToDetail(product.id)"
        >
          <div class="product-image-wrapper">
            <img :src="product.image" :alt="product.title" class="product-image" />
            <div class="product-badge">
              <span class="badge-discount">省{{ product.originalPrice - product.price }}元</span>
            </div>
            <div class="favorite-btn" @click="handleToggleFavorite($event, product)">
              <el-icon class="star" :class="{ active: favoriteStore.hasItem(product.id, 'trade') }"><Star /></el-icon>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="product-price">
              <span class="price-current">¥{{ product.price }}</span>
              <span class="price-original">¥{{ product.originalPrice }}</span>
            </div>
            <div class="product-footer">
              <div class="seller-info">
                <img :src="product.publisherAvatar" :alt="product.publisher" class="seller-avatar" />
                <span class="seller-name">{{ product.publisher }}</span>
              </div>
              <span class="product-campus">{{ product.campus }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.trade-page {
  background: var(--color-bg);
  min-height: 100vh;
}

.hero-section {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 80px 0 64px;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text {
  color: var(--color-text-primary);
}

.hero-title {
  font-size: 40px;
  font-weight: 600;
  margin: 0 0 var(--space-3) 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 15px;
  margin: 0 0 40px 0;
  color: var(--color-text-tertiary);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 48px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

.hero-decor {
  display: none;
}

.category-section {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 24px 0;
  margin-bottom: 0;
}

.category-tabs {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-5);
}

.category-tab {
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
  border: 1px solid var(--color-border);
}

.category-tab:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.category-tab.active {
  background: var(--color-text-primary);
  color: #fff;
  border-color: var(--color-text-primary);
  font-weight: 500;
}

.products-section {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 48px var(--space-5) 64px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.section-count {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.product-card:hover {
  border-color: var(--color-text-tertiary);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: var(--color-border-light);
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-image {
  transform: scale(1.02);
}

.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.badge-discount {
  background: var(--color-text-primary);
  color: #fff;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 400;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.favorite-btn:hover {
  border-color: var(--color-text-secondary);
}

.favorite-btn .star {
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-tertiary);
}

.favorite-btn .star.active {
  color: var(--color-danger);
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
}

.price-current {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.price-original {
  font-size: 12px;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}

.seller-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.seller-avatar {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
}

.seller-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.product-campus {
  font-size: 11px;
  color: var(--color-text-tertiary);
  background: transparent;
  padding: 0;
  border-radius: 0;
}
</style>
