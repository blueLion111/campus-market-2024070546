<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const itemId = computed(() => route.params.id as string)

// 模拟商品详情数据 - 使用可靠的图片源
const itemDetail = ref({
  id: itemId.value,
  type: 'secondhand',
  typeName: '二手交易',
  title: '高等数学同济第七版 教材全新未使用',
  price: 25,
  originalPrice: 45,
  condition: '全新',
  campus: '狮子山校区',
  location: '图书馆门口交易',
  description: '高等数学同济第七版上下册，全新未使用，原价45元买的，现25元出售。适合大一新生或需要考研复习的同学。书本完好无损，可以线下当面验货。欢迎砍价沟通。',
  tags: ['教材', '数学', '考研', '全新'],
  images: [
    'https://picsum.photos/seed/math1/400/300',
    'https://picsum.photos/seed/math2/400/300',
    'https://picsum.photos/seed/math3/400/300',
    'https://picsum.photos/seed/math4/400/300',
  ],
  publisher: {
    id: 'user001',
    nickname: '张同学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang&backgroundColor=b6e3f4',
    college: '数学与软件科学学院',
    campus: '狮子山校区',
    creditScore: 95,
    publishCount: 8,
    responseRate: '98%',
  },
  createdAt: '2026-06-28 14:30',
  viewCount: 156,
  favoriteCount: 12,
  isFavorite: false,
  status: 'active',
  allowBargain: true,
})

const currentImageIndex = ref(0)
const bargainPrice = ref('')
const showBargainDialog = ref(false)
const isAnimating = ref(false)

const similarItems = ref([
  { id: 2, title: '线性代数教材', price: 18, image: 'https://picsum.photos/seed/linear/200/150' },
  { id: 3, title: '概率论与数理统计', price: 22, image: 'https://picsum.photos/seed/probability/200/150' },
  { id: 4, title: '大学英语四级教材', price: 15, image: 'https://picsum.photos/seed/english/200/150' },
  { id: 5, title: '大学物理教材', price: 28, image: 'https://picsum.photos/seed/physics/200/150' },
])

// 图片轮播控制
const prevImage = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  currentImageIndex.value = currentImageIndex.value === 0 
    ? itemDetail.value.images.length - 1 
    : currentImageIndex.value - 1
  setTimeout(() => { isAnimating.value = false }, 300)
}

const nextImage = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  currentImageIndex.value = currentImageIndex.value === itemDetail.value.images.length - 1 
    ? 0 
    : currentImageIndex.value + 1
  setTimeout(() => { isAnimating.value = false }, 300)
}

const selectImage = (index: number) => {
  if (isAnimating.value || index === currentImageIndex.value) return
  isAnimating.value = true
  currentImageIndex.value = index
  setTimeout(() => { isAnimating.value = false }, 300)
}

// 收藏功能
const toggleFavorite = () => {
  itemDetail.value.isFavorite = !itemDetail.value.isFavorite
  if (itemDetail.value.isFavorite) {
    itemDetail.value.favoriteCount++
    ElMessage.success('已添加到收藏夹')
  } else {
    itemDetail.value.favoriteCount--
    ElMessage.info('已取消收藏')
  }
}

// 砍价功能
const openBargainDialog = () => {
  showBargainDialog.value = true
  bargainPrice.value = ''
}

const submitBargain = () => {
  const price = Number(bargainPrice.value)
  if (!price || price <= 0) {
    ElMessage.warning('请输入有效的价格')
    return
  }
  if (price >= itemDetail.value.price) {
    ElMessage.warning('出价应该低于当前价格')
    return
  }
  ElMessage.success('砍价请求已发送，发布者会尽快回复')
  router.push(`/message?itemId=${itemId.value}&bargainPrice=${price}`)
  showBargainDialog.value = false
}

const goToList = () => {
  router.push('/list')
}

const goToMessage = () => {
  router.push(`/message?itemId=${itemId.value}`)
}
</script>

<template>
  <div class="detail-page">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/list' }">集市浏览</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/list', query: { category: 'secondhand' } }">二手交易</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 三栏布局 -->
    <div class="detail-container">
      <!-- 左侧：图片轮播区 -->
      <div class="image-section">
        <el-card shadow="never" class="image-card">
          <!-- 主图 -->
          <div class="main-image">
            <img 
              :src="itemDetail.images[currentImageIndex]" 
              :alt="itemDetail.title"
              :class="{ fade: isAnimating }"
            />
            <!-- 左右切换按钮 -->
            <button class="carousel-btn prev-btn" @click="prevImage" :disabled="isAnimating">
              <span class="carousel-arrow">←</span>
            </button>
            <button class="carousel-btn next-btn" @click="nextImage" :disabled="isAnimating">
              <span class="carousel-arrow">→</span>
            </button>
            <!-- 图片计数器 -->
            <div class="image-counter">
              {{ currentImageIndex + 1 }} / {{ itemDetail.value.images.length }}
            </div>
          </div>
          <!-- 图片缩略图 -->
          <div class="image-thumbnails">
            <div
              v-for="(img, index) in itemDetail.images"
              :key="index"
              :class="['thumbnail', { active: currentImageIndex === index }]"
              @click="selectImage(index)"
            >
              <img :src="img" alt="" />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 中间：商品核心信息 -->
      <div class="info-section">
        <el-card shadow="never" class="info-card">
          <!-- 类型标签 -->
          <div class="tag-row">
            <el-tag :color="#409eff" effect="dark" size="small">
              {{ itemDetail.typeName }}
            </el-tag>
            <el-tag type="success" size="small" effect="plain">{{ itemDetail.condition }}</el-tag>
            <el-tag v-if="itemDetail.allowBargain" type="warning" size="small" effect="plain">
              可砍价
            </el-tag>
          </div>

          <!-- 标题 -->
          <h1 class="item-title">{{ itemDetail.title }}</h1>

          <!-- 价格 -->
          <div class="price-section">
            <span class="current-price">¥{{ itemDetail.price }}</span>
            <span v-if="itemDetail.originalPrice" class="original-price">
              原价 ¥{{ itemDetail.originalPrice }}
            </span>
            <span class="discount-tag" v-if="itemDetail.originalPrice">
              省 ¥{{ itemDetail.originalPrice - itemDetail.price }}
            </span>
          </div>

          <!-- 标签 -->
          <div class="tags-section">
            <el-tag 
              v-for="tag in itemDetail.tags" 
              :key="tag" 
              size="small" 
              effect="plain"
              :color="'#ecf5ff'"
              :hit="false"
            >
              {{ tag }}
            </el-tag>
          </div>

          <!-- 基本信息 -->
          <div class="meta-section">
            <div class="meta-item">
              <span class="meta-label">交易校区</span>
              <span class="meta-value">{{ itemDetail.campus }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">交易地点</span>
              <span class="meta-value">{{ itemDetail.location }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">发布时间</span>
              <span class="meta-value">{{ itemDetail.createdAt }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">浏览次数</span>
              <span class="meta-value">{{ itemDetail.viewCount }}次</span>
            </div>
          </div>

          <!-- 详细描述 -->
          <div class="description-section">
            <h3>商品描述</h3>
            <p>{{ itemDetail.description }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="goToMessage">
              <span class="btn-emoji">💬</span>
              联系发布者
            </el-button>
            <el-button 
              v-if="itemDetail.allowBargain" 
              type="warning" 
              size="large" 
              @click="openBargainDialog"
            >
              <span class="btn-emoji">💰</span>
              发起砍价
            </el-button>
            <el-button
              :type="itemDetail.isFavorite ? 'primary' : 'default'"
              size="large"
              @click="toggleFavorite"
            >
              <span class="btn-emoji">{{ itemDetail.isFavorite ? '⭐' : '☆' }}</span>
              {{ itemDetail.isFavorite ? '已收藏' : '收藏' }}
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 右侧：发布者信息 -->
      <div class="publisher-section">
        <el-card shadow="never" class="publisher-card">
          <template #header>
            <div class="publisher-header">
              <el-avatar :size="48" :src="itemDetail.publisher.avatar" />
              <div class="publisher-info">
                <span class="publisher-name">{{ itemDetail.publisher.nickname }}</span>
                <span class="publisher-college">{{ itemDetail.publisher.college }}</span>
              </div>
            </div>
          </template>

          <!-- 发布者数据 -->
          <div class="publisher-stats">
            <div class="stat-item">
              <span class="stat-value">{{ itemDetail.publisher.creditScore }}</span>
              <span class="stat-label">信用分</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ itemDetail.publisher.publishCount }}</span>
              <span class="stat-label">发布数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ itemDetail.publisher.responseRate }}</span>
              <span class="stat-label">回复率</span>
            </div>
          </div>

          <el-button type="primary" class="action-btn" @click="goToMessage">
            私信联系
          </el-button>
          <el-button type="default" class="action-btn" @click="goToList">
            查看更多发布
          </el-button>

          <!-- 收藏数显示 -->
          <div class="favorite-count">
            <span class="favorite-star">⭐</span>
            <span>{{ itemDetail.favoriteCount }} 人收藏</span>
          </div>

          <!-- 举报入口 -->
          <div class="report-section">
            <el-text type="info" size="small">
              发现违规信息？<el-link type="primary" :underline="false">点击举报</el-link>
            </el-text>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 底部：同类商品推荐 -->
    <div class="similar-section">
      <h2>同类商品推荐</h2>
      <div class="similar-grid">
        <el-card
          v-for="item in similarItems"
          :key="item.id"
          shadow="hover"
          class="similar-card"
          @click="router.push(`/detail/${item.id}`)"
        >
          <div class="similar-image">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="similar-info">
            <span class="similar-title">{{ item.title }}</span>
            <span class="similar-price">¥{{ item.price }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 砍价弹窗 -->
    <el-dialog 
      v-model="showBargainDialog" 
      title="发起砍价" 
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="bargain-dialog">
        <div class="bargain-info">
          <span>当前价格：</span>
          <strong class="bargain-current-price">¥{{ itemDetail.price }}</strong>
        </div>
        <el-input 
          v-model="bargainPrice" 
          placeholder="输入您的心理价位" 
          type="number"
          size="large"
        >
          <template #prefix>¥</template>
        </el-input>
        <p class="bargain-tip">
          <span class="bargain-icon">💬</span>
          砍价请求将发送至发布者，对方可以选择接受或拒绝
        </p>
      </div>
      <template #footer>
        <el-button @click="showBargainDialog = false">取消</el-button>
        <el-button type="primary" @click="submitBargain">发送请求</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.breadcrumb {
  padding: 8px 0;
}

.detail-container {
  display: flex;
  gap: 24px;
}

.image-section {
  width: 400px;
  flex-shrink: 0;
}

.image-card {
  border-radius: 8px;
}

.main-image {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f7fa;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.main-image img.fade {
  opacity: 0.7;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #409eff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
}

.main-image:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: #409eff;
  color: #fff;
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  left: 12px;
}

.next-btn {
  right: 12px;
}

.image-counter {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.image-thumbnails {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #b3d8fd;
}

.thumbnail.active {
  border-color: #409eff;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.info-card {
  border-radius: 8px;
  padding: 16px;
}

.tag-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.item-title {
  font-size: 20px;
  color: #303133;
  margin: 12px 0;
  line-height: 1.4;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
}

.original-price {
  font-size: 14px;
  color: #909399;
  text-decoration: line-through;
}

.discount-tag {
  background: #fef0f0;
  color: #f56c6c;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tags-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tags-section .el-tag {
  border-color: #b3d8fd;
  color: #409eff;
}

.meta-section {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: #909399;
  font-size: 14px;
}

.meta-value {
  color: #303133;
  font-size: 14px;
}

.description-section {
  margin-bottom: 24px;
}

.description-section h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 12px;
}

.description-section p {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.publisher-section {
  width: 240px;
  flex-shrink: 0;
}

.publisher-card {
  border-radius: 8px;
}

.publisher-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.publisher-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.publisher-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.publisher-college {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publisher-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.action-btn {
  width: 100%;
  margin-top: 8px;
}

.action-btn:first-of-type {
  margin-top: 16px;
}

.favorite-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  color: #909399;
  font-size: 13px;
}

.favorite-count .el-icon {
  color: #409eff;
}

.carousel-arrow {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

.btn-emoji {
  margin-right: 6px;
  font-size: 16px;
  line-height: 1;
}

.favorite-star {
  color: #409eff;
  margin-right: 6px;
  font-size: 16px;
}

.bargain-icon {
  margin-right: 6px;
  font-size: 16px;
}

.report-section {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.similar-section {
  margin-top: 24px;
}

.similar-section h2 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.similar-card {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.similar-card:hover {
  transform: translateY(-4px);
}

.similar-image {
  height: 120px;
  overflow: hidden;
}

.similar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.similar-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.similar-title {
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-price {
  font-size: 16px;
  color: #409eff;
  font-weight: 500;
}

.bargain-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bargain-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bargain-current-price {
  font-size: 20px;
  color: #409eff;
}

.bargain-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin: 0;
}
</style>
