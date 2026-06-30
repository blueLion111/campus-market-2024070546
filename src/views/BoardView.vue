<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as echarts from 'echarts'
import { getTrades } from '../api/trade'
import { getLostFounds } from '../api/lostFound'
import { getGroupBuys } from '../api/groupBuy'
import { getErrands } from '../api/errand'

const loading = ref(false)

interface StatsCard {
  title: string
  value: number
  unit: string
  icon: string
  color: string
  bgColor: string
  trend: string
}

const statsCards = ref<StatsCard[]>([
  { title: '信息总数', value: 0, unit: '条', icon: 'Document', color: '#409eff', bgColor: '#ecf5ff', trend: '+0%' },
  { title: '二手交易', value: 0, unit: '条', icon: 'ShoppingCart', color: '#409eff', bgColor: '#ecf5ff', trend: '+0%' },
  { title: '失物招领', value: 0, unit: '条', icon: 'Search', color: '#e6a23c', bgColor: '#fdf6ec', trend: '+0%' },
  { title: '拼单搭子', value: 0, unit: '条', icon: 'UserPlus', color: '#67c23a', bgColor: '#f0f9eb', trend: '+0%' },
])

interface RecentRecord {
  id: number
  title: string
  type: string
  publisher: string
  avatar: string
  status: string
  time: string
  typeName: string
}

const recentRecords = ref<RecentRecord[]>([])

const typeChartRef = shallowRef<HTMLElement | null>(null)
const campusChartRef = shallowRef<HTMLElement | null>(null)
const trendChartRef = shallowRef<HTMLElement | null>(null)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [tradesRes, lostFoundsRes, groupBuysRes, errandsRes] = await Promise.all([
      getTrades().catch(() => ({ data: [] })),
      getLostFounds().catch(() => ({ data: [] })),
      getGroupBuys().catch(() => ({ data: [] })),
      getErrands().catch(() => ({ data: [] })),
    ])

    const trades = tradesRes.data || []
    const lostFounds = lostFoundsRes.data || []
    const groupBuys = groupBuysRes.data || []
    const errands = errandsRes.data || []

    const totalCount = trades.length + lostFounds.length + groupBuys.length + errands.length

    statsCards.value = [
      { title: '信息总数', value: totalCount, unit: '条', icon: 'Document', color: '#409eff', bgColor: '#ecf5ff', trend: '+0%' },
      { title: '二手交易', value: trades.length, unit: '条', icon: 'ShoppingCart', color: '#409eff', bgColor: '#ecf5ff', trend: '+0%' },
      { title: '失物招领', value: lostFounds.length, unit: '条', icon: 'Search', color: '#e6a23c', bgColor: '#fdf6ec', trend: '+0%' },
      { title: '拼单搭子', value: groupBuys.length, unit: '条', icon: 'UserPlus', color: '#67c23a', bgColor: '#f0f9eb', trend: '+0%' },
    ]

    const getTypeName = (type: string) => {
      if (type === 'secondhand' || type === 'trade') return '二手交易'
      if (type === 'lost' || type === 'found') return '失物招领'
      if (type === 'group') return '拼单搭子'
      if (type === 'errand') return '跑腿委托'
      return type
    }

    const allItems: RecentRecord[] = [
      ...trades.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: 'secondhand',
        typeName: '二手交易',
        publisher: item.publisher,
        avatar: item.publisherAvatar,
        status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已关闭' : '已完成',
        time: item.publishTime,
      })),
      ...lostFounds.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        typeName: item.typeName,
        publisher: item.publisher || '匿名用户',
        avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
        status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已关闭' : '已完成',
        time: item.time,
      })),
      ...groupBuys.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: 'group',
        typeName: '拼单搭子',
        publisher: item.publisher || '匿名用户',
        avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
        status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已关闭' : '已完成',
        time: item.deadline,
      })),
      ...errands.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: 'errand',
        typeName: '跑腿委托',
        publisher: item.publisher || '匿名用户',
        avatar: 'https://picsum.photos/seed/avatar-user/100/100' + item.id,
        status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已关闭' : '已完成',
        time: item.deadline,
      })),
    ]

    recentRecords.value = allItems.slice(0, 10)

    initTypeChart(trades.length, lostFounds.length, groupBuys.length, errands.length)
    initCampusChart(trades, lostFounds, groupBuys, errands)
  } catch (err) {
    console.error('获取看板数据失败:', err)
  } finally {
    loading.value = false
  }
}

const initTypeChart = (tradesCount: number, lostFoundsCount: number, groupBuysCount: number, errandsCount: number) => {
  if (!typeChartRef.value) return
  const chart = echarts.init(typeChartRef.value)
  chart.setOption({
    tooltip: { 
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: { 
      orient: 'vertical', 
      right: 16, 
      top: 'center',
      textStyle: { color: '#606266' }
    },
    series: [
      {
        name: '信息类型',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { 
          borderRadius: 10, 
          borderColor: '#fff', 
          borderWidth: 3 
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8
        },
        data: [
          { value: tradesCount, name: '二手交易', itemStyle: { color: '#409eff' } },
          { value: lostFoundsCount, name: '失物招领', itemStyle: { color: '#e6a23c' } },
          { value: groupBuysCount, name: '拼单搭子', itemStyle: { color: '#67c23a' } },
          { value: errandsCount, name: '跑腿委托', itemStyle: { color: '#f56c6c' } },
        ],
      },
    ],
  })
}

const initCampusChart = (trades: any[], lostFounds: any[], groupBuys: any[], errands: any[]) => {
  if (!campusChartRef.value) return
  const chart = echarts.init(campusChartRef.value)
  
  const shiziCount = [
    ...trades.filter((t: any) => t.campus === '狮子山校区'),
    ...lostFounds.filter((t: any) => t.campus === '狮子山校区'),
  ].length
  
  const chenglongCount = [
    ...trades.filter((t: any) => t.campus === '成龙校区'),
    ...lostFounds.filter((t: any) => t.campus === '成龙校区'),
  ].length
  
  chart.setOption({
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c}条'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['狮子山校区', '成龙校区'],
      axisLabel: { color: '#606266', fontSize: 12 },
      axisLine: { lineStyle: { color: '#ebeef5' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#606266', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f5f7fa' } },
    },
    series: [
      {
        name: '信息数量',
        type: 'bar',
        barWidth: '50%',
        barRadius: 8,
        data: [
          { value: shiziCount, itemStyle: { color: '#409eff' } },
          { value: chenglongCount, itemStyle: { color: '#67c23a' } },
        ],
        itemStyle: {
          borderRadius: [8, 8, 0, 0]
        },
      },
    ],
  })
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  const chart = echarts.init(trendChartRef.value)
  chart.setOption({
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      textStyle: { color: '#606266' }
    },
    legend: { 
      data: ['发布量', '浏览量'], 
      right: 20,
      textStyle: { color: '#606266' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: { color: '#606266', fontSize: 12 },
      axisLine: { lineStyle: { color: '#ebeef5' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#606266', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f5f7fa' } },
    },
    series: [
      {
        name: '发布量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [0, 0, 0, 0, 0, 0, 0],
        itemStyle: { color: '#409eff' },
        lineStyle: { width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.25)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.02)' },
        ]) },
      },
      {
        name: '浏览量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [0, 0, 0, 0, 0, 0, 0],
        itemStyle: { color: '#67c23a' },
        lineStyle: { width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.25)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0.02)' },
        ]) },
      },
    ],
  })
}

const statusTagType = (status: string) => {
  if (status === '进行中' || status === '已通过') return 'success'
  if (status === '待审核') return 'warning'
  return 'info'
}

const getTypeColor = (type: string) => {
  const map: Record<string, string> = {
    '二手交易': '#409eff',
    '失物招领': '#e6a23c',
    '拼单搭子': '#67c23a',
    '跑腿委托': '#f56c6c',
  }
  return map[type] || '#909399'
}

const handleAction = (action: string, row: any) => {
  console.log(action, row)
}

onMounted(() => {
  fetchDashboardData()
  initTrendChart()
})
</script>

<template>
  <div class="board-page">
    <h2 class="page-title">数据看板</h2>

    <div class="stats-grid">
      <el-card v-for="card in statsCards" :key="card.title" shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <span class="stat-title">{{ card.title }}</span>
            <div class="stat-value">
              <span class="value">{{ card.value }}</span>
              <span class="unit">{{ card.unit }}</span>
            </div>
            <span class="stat-trend" :class="card.trend.startsWith('+') ? 'up' : 'down'">
              {{ card.trend }}
            </span>
          </div>
          <div class="stat-icon" :style="{ background: card.bgColor, color: card.color }">
            <el-icon :size="28">
              <component :is="card.icon" />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <div class="charts-grid">
      <el-card shadow="never" class="chart-card">
        <template #header>
          <div class="chart-header">
            <span class="chart-title">信息类型分布</span>
            <el-tag size="small" type="info">本周</el-tag>
          </div>
        </template>
        <div ref="typeChartRef" class="chart-container"></div>
      </el-card>

      <el-card shadow="never" class="chart-card">
        <template #header>
          <div class="chart-header">
            <span class="chart-title">校区分布</span>
            <el-tag size="small" type="info">全部</el-tag>
          </div>
        </template>
        <div ref="campusChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <el-card shadow="never" class="chart-card trend-card">
      <template #header>
        <div class="chart-header">
          <span class="chart-title">近7天发布趋势</span>
          <div class="header-actions">
            <el-button size="small" type="primary" link>导出数据</el-button>
          </div>
        </div>
      </template>
      <div ref="trendChartRef" class="chart-container trend-chart"></div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>最近发布记录</span>
          <div class="header-actions">
            <el-input placeholder="搜索..." prefix-icon="Search" style="width: 200px" size="small" />
            <el-button size="small" type="primary" link>查看全部</el-button>
          </div>
        </div>
      </template>
      <el-table :data="recentRecords" style="width: 100%" :row-class-name="'table-row'">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="标题" min-width="180">
          <template #default="{ row }">
            <div class="title-cell">
              <el-image :src="'https://picsum.photos/seed/item' + row.id + '/40/40'" fit="cover" class="item-thumb" />
              <span class="item-title">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small" :style="{ background: getTypeColor(row.type), borderColor: getTypeColor(row.type) }" effect="dark">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publisher" label="发布人" width="120">
          <template #default="{ row }">
            <div class="publisher-cell">
              <el-avatar :size="24" :src="row.avatar" />
              <span>{{ row.publisher }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status) as any" size="small" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleAction('view', row)">查看</el-button>
            <el-button v-if="row.status === '待审核'" size="small" type="success" link @click="handleAction('approve', row)">通过</el-button>
            <el-button v-if="row.status === '待审核'" size="small" type="danger" link @click="handleAction('reject', row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.board-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card :deep(.el-card__body) {
  padding: 22px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
}

.unit {
  font-size: 14px;
  color: #909399;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}

.stat-trend.up {
  background: #f0f9eb;
  color: #67c23a;
}

.stat-trend.down {
  background: #fef0f0;
  color: #f56c6c;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  border-radius: 12px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-weight: 500;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-container {
  height: 280px;
  width: 100%;
}

.trend-card .chart-container {
  height: 320px;
}

.trend-chart {
  height: 320px;
}

.table-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-title {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publisher-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}
</style>
