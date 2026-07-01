<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Box, Location, School, Clock } from '@element-plus/icons-vue'
import { getLostFounds, type LostFound } from '../api/lostFound'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()

const activeTab = ref('lost')
const loading = ref(false)
const items = ref<LostFound[]>([])

const tabs = [
  { key: 'lost', label: '寻物启事', icon: Search },
  { key: 'found', label: '失物招领', icon: Box },
]

const fetchLostFounds = async () => {
  loading.value = true
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch (err) {
    console.error('获取失物招领列表失败:', err)
  } finally {
    loading.value = false
  }
}

const filteredItems = computed(() => {
  return items.value.filter(item => item.type === activeTab.value)
})

const goToDetail = (id: number) => {
  router.push({ path: `/detail/${id}`, query: { type: 'lostFound' } })
}

onMounted(() => {
  fetchLostFounds()
})
</script>

<template>
  <div class="lost-found-page">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">失物招领</h1>
          <p class="hero-subtitle">找回丢失物品，帮助他人寻回</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">328</span>
              <span class="stat-label">寻物启事</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">256</span>
              <span class="stat-label">失物招领</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">189</span>
              <span class="stat-label">已找回</span>
            </div>
          </div>
        </div>
        <div class="hero-decor">
          <div class="decor-circle c1"></div>
          <div class="decor-circle c2"></div>
          <div class="decor-circle c3"></div>
          <div class="decor-icon">
            <el-icon :size="64"><Search /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <section class="tab-section">
      <div class="tab-container">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">
            <el-icon :size="20"><component :is="tab.icon" /></el-icon>
          </span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </section>

    <section class="items-section">
      <div class="section-header">
        <h2 class="section-title">{{ activeTab === 'lost' ? '最新寻物' : '最新招领' }}</h2>
        <span class="section-count">共 {{ filteredItems.length }} 条信息</span>
      </div>
      <div class="items-list">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          @click="goToDetail(item.id)"
        >
          <div class="item-image-wrapper">
            <img :src="item.image" :alt="item.title" class="item-image" />
            <div :class="['item-type-badge', item.type]">
              {{ item.type === 'lost' ? '寻物' : '招领' }}
            </div>
          </div>
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <div class="meta-item">
                <el-icon class="meta-icon"><Location /></el-icon>
                <span class="meta-text">{{ item.location }}</span>
              </div>
              <div class="meta-item">
                <el-icon class="meta-icon"><School /></el-icon>
                <span class="meta-text">{{ item.campus }}</span>
              </div>
              <div class="meta-item">
                <el-icon class="meta-icon"><Clock /></el-icon>
                <span class="meta-text">{{ item.time }}</span>
              </div>
            </div>
            <div class="item-footer">
              <div class="publisher-info">
                <img :src="item.publisherAvatar" :alt="item.publisher" class="publisher-avatar" />
                <span class="publisher-name">{{ item.publisher }}</span>
              </div>
              <button class="contact-btn">联系TA</button>
            </div>
          </div>
        </div>
      </div>
      <EmptyState v-if="!loading && filteredItems.length === 0" :title="activeTab === 'lost' ? '暂无寻物启事' : '暂无失物招领'" description="快来发布第一条信息吧~" />
    </section>
  </div>
</template>

<style scoped>
.lost-found-page {
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

.tab-section {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 24px 0;
  margin-bottom: 0;
}

.tab-container {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-5);
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
  border: 1px solid var(--color-border);
}

.tab-item:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.tab-item.active {
  background: var(--color-text-primary);
  color: #fff;
  border-color: var(--color-text-primary);
  font-weight: 500;
}

.tab-icon {
  font-size: 16px;
  line-height: 1;
}

.items-section {
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

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.item-card {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.item-card:hover {
  border-color: var(--color-text-tertiary);
}

.item-image-wrapper {
  position: relative;
  width: 240px;
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.item-card:hover .item-image {
  transform: scale(1.02);
}

.item-type-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 400;
  color: #fff;
}

.item-type-badge.lost {
  background: var(--color-danger);
}

.item-type-badge.found {
  background: var(--color-text-primary);
}

.item-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
  letter-spacing: -0.01em;
}

.item-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--space-3) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: var(--space-4);
  margin-bottom: auto;
  padding-bottom: var(--space-3);
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
  line-height: 1;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
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

.contact-btn {
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.contact-btn:hover {
  border-color: var(--color-text-primary);
  background: var(--color-text-primary);
  color: #fff;
}
</style>
