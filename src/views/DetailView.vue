<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Wallet, Star } from '@element-plus/icons-vue'
import { getTradeById } from '../api/trade'
import { getLostFoundById } from '../api/lostFound'
import { getGroupBuyById } from '../api/groupBuy'
import { getErrandById } from '../api/errand'

const route = useRoute()
const router = useRouter()

// 注意：json-server 新建记录会生成字符串 id（如 "IxcwsJ7DbjI"），不能用 Number() 转换
const itemId = computed(() => route.params.id as string)
const itemTypeFromQuery = computed(() => route.query.type as string)
const loading = ref(false)
const itemDetail = ref<any>(null)
const itemType = ref('secondhand')

const currentImageIndex = ref(0)
const bargainPrice = ref('')
const showBargainDialog = ref(false)
const isAnimating = ref(false)

const fetchDetail = async () => {
  loading.value = true
  try {
    const id = itemId.value
    const typeHint = itemTypeFromQuery.value
    if (!id) return

    // 如果传入了类型参数，直接查询对应接口
    if (typeHint) {
      const result = await fetchByType(id, typeHint)
      if (result) return
    }

    // 否则按顺序尝试所有接口
    const tradeRes = await getTradeById(id).catch(() => null)
    if (tradeRes && tradeRes.data) {
      setTradeDetail(tradeRes.data)
      return
    }

    const lostRes = await getLostFoundById(id).catch(() => null)
    if (lostRes && lostRes.data) {
      setLostFoundDetail(lostRes.data)
      return
    }

    const groupRes = await getGroupBuyById(id).catch(() => null)
    if (groupRes && groupRes.data) {
      setGroupBuyDetail(groupRes.data)
      return
    }

    const errandRes = await getErrandById(id).catch(() => null)
    if (errandRes && errandRes.data) {
      setErrandDetail(errandRes.data)
      return
    }

    ElMessage.warning('未找到该信息')
    router.push('/home')
  } catch (err) {
    console.error('获取详情失败:', err)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

const fetchByType = async (id: string, type: string) => {
  switch (type) {
    case 'trade':
    case 'secondhand': {
      const tradeRes = await getTradeById(id).catch(() => null)
      if (tradeRes && tradeRes.data) {
        setTradeDetail(tradeRes.data)
        return true
      }
      break
    }
    case 'lostFound':
    case 'lost':
    case 'found': {
      const lostRes = await getLostFoundById(id).catch(() => null)
      if (lostRes && lostRes.data) {
        setLostFoundDetail(lostRes.data)
        return true
      }
      break
    }
    case 'groupBuy':
    case 'group': {
      const groupRes = await getGroupBuyById(id).catch(() => null)
      if (groupRes && groupRes.data) {
        setGroupBuyDetail(groupRes.data)
        return true
      }
      break
    }
    case 'errand': {
      const errandRes = await getErrandById(id).catch(() => null)
      if (errandRes && errandRes.data) {
        setErrandDetail(errandRes.data)
        return true
      }
      break
    }
  }
  return false
}

const setTradeDetail = (data: any) => {
  itemDetail.value = {
    ...data,
    type: 'secondhand',
    typeName: '二手交易',
    images: data.image ? [data.image] : ['https://picsum.photos/seed/trade-default/400/400'],
    tags: [data.categoryName, data.condition].filter(Boolean),
    publisher: {
      id: 'user_' + data.id,
      nickname: data.publisher || '校园用户',
      avatar: data.publisherAvatar || 'https://picsum.photos/seed/avatar-default/100/100',
      college: '校园用户',
      campus: data.campus,
      creditScore: 95,
      publishCount: 1,
      responseRate: '98%',
    },
    createdAt: data.publishTime || new Date().toISOString().replace('T', ' ').slice(0, 16),
    allowBargain: true,
    status: data.status || 'open',
    viewCount: data.viewCount || 0,
    favoriteCount: data.favoriteCount || 0,
    publisherName: data.publisher || '校园用户',
  }
  itemType.value = 'secondhand'
}

const setLostFoundDetail = (data: any) => {
  itemDetail.value = {
    ...data,
    type: data.type || 'lost',
    typeName: data.typeName || '失物招领',
    images: data.image ? [data.image] : ['https://picsum.photos/seed/lost-default/400/400'],
    tags: [data.typeName, data.location].filter(Boolean),
    publisher: {
      id: 'user_' + data.id,
      nickname: data.publisher || '校园用户',
      avatar: data.publisherAvatar || 'https://picsum.photos/seed/avatar-default/100/100',
      college: '校园用户',
      campus: data.campus,
      creditScore: 90,
      publishCount: 1,
      responseRate: '90%',
    },
    createdAt: data.time || new Date().toISOString().replace('T', ' ').slice(0, 16),
    price: null,
    originalPrice: null,
    condition: '—',
    allowBargain: false,
    status: data.status || 'open',
    viewCount: data.viewCount || 0,
    favoriteCount: data.favoriteCount || 0,
  }
  itemType.value = 'lost'
}

const setGroupBuyDetail = (data: any) => {
  itemDetail.value = {
    ...data,
    type: 'group',
    typeName: '拼单搭子',
    images: data.image ? [data.image] : ['https://picsum.photos/seed/group-default/400/400'],
    tags: [data.typeName, data.location].filter(Boolean),
    publisher: {
      id: 'user_' + data.id,
      nickname: data.publisher || '校园用户',
      avatar: data.publisherAvatar || 'https://picsum.photos/seed/avatar-default/100/100',
      college: '校园用户',
      campus: data.location,
      creditScore: 88,
      publishCount: 1,
      responseRate: '85%',
    },
    createdAt: data.deadline || new Date().toISOString().replace('T', ' ').slice(0, 16),
    price: null,
    originalPrice: null,
    condition: '—',
    allowBargain: false,
    status: data.status || 'open',
    viewCount: data.viewCount || 0,
    favoriteCount: data.favoriteCount || 0,
  }
  itemType.value = 'group'
}

const setErrandDetail = (data: any) => {
  itemDetail.value = {
    ...data,
    type: 'errand',
    typeName: '跑腿委托',
    images: data.image ? [data.image] : ['https://picsum.photos/seed/errand-default/400/400'],
    tags: [data.typeName, data.campus].filter(Boolean),
    publisher: {
      id: 'user_' + data.id,
      nickname: data.publisher || '校园用户',
      avatar: data.publisherAvatar || 'https://picsum.photos/seed/avatar-default/100/100',
      college: '校园用户',
      campus: data.campus,
      creditScore: 92,
      publishCount: 1,
      responseRate: '95%',
    },
    createdAt: data.deadline || new Date().toISOString().replace('T', ' ').slice(0, 16),
    price: data.reward || 0,
    originalPrice: null,
    condition: '—',
    allowBargain: false,
    status: data.status || 'open',
    viewCount: data.viewCount || 0,
    favoriteCount: data.favoriteCount || 0,
  }
  itemType.value = 'errand'
}

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

const selectImage = (index: number | string) => {
  const numIndex = typeof index === 'number' ? index : parseInt(index, 10)
  if (isAnimating.value || numIndex === currentImageIndex.value) return
  isAnimating.value = true
  currentImageIndex.value = numIndex
  setTimeout(() => { isAnimating.value = false }, 300)
}

const toggleFavorite = () => {
  if (!itemDetail.value) return
  itemDetail.value.isFavorite = !itemDetail.value.isFavorite
  if (itemDetail.value.isFavorite) {
    itemDetail.value.favoriteCount++
    ElMessage.success('收藏成功')
  } else {
    itemDetail.value.favoriteCount--
    ElMessage.info('已取消收藏')
  }
}

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
  if (itemDetail.value && price >= itemDetail.value.price) {
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

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <div class="detail-page" v-loading="loading">
    <template v-if="itemDetail">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/list' }">集市浏览</el-breadcrumb-item>
        <el-breadcrumb-item>{{ itemDetail.typeName }}</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-container">
        <div class="image-section">
          <el-card shadow="never" class="image-card">
            <div class="main-image">
              <img
                :src="itemDetail.images[currentImageIndex]"
                :alt="itemDetail.title"
                :class="{ fade: isAnimating }"
              />
              <button class="carousel-btn prev-btn" @click="prevImage" :disabled="isAnimating">
                <span class="carousel-arrow">←</span>
              </button>
              <button class="carousel-btn next-btn" @click="nextImage" :disabled="isAnimating">
                <span class="carousel-arrow">→</span>
              </button>
              <div class="image-counter">
                {{ currentImageIndex + 1 }} / {{ itemDetail.images.length }}
              </div>
            </div>
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

        <div class="info-section">
          <el-card shadow="never" class="info-card">
            <div class="tag-row">
              <el-tag color="#409eff" effect="dark" size="small">
                {{ itemDetail.typeName }}
              </el-tag>
              <el-tag type="success" size="small" effect="plain" v-if="itemDetail.condition">
                {{ itemDetail.condition }}
              </el-tag>
              <el-tag v-if="itemDetail.status" type="info" size="small" effect="plain">
                {{ itemDetail.status === 'open' ? '进行中' : itemDetail.status === 'closed' ? '已关闭' : '已完成' }}
              </el-tag>
            </div>

            <h1 class="item-title">{{ itemDetail.title }}</h1>

            <div class="price-section" v-if="itemDetail.price">
              <span class="current-price">¥{{ itemDetail.price }}</span>
              <span v-if="itemDetail.originalPrice" class="original-price">
                原价 ¥{{ itemDetail.originalPrice }}
              </span>
              <span class="discount-tag" v-if="itemDetail.originalPrice">
                省 ¥{{ itemDetail.originalPrice - itemDetail.price }}
              </span>
            </div>
            <div class="price-section" v-else>
              <span class="current-price free">免费</span>
            </div>

            <div class="tags-section">
              <el-tag
                v-for="tag in itemDetail.tags"
                :key="tag"
                size="small"
                effect="plain"
                color="#ecf5ff"
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="meta-section">
              <div class="meta-item">
                <span class="meta-label">所在校区</span>
                <span class="meta-value">{{ itemDetail.campus || itemDetail.location }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">{{ itemType === 'errand' ? '送达地点' : '具体地点' }}</span>
                <span class="meta-value">{{ itemDetail.location }}</span>
              </div>
              <div class="meta-item" v-if="itemType === 'errand' && itemDetail.pickupLocation">
                <span class="meta-label">取件地点</span>
                <span class="meta-value">{{ itemDetail.pickupLocation }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">发布时间</span>
                <span class="meta-value">{{ itemDetail.publishTime || itemDetail.createdAt || '未知' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">浏览次数</span>
                <span class="meta-value">{{ itemDetail.viewCount || 0 }}次</span>
              </div>
              <div class="meta-item" v-if="itemType === 'group' && itemDetail.totalPeople">
                <span class="meta-label">人数</span>
                <span class="meta-value">{{ itemDetail.currentPeople || 1 }}/{{ itemDetail.totalPeople }}人</span>
              </div>
            </div>

            <div class="description-section">
              <h3>详细描述</h3>
              <p>{{ itemDetail.description }}</p>
            </div>

            <div class="action-buttons">
              <el-button type="primary" size="large" @click="goToMessage">
                <el-icon class="btn-icon"><ChatDotRound /></el-icon>
                联系发布者
              </el-button>
              <el-button
                v-if="itemType === 'secondhand' && itemDetail.allowBargain"
                type="warning"
                size="large"
                @click="openBargainDialog"
              >
                <el-icon class="btn-icon"><Wallet /></el-icon>
                发起砍价
              </el-button>
              <el-button
                :type="itemDetail.isFavorite ? 'primary' : 'default'"
                size="large"
                @click="toggleFavorite"
              >
                <el-icon class="btn-icon"><Star /></el-icon>
                {{ itemDetail.isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </el-card>
        </div>

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

            <div class="favorite-count">
              <el-icon class="favorite-star"><Star /></el-icon>
              <span>{{ itemDetail.favoriteCount || 0 }} 人收藏</span>
            </div>

            <div class="report-section">
              <el-text type="info" size="small">
                发现违规信息？<el-link type="primary" :underline="false">点击举报</el-link>
              </el-text>
            </div>
          </el-card>
        </div>
      </div>
    </template>

    <el-dialog
      v-model="showBargainDialog"
      title="发起砍价"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="bargain-dialog" v-if="itemDetail">
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
          <el-icon class="bargain-icon"><ChatDotRound /></el-icon>
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
  padding: 24px 0;
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
  padding: 16px;
}

.main-image {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f2f5;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-image img.fade {
  opacity: 0.7;
  transition: opacity 0.3s;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.7);
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

.carousel-arrow {
  font-size: 18px;
}

.image-counter {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.image-thumbnails {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
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
  padding: 24px;
}

.tag-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.item-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #fff7ed;
  border-radius: 8px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #f56c6c;
}

.current-price.free {
  color: #67c23a;
}

.original-price {
  font-size: 14px;
  color: #909399;
  text-decoration: line-through;
}

.discount-tag {
  font-size: 12px;
  color: #e6a23c;
  background: #fdf6ec;
  padding: 2px 8px;
  border-radius: 4px;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.meta-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  font-size: 14px;
}

.meta-label {
  color: #909399;
  min-width: 80px;
}

.meta-value {
  color: #303133;
}

.description-section {
  margin-bottom: 24px;
}

.description-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #303133;
}

.description-section p {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  margin: 0;
  white-space: pre-wrap;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .el-button {
  flex: 1;
}

.btn-emoji {
  margin-right: 6px;
}

.publisher-section {
  width: 280px;
  flex-shrink: 0;
}

.publisher-card {
  position: sticky;
  top: 24px;
}

.publisher-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.publisher-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.publisher-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.publisher-college {
  font-size: 12px;
  color: #909399;
}

.publisher-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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
  margin-bottom: 8px;
}

.favorite-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
}

.favorite-star {
  color: #e6a23c;
}

.report-section {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.bargain-dialog {
  padding: 10px 0;
}

.bargain-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #606266;
}

.bargain-current-price {
  font-size: 24px;
  color: #f56c6c;
}

.bargain-tip {
  font-size: 12px;
  color: #909399;
  margin: 12px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bargain-icon {
  font-size: 16px;
}

.similar-section {
  margin-top: 32px;
}

.similar-section h2 {
  font-size: 20px;
  margin: 0 0 16px 0;
  color: #303133;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.similar-card {
  cursor: pointer;
}

.similar-image {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
}

.similar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.similar-info {
  padding: 8px 4px 0 4px;
}

.similar-title {
  font-size: 13px;
  color: #606266;
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}

@media (max-width: 1200px) {
  .detail-container {
    flex-direction: column;
  }

  .image-section,
  .publisher-section {
    width: 100%;
  }

  .publisher-card {
    position: static;
  }

  .similar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .similar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
