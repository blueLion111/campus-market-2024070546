<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGroupBuys, type GroupBuy } from '../api/groupBuy'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()

const activeCategory = ref('all')
const loading = ref(false)
const groupBuys = ref<GroupBuy[]>([])

const categories = [
  { key: 'all', label: '全部' },
  { key: 'milktea', label: '奶茶拼单' },
  { key: 'takeout', label: '外卖拼单' },
  { key: 'study', label: '学习搭子' },
  { key: 'sports', label: '运动搭子' },
  { key: 'other', label: '其他' },
]

const fetchGroupBuys = async () => {
  loading.value = true
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
  } catch (err) {
    console.error('获取拼单搭子列表失败:', err)
  } finally {
    loading.value = false
  }
}

const filteredGroupBuys = computed(() => {
  if (activeCategory.value === 'all') {
    return groupBuys.value
  }
  return groupBuys.value.filter(g => g.type === activeCategory.value)
})

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
}

const getProgress = (current: number, total: number) => {
  return Math.round((current / total) * 100)
}

const goToDetail = (id: number) => {
  router.push({ path: `/detail/${id}`, query: { type: 'groupBuy' } })
}

onMounted(() => {
  fetchGroupBuys()
})
</script>

<template>
  <div class="groupbuy-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">拼单搭子</h1>
          <p class="hero-subtitle">找同学一起拼单、学习、运动</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">568</span>
              <span class="stat-label">进行中拼单</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">2,340+</span>
              <span class="stat-label">本月参与</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">1,280+</span>
              <span class="stat-label">活跃搭子</span>
            </div>
          </div>
        </div>
        <div class="hero-decor">
          <div class="decor-circle c1"></div>
          <div class="decor-circle c2"></div>
          <div class="decor-circle c3"></div>
          <div class="decor-icon">🤝</div>
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

    <section class="groupbuys-section">
      <div class="section-header">
        <h2 class="section-title">热门拼单</h2>
        <span class="section-count">共 {{ filteredGroupBuys.length }} 条拼单</span>
      </div>
      <div class="groupbuys-grid">
        <div
          v-for="item in filteredGroupBuys"
          :key="item.id"
          class="groupbuy-card"
          @click="goToDetail(item.id)"
        >
          <div class="card-image-wrapper">
            <img :src="item.image" :alt="item.title" class="card-image" />
            <div class="card-category">
              <span v-if="item.type === 'milktea'">🧋 奶茶</span>
              <span v-else-if="item.type === 'takeout'">🍔 外卖</span>
              <span v-else-if="item.type === 'study'">📚 学习</span>
              <span v-else-if="item.type === 'sports'">🏃 运动</span>
              <span v-else>✨ 其他</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>
            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">已加入 {{ item.currentPeople }}/{{ item.totalPeople }} 人</span>
                <span class="progress-percent">{{ getProgress(item.currentPeople, item.totalPeople) }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getProgress(item.currentPeople, item.totalPeople) + '%' }"
                ></div>
              </div>
            </div>
            <div class="card-meta">
              <div class="meta-item">
                <span class="meta-icon">⏰</span>
                <span class="meta-text">{{ item.deadline }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span class="meta-text">{{ item.location }}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="publisher-info">
                <img :src="item.publisherAvatar" :alt="item.publisher" class="publisher-avatar" />
                <span class="publisher-name">{{ item.publisher }}</span>
              </div>
              <button class="join-btn">加入拼单</button>
            </div>
          </div>
        </div>
      </div>
      <EmptyState v-if="!loading && filteredGroupBuys.length === 0" title="暂无拼单" description="快来发起第一个拼单吧~" />
    </section>
  </div>
</template>

<style scoped>
.groupbuy-page {
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

.groupbuys-section {
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

.groupbuys-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.groupbuy-card {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.groupbuy-card:hover {
  border-color: var(--color-text-tertiary);
}

.card-image-wrapper {
  position: relative;
  width: 200px;
  flex-shrink: 0;
  background: var(--color-border-light);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 400;
  background: var(--color-text-primary);
  color: #fff;
}

.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.card-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-section {
  margin-bottom: 14px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.progress-percent {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-text-primary);
  border-radius: var(--radius-sm);
  transition: width var(--transition-base);
}

.card-meta {
  display: flex;
  gap: 20px;
  margin-bottom: auto;
  padding-bottom: 14px;
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
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.publisher-avatar {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
}

.publisher-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.join-btn {
  padding: 6px 16px;
  border: 1px solid var(--color-text-primary);
  background: var(--color-text-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.join-btn:hover {
  opacity: 0.9;
}
</style>