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

.errands-section {
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

.errands-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.errand-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  transition: all var(--transition-base);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.errand-card:hover {
  border-color: var(--color-text-tertiary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-category {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.card-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.card-status.status-pending {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.card-status.status-accepted {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.card-status.status-completed {
  background: transparent;
  color: var(--color-text-tertiary);
  border-color: var(--color-border-light);
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.card-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
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
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.meta-icon {
  font-size: 13px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
  margin-bottom: 16px;
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.publisher-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
}

.publisher-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.publisher-name {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.publish-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.reward-section {
  text-align: right;
}

.reward-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  display: block;
  margin-bottom: 2px;
}

.reward-amount {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.card-action {
  margin-top: auto;
}

.accept-btn {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--color-text-primary);
  background: var(--color-text-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.accept-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.accept-btn:disabled {
  background: var(--color-border-light);
  border-color: var(--color-border-light);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}
</style>
