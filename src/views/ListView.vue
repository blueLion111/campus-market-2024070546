<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTrades } from '../api/trade'
import { getLostFounds } from '../api/lostFound'
import { getGroupBuys } from '../api/groupBuy'
import { getErrands } from '../api/errand'

const router = useRouter()

const loading = ref(false)

// 筛选条件
const filters = ref({
  keyword: '',
  category: 'all',
  campus: 'all',
  priceRange: 'all',
  status: 'all',
  sortBy: 'latest',
})

const categories = [
  { value: 'all', label: '全部分类' },
  { value: 'secondhand', label: '二手交易' },
  { value: 'lost', label: '失物招领' },
  { value: 'group', label: '拼单搭子' },
  { value: 'errand', label: '跑腿委托' },
]

const campuses = [
  { value: 'all', label: '全部校区' },
  { value: '狮子山校区', label: '狮子山校区' },
  { value: '成龙校区', label: '成龙校区' },
]

const priceRanges = [
  { value: 'all', label: '不限价格' },
  { value: '0-50', label: '0-50元' },
  { value: '50-100', label: '50-100元' },
  { value: '100-200', label: '100-200元' },
  { value: '200+', label: '200元以上' },
]

const statuses = [
  { value: 'all', label: '全部状态' },
  { value: 'open', label: '进行中' },
  { value: 'closed', label: '已关闭' },
  { value: 'done', label: '已完成' },
]

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'hot', label: '热度优先' },
  { value: 'price-low', label: '价格最低' },
  { value: 'price-high', label: '价格最高' },
]

// 收藏状态
const favoriteSet = ref<Set<number>>(new Set())

// 列表数据
interface ListItem {
  id: number
  type: string
  typeName: string
  typeColor: string
  title: string
  price: number | null
  campus: string
  location: string
  image: string
  publisher: string
  avatar: string
  time: string
  favoriteCount: number
  viewCount: number
  status: string
  memberInfo?: string
  taskInfo?: string
}

const items = ref<ListItem[]>([])

const fetchAllData = async () => {
  loading.value = true
  try {
    const [tradesRes, lostFoundsRes, groupBuysRes, errandsRes] = await Promise.all([
      getTrades().catch(() => ({ data: [] })),
      getLostFounds().catch(() => ({ data: [] })),
      getGroupBuys().catch(() => ({ data: [] })),
      getErrands().catch(() => ({ data: [] })),
    ])

    const tradeItems: ListItem[] = (tradesRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'secondhand',
      typeName: '二手交易',
      typeColor: '#409EFF',
      title: item.title,
      price: item.price,
      campus: item.campus,
      location: item.location,
      image: item.image,
      publisher: item.publisher,
      avatar: item.publisherAvatar,
      time: item.publishTime,
      favoriteCount: item.favoriteCount || 0,
      viewCount: item.viewCount || 0,
      status: item.status,
    }))

    const lostFoundItems: ListItem[] = (lostFoundsRes.data || []).map((item: any) => ({
      id: item.id,
      type: item.type,
      typeName: item.typeName,
      typeColor: '#E6A23C',
      title: item.title,
      price: null,
      campus: item.campus,
      location: item.location,
      image: item.image,
      publisher: item.publisher || '匿名用户',
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      time: item.time,
      favoriteCount: 0,
      viewCount: 0,
      status: item.status,
    }))

    const groupBuyItems: ListItem[] = (groupBuysRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'group',
      typeName: '拼单搭子',
      typeColor: '#67C23A',
      title: item.title,
      price: null,
      campus: item.location,
      location: item.location,
      image: item.image,
      publisher: item.publisher || '匿名用户',
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      time: item.deadline,
      favoriteCount: 0,
      viewCount: 0,
      status: item.status,
      memberInfo: `已有${item.currentPeople || 1}人/需要${item.totalPeople}人`,
    }))

    const errandItems: ListItem[] = (errandsRes.data || []).map((item: any) => ({
      id: item.id,
      type: 'errand',
      typeName: '跑腿委托',
      typeColor: '#F56C6C',
      title: item.title,
      price: item.reward,
      campus: item.campus,
      location: item.deliveryLocation,
      image: item.image,
      publisher: item.publisher || '匿名用户',
      avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
      time: item.deadline,
      favoriteCount: 0,
      viewCount: 0,
      status: item.status,
      taskInfo: `酬劳${item.reward}元`,
    }))

    items.value = [...tradeItems, ...lostFoundItems, ...groupBuyItems, ...errandItems]
  } catch (err) {
    console.error('获取列表数据失败:', err)
  } finally {
    loading.value = false
  }
}

const currentPage = ref(1)
const pageSize = ref(12)

// 价格区间筛选逻辑
const isPriceInRange = (price: number | null, range: string): boolean => {
  if (!price) return false
  switch (range) {
    case '0-50': return price <= 50
    case '50-100': return price > 50 && price <= 100
    case '100-200': return price > 100 && price <= 200
    case '200+': return price > 200
    default: return true
  }
}

// 筛选后的数据
const filteredItems = computed(() => {
  let result = items.value.filter(item => {
    //关键词搜索
    if (filters.value.keyword && !item.title.toLowerCase().includes(filters.value.keyword.toLowerCase())) {
      return false
    }
    //分类筛选
    if (filters.value.category !== 'all' && item.type !== filters.value.category) return false
    //校区筛选
    if (filters.value.campus !== 'all' && item.campus !== filters.value.campus) return false
    //价格筛选
    if (filters.value.priceRange !== 'all' && !isPriceInRange(item.price, filters.value.priceRange)) return false
    // 状态筛选
    if (filters.value.status !== 'all' && item.status !== filters.value.status) return false
    return true
  })

  // 排序
  switch (filters.value.sortBy) {
    case 'hot':
      result = [...result].sort((a, b) => b.viewCount - a.viewCount)
      break
    case 'price-low':
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price-high':
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    default:
      break
  }

  return result
})

// 是否已收藏
const isFavorite = (id: number) => favoriteSet.value.has(id)

// 切换收藏
const toggleFavorite = (id: number, event: Event) => {
  event.stopPropagation()
  if (favoriteSet.value.has(id)) {
    favoriteSet.value.delete(id)
  } else {
    favoriteSet.value.add(id)
  }
  // 更新收藏数
  const item = items.value.find(i => i.id === id)
  if (item) {
    if (favoriteSet.value.has(id)) {
      item.favoriteCount++
    } else {
      item.favoriteCount--
    }
  }
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    keyword: '',
    category: 'all',
    campus: 'all',
    priceRange: 'all',
    status: 'all',
    sortBy: 'latest',
  }
  currentPage.value = 1
}

// 快速筛选标签点击
const quickFilter = (type: string) => {
  filters.value.category = type
  currentPage.value = 1
}

// 跳转详情
const goToDetail = (item: any) => {
  const typeMap: Record<string, string> = {
    secondhand: 'trade',
    lost: 'lostFound',
    found: 'lostFound',
    group: 'groupBuy',
    errand: 'errand',
  }
  const type = typeMap[item.type] || ''
  router.push({ path: `/detail/${item.id}`, query: type ? { type } : {} })
}

// 当前筛选数量
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.category !== 'all') count++
  if (filters.value.campus !== 'all') count++
  if (filters.value.priceRange !== 'all') count++
  if (filters.value.status !== 'all') count++
  return count
})

onMounted(() => {
  fetchAllData()
})
</script>

<template>
  <div class="list-page">
    <!-- 左侧筛选侧边栏 -->
    <aside class="filter-sidebar">
      <el-card shadow="never" class="filter-card">
        <template #header>
          <div class="filter-header">
            <el-icon><Filter /></el-icon>
            <span>筛选条件</span>
            <el-badge v-if="activeFilterCount > 0" :value="activeFilterCount" type="primary" />
          </div>
        </template>

        <!-- 搜索框 -->
        <div class="filter-section">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索关键词..."
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 业务分类 -->
        <div class="filter-section">
          <div class="filter-label">业务分类</div>
          <el-select v-model="filters.category" placeholder="选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </div>

        <!-- 校区筛选 -->
        <div class="filter-section">
          <div class="filter-label">校区</div>
          <el-select v-model="filters.campus" placeholder="选择校区" style="width: 100%">
            <el-option
              v-for="camp in campuses"
              :key="camp.value"
              :label="camp.label"
              :value="camp.value"
            />
          </el-select>
        </div>

        <!-- 价格区间 -->
        <div class="filter-section">
          <div class="filter-label">价格区间</div>
          <el-select v-model="filters.priceRange" placeholder="选择价格" style="width: 100%">
            <el-option
              v-for="range in priceRanges"
              :key="range.value"
              :label="range.label"
              :value="range.value"
            />
          </el-select>
        </div>

        <!-- 状态筛选 -->
        <div class="filter-section">
          <div class="filter-label">状态</div>
          <el-select v-model="filters.status" placeholder="选择状态" style="width: 100%">
            <el-option
              v-for="stat in statuses"
              :key="stat.value"
              :label="stat.label"
              :value="stat.value"
            />
          </el-select>
        </div>

        <!-- 排序方式 -->
        <div class="filter-section">
          <div class="filter-label">排序方式</div>
          <el-select v-model="filters.sortBy" placeholder="选择排序" style="width: 100%">
            <el-option
              v-for="opt in sortOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <!-- 重置按钮 -->
        <el-button type="primary" plain @click="resetFilters" style="width: 100%">
          <el-icon><RefreshRight /></el-icon>
          重置筛选
        </el-button>
      </el-card>
    </aside>

    <!-- 右侧主内容区 -->
    <div class="main-area">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="filters.keyword"
          placeholder="搜索商品、失物、拼单、跑腿..."
          clearable
          style="width: 400px"
        >
          <template #append>
            <el-button>搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 快速分类标签 -->
      <div class="quick-filter">
        <el-tag
          :type="filters.category === 'all' ? 'primary' : 'info'"
          effect="plain"
          class="quick-tag"
          @click="quickFilter('all')"
        >
          全部
        </el-tag>
        <el-tag
          v-for="cat in categories.slice(1)"
          :key="cat.value"
          :type="filters.category === cat.value ? 'primary' : 'info'"
          effect="plain"
          class="quick-tag"
          @click="quickFilter(cat.value)"
        >
          {{ cat.label }}
        </el-tag>
      </div>

      <!-- 结果统计 -->
      <div class="result-info">
        <span>共找到 <strong>{{ filteredItems.length }}</strong> 条信息</span>
        <div class="filter-tags">
          <el-tag
            v-if="filters.category !== 'all'"
            size="small"
            closable
            @close="filters.category = 'all'"
          >
            {{ categories.find(c => c.value === filters.category)?.label }}
          </el-tag>
          <el-tag
            v-if="filters.campus !== 'all'"
            size="small"
            closable
            type="warning"
            @close="filters.campus = 'all'"
          >
            {{ campuses.find(c => c.value === filters.campus)?.label }}
          </el-tag>
          <el-tag
            v-if="filters.priceRange !== 'all'"
            size="small"
            closable
            type="success"
            @close="filters.priceRange = 'all'"
          >
            {{ priceRanges.find(p => p.value === filters.priceRange)?.label }}
          </el-tag>
          <el-tag
            v-if="filters.status !== 'all'"
            size="small"
            closable
            type="info"
            @close="filters.status = 'all'"
          >
            {{ statuses.find(s => s.value === filters.status)?.label }}
          </el-tag>
        </div>
      </div>

      <!-- 信息卡片瀑布流 -->
      <div class="card-grid">
        <el-card
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          shadow="hover"
          @click="goToDetail(item)"
        >
          <!-- 业务类型标签 -->
          <el-tag
            :color="item.typeColor"
            effect="dark"
            size="small"
            class="type-tag"
          >
            {{ item.typeName }}
          </el-tag>

          <!-- 收藏按钮 -->
          <div
            class="favorite-btn"
            :class="{ 'is-favorite': isFavorite(item.id) }"
            @click="toggleFavorite(item.id, $event)"
          >
            <el-icon size="18">
              <Star v-if="!isFavorite(item.id)" />
              <StarFilled v-else />
            </el-icon>
          </div>

          <!-- 状态标签 -->
          <el-tag
            v-if="item.status !== 'active'"
            :type="item.status === 'completed' ? 'success' : 'info'"
            size="small"
            class="status-tag"
          >
            {{ item.status === 'completed' ? '已完成' : '已关闭' }}
          </el-tag>

          <!-- 图片 -->
          <div class="card-image">
            <img :src="item.image" :alt="item.title" loading="lazy" />
          </div>

          <!-- 内容 -->
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>

            <!-- 业务专属信息 -->
            <div class="card-extra">
              <span v-if="item.price" class="price">¥{{ item.price }}</span>
              <span v-if="item.memberInfo" class="member-info">
                <el-icon><User /></el-icon>
                {{ item.memberInfo }}
              </span>
              <span v-if="item.taskInfo" class="task-info">
                <el-icon><Clock /></el-icon>
                {{ item.taskInfo }}
              </span>
            </div>

            <div class="card-meta">
              <span class="location">
                <el-icon><Location /></el-icon>
                {{ item.campus }} · {{ item.location }}
              </span>
              <span class="time">{{ item.time }}</span>
            </div>

            <div class="card-footer">
              <div class="publisher">
                <el-avatar :size="24" :src="item.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="publisher-name">{{ item.publisher }}</span>
              </div>
              <div class="stats">
                <span class="view-count">
                  <el-icon><View /></el-icon>
                  {{ item.viewCount }}
                </span>
                <span class="favorite-count">
                  <el-icon><Star /></el-icon>
                  {{ item.favoriteCount }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="filteredItems.length === 0" description="没有找到相关信息">
        <el-button type="primary" @click="resetFilters">重置筛选</el-button>
      </el-empty>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredItems.length"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  display: flex;
  gap: var(--space-6);
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--space-7) var(--space-5);
}

.filter-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.filter-card {
  border-radius: var(--radius-md) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: none !important;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
}

.filter-section {
  margin-bottom: var(--space-4);
}

.filter-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
  font-weight: 400;
}

.main-area {
  flex: 1;
  min-width: 0;
}

.search-bar {
  display: flex;
  margin-bottom: var(--space-5);
}

.quick-filter {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.quick-tag {
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
}

.quick-tag:hover {
  border-color: var(--color-text-tertiary);
}

.result-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.result-info strong {
  color: var(--color-text-primary);
  font-weight: 600;
}

.filter-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.item-card {
  border-radius: var(--radius-md) !important;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  border: 1px solid var(--color-border) !important;
  box-shadow: none !important;
}

.item-card:hover {
  border-color: var(--color-text-tertiary) !important;
}

.type-tag {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 1;
  border: none;
  background: rgba(26, 26, 26, 0.85) !important;
  color: #fff !important;
  font-size: 11px !important;
  height: 20px !important;
  line-height: 18px !important;
  padding: 0 6px !important;
  border-radius: var(--radius-sm) !important;
}

.favorite-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 1;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-tertiary);
}

.favorite-btn:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-secondary);
}

.favorite-btn.is-favorite {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.status-tag {
  position: absolute;
  top: var(--space-3);
  right: 42px;
  z-index: 1;
  border-radius: var(--radius-sm) !important;
  font-size: 11px !important;
  height: 20px !important;
  line-height: 18px !important;
  padding: 0 6px !important;
}

.card-image {
  height: 140px;
  overflow: hidden;
  background: var(--color-border-light);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.item-card:hover .card-image img {
  transform: scale(1.02);
}

.card-body {
  padding: var(--space-4);
}

.card-title {
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.card-extra {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.member-info,
.task-info {
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
}

.publisher {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.publisher-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.view-count,
.favorite-count {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--space-7);
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-card__header) {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
  box-shadow: 0 0 0 1px var(--color-border) inset;
}

:deep(.el-button) {
  border-radius: var(--radius-md);
}

:deep(.el-select) {
  --el-select-border-color-hover: var(--color-text-tertiary);
}
</style>
