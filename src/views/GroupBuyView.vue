<script setup lang="ts">
import { ref } from 'vue'

const activeCategory = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'milktea', label: '奶茶拼单' },
  { key: 'takeout', label: '外卖拼单' },
  { key: 'study', label: '学习搭子' },
  { key: 'sports', label: '运动搭子' },
  { key: 'other', label: '其他' },
]

const groupBuys = ref([
  {
    id: 1,
    title: '喜茶拼单 还差2人 免配送费',
    category: 'milktea',
    description: '喜茶金凤茶王系列拼单，目前已有3人，还差2人即可免配送费，送到狮子山校区宿舍楼下。',
    currentPeople: 3,
    totalPeople: 5,
    deadline: '今天 18:00',
    location: '狮子山校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaohong',
    publisher: '小红同学',
    time: '30分钟前',
    image: 'https://picsum.photos/seed/milktea1/400/300',
  },
  {
    id: 2,
    title: '麦当劳全家桶拼单 4人平分',
    category: 'takeout',
    description: '麦当劳全家桶拼单，4个人平分更划算，预计每人45元左右，送到成龙校区门口。',
    currentPeople: 2,
    totalPeople: 4,
    deadline: '今天 12:30',
    location: '成龙校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
    publisher: '小明同学',
    time: '1小时前',
    image: 'https://picsum.photos/seed/mcdonalds1/400/300',
  },
  {
    id: 3,
    title: '考研自习搭子 图书馆三楼',
    category: 'study',
    description: '找考研自习搭子，每天早上8点到晚上10点，图书馆三楼自习室，互相监督学习，一起上岸！',
    currentPeople: 1,
    totalPeople: 3,
    deadline: '长期有效',
    location: '狮子山校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoli',
    publisher: '小李同学',
    time: '2小时前',
    image: 'https://picsum.photos/seed/study1/400/300',
  },
  {
    id: 4,
    title: '羽毛球搭子 每周三周五晚',
    category: 'sports',
    description: '找羽毛球搭子，每周三周五晚上7-9点，体育馆羽毛球场，水平中等，一起锻炼身体！',
    currentPeople: 2,
    totalPeople: 4,
    deadline: '长期有效',
    location: '成龙校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaozhang',
    publisher: '小张同学',
    time: '3小时前',
    image: 'https://picsum.photos/seed/badminton1/400/300',
  },
  {
    id: 5,
    title: '瑞幸咖啡拼单 9.9元一杯',
    category: 'milktea',
    description: '瑞幸9.9元活动拼单，目前2人，还差3人免配送费，送到教学楼楼下。',
    currentPeople: 2,
    totalPeople: 5,
    deadline: '今天 10:00',
    location: '狮子山校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang',
    publisher: '小王同学',
    time: '4小时前',
    image: 'https://picsum.photos/seed/luckin1/400/300',
  },
  {
    id: 6,
    title: '期末复习搭子 高数线代',
    category: 'study',
    description: '期末考试复习搭子，一起复习高数和线代，共享笔记和复习资料，互相讲题，目标不挂科！',
    currentPeople: 2,
    totalPeople: 4,
    deadline: '本学期末',
    location: '成龙校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaozhao',
    publisher: '小赵同学',
    time: '5小时前',
    image: 'https://picsum.photos/seed/math1/400/300',
  },
  {
    id: 7,
    title: '健身房搭子 一起办卡优惠',
    category: 'sports',
    description: '学校附近健身房拼团办卡，5人以上8折优惠，找一起健身的小伙伴，互相督促！',
    currentPeople: 3,
    totalPeople: 5,
    deadline: '本周日',
    location: '狮子山校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaochen',
    publisher: '小陈同学',
    time: '6小时前',
    image: 'https://picsum.photos/seed/gym1/400/300',
  },
  {
    id: 8,
    title: '海底捞拼单 6人以上88折',
    category: 'takeout',
    description: '周末海底捞聚餐拼单，6人以上88折，目前已有4人，还差2-3人，想吃的同学快来！',
    currentPeople: 4,
    totalPeople: 6,
    deadline: '本周六 18:00',
    location: '成龙校区',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoliu',
    publisher: '小刘同学',
    time: '8小时前',
    image: 'https://picsum.photos/seed/haidilao1/400/300',
  },
])

const filteredGroupBuys = ref(groupBuys.value)

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
  if (key === 'all') {
    filteredGroupBuys.value = groupBuys.value
  } else {
    filteredGroupBuys.value = groupBuys.value.filter(g => g.category === key)
  }
}

const getProgress = (current: number, total: number) => {
  return Math.round((current / total) * 100)
}
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
        >
          <div class="card-image-wrapper">
            <img :src="item.image" :alt="item.title" class="card-image" />
            <div class="card-category">
              <span v-if="item.category === 'milktea'">🧋 奶茶</span>
              <span v-else-if="item.category === 'takeout'">🍔 外卖</span>
              <span v-else-if="item.category === 'study'">📚 学习</span>
              <span v-else-if="item.category === 'sports'">🏃 运动</span>
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
                <img :src="item.avatar" :alt="item.publisher" class="publisher-avatar" />
                <span class="publisher-name">{{ item.publisher }}</span>
              </div>
              <button class="join-btn">加入拼单</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.groupbuy-page {
  padding-bottom: 48px;
}

.hero-section {
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 50%, #A7D98A 100%);
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
  color: #67C23A;
  background: #F0F9EB;
}

.category-tab.active {
  background: #67C23A;
  color: #fff;
  font-weight: 500;
}

.groupbuys-section {
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

.groupbuys-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.groupbuy-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.groupbuy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-image-wrapper {
  position: relative;
  width: 200px;
  flex-shrink: 0;
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
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}

.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
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
  font-size: 13px;
  color: #606266;
}

.progress-percent {
  font-size: 13px;
  font-weight: 600;
  color: #67C23A;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #F0F9EB;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67C23A, #85CE61);
  border-radius: 3px;
  transition: width 0.3s ease;
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
  padding-top: 14px;
  border-top: 1px solid #F2F6FC;
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publisher-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F5F7FA;
}

.publisher-name {
  font-size: 13px;
  color: #606266;
}

.join-btn {
  padding: 8px 20px;
  border: none;
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>
