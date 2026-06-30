<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getErrands, type Errand } from '../api/errand'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()

const activeCategory = ref('all')
const loading = ref(false)
const errands = ref<Errand[]>([])

const categories = [
  { key: 'all', label: '全部' },
  { key: 'express', label: '代取快递' },
  { key: 'buy', label: '代买物品' },
  { key: 'affair', label: '代办事务' },
  { key: 'other', label: '其他' },
]

const fetchErrands = async () => {
  loading.value = true
  try {
    const res = await getErrands()
    errands.value = res.data
  } catch (err) {
    console.error('获取跑腿委托列表失败:', err)
  } finally {
    loading.value = false
  }
}

const filteredErrands = computed(() => {
  if (activeCategory.value === 'all') {
    return errands.value
  }
  return errands.value.filter(e => e.type === activeCategory.value)
})

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'open':
      return '待接单'
    case 'accepted':
      return '进行中'
    case 'done':
      return '已完成'
    case 'closed':
      return '已关闭'
    default:
      return ''
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'status-pending'
    case 'accepted':
      return 'status-accepted'
    case 'done':
      return 'status-completed'
    default:
      return ''
  }
}

const goToDetail = (id: number) => {
  router.push({ path: `/detail/${id}`, query: { type: 'errand' } })
}

onMounted(() => {
  fetchErrands()
})
</script>

<template>
  <div class="errand-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">跑腿委托</h1>
          <p class="hero-subtitle">代取快递、代买物品，校园互助更便捷</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">186</span>
              <span class="stat-label">待接单</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">2,450+</span>
              <span class="stat-label">本月完成</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">98%</span>
              <span class="stat-label">好评率</span>
            </div>
          </div>
        </div>
        <div class="hero-decor">
          <div class="decor-circle c1"></div>
          <div class="decor-circle c2"></div>
          <div class="decor-circle c3"></div>
          <div class="decor-icon">🏃</div>
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

    <section class="errands-section">
      <div class="section-header">
        <h2 class="section-title">最新委托</h2>
        <span class="section-count">共 {{ filteredErrands.length }} 条委托</span>
      </div>
      <div class="errands-grid">
        <div
          v-for="errand in filteredErrands"
          :key="errand.id"
          class="errand-card"
          @click="goToDetail(errand.id)"
        >
          <div class="card-header">
            <div class="card-category">
              <span v-if="errand.type === 'express'">📦 代取快递</span>
              <span v-else-if="errand.type === 'buy'">🛒 代买物品</span>
              <span v-else-if="errand.type === 'affair'">📋 代办事务</span>
              <span v-else>✨ 其他</span>
            </div>
            <div :class="['card-status', getStatusClass(errand.status)]">
              {{ getStatusText(errand.status) }}
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ errand.title }}</h3>
            <p class="card-description">{{ errand.description }}</p>
            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-icon">⏰</span>
                <span class="meta-text">{{ errand.deadline }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span class="meta-text">{{ errand.campus }}</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="publisher-info">
              <img :src="errand.publisherAvatar" :alt="errand.publisher" class="publisher-avatar" />
              <div class="publisher-detail">
                <span class="publisher-name">{{ errand.publisher }}</span>
                <span class="publish-time">{{ errand.publishTime }}</span>
              </div>
            </div>
            <div class="reward-section">
              <span class="reward-label">悬赏</span>
              <span class="reward-amount">¥{{ errand.reward }}</span>
            </div>
          </div>
          <div class="card-action">
            <button class="accept-btn" :disabled="errand.status !== 'open'">
              {{ errand.status === 'open' ? '立即接单' : errand.status === 'accepted' ? '进行中' : '已完成' }}
            </button>
          </div>
        </div>
      </div>
      <EmptyState v-if="!loading && filteredErrands.length === 0" title="暂无委托" description="快来发布第一个跑腿委托吧~" />
    </section>
  </div>
</template>

<style scoped>
.errand-page {
  padding-bottom: 48px;
}

.hero-section {
  background: linear-gradient(135deg, #F56C6C 0%, #F78989 50%, #F9A7A7 100%);
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
  opacity: 0.95;
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
  opacity: 0.9;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.4);
}

.hero-decor {
  position: relative;
  width: 200px;
  height: 200px;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.decor-circle.c1 {
  width: 140px;
  height: 140px;
  top: 0;
  right: 0;
}

.decor-circle.c2 {
  width: 70px;
  height: 70px;
  bottom: 10px;
  right: 80px;
}

.decor-circle.c3 {
  width: 40px;
  height: 40px;
  top: 50px;
  right: 120px;
}

.decor-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  z-index: 3;
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
  color: #F56C6C;
  background: #FEF0F0;
}

.category-tab.active {
  background: #F56C6C;
  color: #fff;
  font-weight: 500;
}

.errands-section {
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

.errands-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.errand-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.errand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.card-category {
  font-size: 13px;
  font-weight: 500;
  color: #F56C6C;
  background: #FEF0F0;
  padding: 4px 12px;
  border-radius: 16px;
}

.card-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.card-status.pending {
  background: #FDF6EC;
  color: #E6A23C;
}

.card-status.accepted {
  background: #ECF5FF;
  color: #409EFF;
}

.card-status.completed {
  background: #F0F9EB;
  color: #67C23A;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.card-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.meta-icon {
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #F2F6FC;
  margin-bottom: 16px;
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.publisher-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F5F7FA;
}

.publisher-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.publisher-name {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.publish-time {
  font-size: 12px;
  color: #C0C4CC;
}

.reward-section {
  text-align: right;
}

.reward-label {
  font-size: 12px;
  color: #909399;
  display: block;
  margin-bottom: 2px;
}

.reward-amount {
  font-size: 22px;
  font-weight: 700;
  color: #F56C6C;
}

.card-action {
  margin-top: auto;
}

.accept-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: linear-gradient(135deg, #F56C6C, #F78989);
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accept-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.01);
}

.accept-btn:disabled {
  background: #C0C4CC;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
