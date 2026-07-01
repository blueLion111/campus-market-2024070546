<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTrades, type Trade } from '../api/trade'
import { createFavorite, deleteFavorite } from '../api/favorite'
import EmptyState from '../components/EmptyState.vue'
import { useFavoriteStore } from '../stores/favorite'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const currentUserId = 1

const activeCategory = ref('all')
const loading = ref(false)
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
  try {
    const params = activeCategory.value !== 'all'
      ? { category: activeCategory.value }
      : undefined
    const res = await getTrades(params)
    products.value = res.data
  } catch (err) {
    console.error('获取二手商品列表失败:', err)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === activeCategory.value)
})

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
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
      <div class="products-grid">
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
              <span class="star">{{ favoriteStore.hasItem(product.id, 'trade') ? '⭐' : '☆' }}</span>
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
      <EmptyState v-if="!loading && filteredProducts.length === 0" title="暂无商品" description="快来发布第一件闲置物品吧~" />
    </section>
  </div>
</template>

<style scoped>
.trade-page {
  padding-bottom: 48px;
}

.hero-section {
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 50%, #79BBFF 100%);
  border-radius: 16px;
  padding: 56px 64px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text {
  color: #fff;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.85;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.3);
}

.hero-decor {
  position: relative;
  width: 200px;
  height: 200px;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.decor-circle.c1 {
  width: 120px;
  height: 120px;
  top: 0;
  right: 0;
}

.decor-circle.c2 {
  width: 80px;
  height: 80px;
  bottom: 20px;
  right: 60px;
}

.decor-circle.c3 {
  width: 50px;
  height: 50px;
  top: 60px;
  right: 100px;
}

.category-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #F5F7FA;
}

.category-tab:hover {
  color: #409EFF;
  background: #ECF5FF;
}

.category-tab.active {
  background: #409EFF;
  color: #fff;
  font-weight: 500;
}

.products-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.section-count {
  font-size: 14px;
  color: #909399;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.badge-discount {
  background: linear-gradient(135deg, #F56C6C, #E6A23C);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: #fff;
}

.favorite-btn .star {
  font-size: 18px;
  line-height: 1;
}

.product-info {
  padding: 16px;
}

.product-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 12px 0;
  line-height: 1.4;
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
  font-size: 22px;
  font-weight: 700;
  color: #F56C6C;
}

.price-original {
  font-size: 13px;
  color: #C0C4CC;
  text-decoration: line-through;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F2F6FC;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seller-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #F5F7FA;
}

.seller-name {
  font-size: 13px;
  color: #606266;
}

.product-campus {
  font-size: 12px;
  color: #909399;
  background: #F5F7FA;
  padding: 3px 8px;
  border-radius: 10px;
}
</style>
