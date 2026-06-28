<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('lost')

const tabs = [
  { key: 'lost', label: '寻物启事', icon: '🔍' },
  { key: 'found', label: '失物招领', icon: '📦' },
]

const items = ref([
  {
    id: 1,
    type: 'lost',
    title: '丢失黑色双肩包 内有笔记本电脑',
    description: '今天下午在图书馆三楼自习室丢失一个黑色双肩包，包内有一台MacBook Pro和一些课本，电脑里有很重要的论文资料，求好心人归还，必有重谢！',
    location: '图书馆三楼',
    time: '2小时前',
    date: '6月28日',
    contact: '138****8888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
    publisher: '王同学',
    campus: '狮子山校区',
    image: 'https://picsum.photos/seed/bag1/400/300',
  },
  {
    id: 2,
    type: 'found',
    title: '在食堂一楼捡到一张校园卡',
    description: '今天中午在食堂一楼靠窗的位置捡到一张校园卡，卡套是蓝色的，上面有个小熊挂件，请失主联系我认领。',
    location: '食堂一楼',
    time: '3小时前',
    date: '6月28日',
    contact: '139****6666',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lili',
    publisher: '李同学',
    campus: '成龙校区',
    image: 'https://picsum.photos/seed/card1/400/300',
  },
  {
    id: 3,
    type: 'lost',
    title: '丢失AirPods Pro 白色充电盒',
    description: '昨天在操场跑步的时候弄丢了AirPods Pro，充电盒上有我贴的贴纸，是海贼王的，对我很重要，捡到的同学麻烦联系我，有偿！',
    location: '学校操场',
    time: '昨天',
    date: '6月27日',
    contact: '137****5555',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhanghua',
    publisher: '张同学',
    campus: '狮子山校区',
    image: 'https://picsum.photos/seed/earbuds/400/300',
  },
  {
    id: 4,
    type: 'found',
    title: '捡到一串钥匙 有很多挂件',
    description: '在教学楼B栋二楼卫生间门口捡到一串钥匙，上面有很多可爱的挂件，有玉桂狗和布丁狗，失主肯定很着急，快来认领吧！',
    location: '教学楼B栋',
    time: '5小时前',
    date: '6月28日',
    contact: '136****7777',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaolei',
    publisher: '赵同学',
    campus: '成龙校区',
    image: 'https://picsum.photos/seed/keys1/400/300',
  },
  {
    id: 5,
    type: 'lost',
    title: '丢失学生证 文学院2023级',
    description: '今天上午在去上课的路上弄丢了学生证，姓名李某某，文学院汉语言文学专业2023级，捡到的同学麻烦联系我，非常感谢！',
    location: '文学院附近',
    time: '4小时前',
    date: '6月28日',
    contact: '135****9999',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lixin',
    publisher: '李同学',
    campus: '狮子山校区',
    image: 'https://picsum.photos/seed/idcard/400/300',
  },
  {
    id: 6,
    type: 'found',
    title: '捡到一把蓝色雨伞',
    description: '昨天下雨在图书馆门口捡到一把蓝色的长柄雨伞，伞面有轻微破损，应该是哪位同学忘记拿了，请到图书馆服务台认领。',
    location: '图书馆门口',
    time: '昨天',
    date: '6月27日',
    contact: '图书馆服务台',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenyu',
    publisher: '陈同学',
    campus: '狮子山校区',
    image: 'https://picsum.photos/seed/umbrella/400/300',
  },
])

const filteredItems = computed(() => {
  return items.value.filter(item => item.type === activeTab.value)
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
          <div class="decor-icon">🔍</div>
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
          <span class="tab-icon">{{ tab.icon }}</span>
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
                <span class="meta-icon">📍</span>
                <span class="meta-text">{{ item.location }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🏫</span>
                <span class="meta-text">{{ item.campus }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">⏰</span>
                <span class="meta-text">{{ item.time }}</span>
              </div>
            </div>
            <div class="item-footer">
              <div class="publisher-info">
                <img :src="item.avatar" :alt="item.publisher" class="publisher-avatar" />
                <span class="publisher-name">{{ item.publisher }}</span>
              </div>
              <button class="contact-btn">联系TA</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lost-found-page {
  padding-bottom: 48px;
}

.hero-section {
  background: linear-gradient(135deg, #E6A23C 0%, #F0C78E 50%, #F5DAB0 100%);
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

.tab-section {
  margin-bottom: 24px;
}

.tab-container {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  gap: 8px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  color: #606266;
}

.tab-item:hover {
  background: #FDF6EC;
  color: #E6A23C;
}

.tab-item.active {
  background: linear-gradient(135deg, #E6A23C, #F0C78E);
  color: #fff;
  font-weight: 500;
}

.tab-icon {
  font-size: 22px;
}

.items-section {
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

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
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
}

.item-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.item-type-badge.lost {
  background: #F56C6C;
}

.item-type-badge.found {
  background: #67C23A;
}

.item-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.item-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  gap: 24px;
  margin-bottom: auto;
  padding-bottom: 16px;
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

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #F2F6FC;
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

.publisher-name {
  font-size: 14px;
  color: #606266;
}

.contact-btn {
  padding: 8px 24px;
  border: none;
  background: linear-gradient(135deg, #E6A23C, #F0C78E);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>
