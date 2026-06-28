<script setup lang="ts">
import { ref } from 'vue'
import { ElTag } from 'element-plus'

const activeCategory = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'textbook', label: '教材数码' },
  { key: 'daily', label: '生活用品' },
  { key: 'transport', label: '交通工具' },
  { key: 'clothing', label: '服饰鞋包' },
  { key: 'other', label: '其他' },
]

const products = ref([
  {
    id: 1,
    title: '高等数学同济第七版 教材全新未使用',
    price: 25,
    originalPrice: 45,
    image: 'https://picsum.photos/seed/tradebook1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei',
    publisher: '张同学',
    campus: '狮子山校区',
    time: '2小时前',
    category: 'textbook',
  },
  {
    id: 2,
    title: 'iPad 2021款 64G 9成新 带原装充电器',
    price: 1899,
    originalPrice: 2999,
    image: 'https://picsum.photos/seed/tradeipad1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liming',
    publisher: '李同学',
    campus: '成龙校区',
    time: '3小时前',
    category: 'textbook',
  },
  {
    id: 3,
    title: '捷安特山地自行车 毕业出 送锁和挡泥板',
    price: 450,
    originalPrice: 899,
    image: 'https://picsum.photos/seed/tradingbike1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wanghua',
    publisher: '王同学',
    campus: '狮子山校区',
    time: '5小时前',
    category: 'transport',
  },
  {
    id: 4,
    title: '宿舍床上书桌 可折叠 9成新',
    price: 35,
    originalPrice: 69,
    image: 'https://picsum.photos/seed/tradedesk1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoming',
    publisher: '赵同学',
    campus: '成龙校区',
    time: '6小时前',
    category: 'daily',
  },
  {
    id: 5,
    title: 'Nike Air Force 1 42码 穿了两次',
    price: 399,
    originalPrice: 799,
    image: 'https://picsum.photos/seed/tradeshoes1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenhao',
    publisher: '陈同学',
    campus: '狮子山校区',
    time: '8小时前',
    category: 'clothing',
  },
  {
    id: 6,
    title: '小米手环7 NFC版 功能正常',
    price: 159,
    originalPrice: 249,
    image: 'https://picsum.photos/seed/trademiband1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang',
    publisher: '刘同学',
    campus: '成龙校区',
    time: '10小时前',
    category: 'textbook',
  },
  {
    id: 7,
    title: '电热水壶 1.8L 宿舍必备 9成新',
    price: 29,
    originalPrice: 59,
    image: 'https://picsum.photos/seed/tradekettle1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoujie',
    publisher: '周同学',
    campus: '狮子山校区',
    time: '12小时前',
    category: 'daily',
  },
  {
    id: 8,
    title: '阿迪达斯双肩背包 大容量 电脑包',
    price: 129,
    originalPrice: 299,
    image: 'https://picsum.photos/seed/tradebag1/400/400',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei',
    publisher: '吴同学',
    campus: '成龙校区',
    time: '1天前',
    category: 'clothing',
  },
])

const filteredProducts = ref(products.value)

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
  if (key === 'all') {
    filteredProducts.value = products.value
  } else {
    filteredProducts.value = products.value.filter(p => p.category === key)
  }
}
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
        >
          <div class="product-image-wrapper">
            <img :src="product.image" :alt="product.title" class="product-image" />
            <div class="product-badge">
              <span class="badge-discount">省{{ product.originalPrice - product.price }}元</span>
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
                <img :src="product.avatar" :alt="product.publisher" class="seller-avatar" />
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
