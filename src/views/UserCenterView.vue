<script setup lang="ts">
const avatarSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#409EFF"/><text x="50" y="68" font-size="48" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-weight="bold">张</text></svg>`)

const userInfo = {
  name: '张同学',
  avatar: `data:image/svg+xml,${avatarSvg}`,
  college: '计算机科学学院',
  major: '软件工程专业',
  grade: '2023级',
  creditScore: 98,
  studentId: '20230101001',
  campus: '狮子山校区',
}

const stats = [
  { label: '我的发布', value: 28, icon: '📝', color: '#409EFF' },
  { label: '我的收藏', value: 56, icon: '⭐', color: '#E6A23C' },
  { label: '我的订单', value: 12, icon: '📦', color: '#67C23A' },
  { label: '消息通知', value: 8, icon: '💬', color: '#F56C6C' },
]

const menuItems = [
  { icon: '📝', label: '我的发布', desc: '查看我发布的所有信息', color: '#ECF5FF' },
  { icon: '⭐', label: '我的收藏', desc: '收藏的商品和信息', color: '#FDF6EC' },
  { icon: '💰', label: '我的钱包', desc: '余额和交易记录', color: '#F0F9EB' },
  { icon: '📦', label: '我的订单', desc: '购买和出售的订单', color: '#FEF0F0' },
  { icon: '💬', label: '消息中心', desc: '系统消息和私信', color: '#F4F4F5' },
  { icon: '🤝', label: '我的搭子', desc: '一起拼单的小伙伴', color: '#ECF5FF' },
  { icon: '🎯', label: '信用分', desc: '查看信用等级详情', color: '#FDF6EC' },
  { icon: '⚙️', label: '账号设置', desc: '个人资料和隐私设置', color: '#F0F9EB' },
]

const recentActivities = [
  { type: 'publish', title: '发布了二手商品：iPad 2021款', time: '2小时前' },
  { type: 'order', title: '完成了跑腿委托：代取快递', time: '5小时前' },
  { type: 'favorite', title: '收藏了拼单：喜茶拼单', time: '昨天' },
  { type: 'message', title: '收到一条新消息', time: '昨天' },
]
</script>

<template>
  <div class="user-center-page">
    <section class="profile-hero">
      <div class="hero-bg">
        <div class="bg-pattern"></div>
        <div class="bg-circle c1"></div>
        <div class="bg-circle c2"></div>
        <div class="bg-circle c3"></div>
      </div>
      <div class="profile-content">
        <div class="profile-left">
          <div class="avatar-wrapper">
            <img :src="userInfo.avatar" :alt="userInfo.name" class="avatar" />
            <div class="avatar-badge">
              <span class="badge-text">LV.5</span>
            </div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ userInfo.name }}</h1>
            <div class="user-detail">
              <span class="user-college">{{ userInfo.college }}</span>
              <span class="user-divider">·</span>
              <span class="user-major">{{ userInfo.major }}</span>
            </div>
            <div class="user-meta">
              <span class="meta-tag">{{ userInfo.grade }}</span>
              <span class="meta-tag">{{ userInfo.campus }}</span>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="credit-card">
            <div class="credit-header">
              <span class="credit-icon">★</span>
              <span class="credit-label">信用分</span>
            </div>
            <div class="credit-score">{{ userInfo.creditScore }}</div>
            <div class="credit-level">优秀</div>
            <div class="credit-bar">
              <div class="credit-fill" style="width: 98%"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
        >
          <div class="stat-icon" :style="{ backgroundColor: stat.color + '15', color: stat.color }">
            {{ stat.icon }}
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="menu-section">
      <h2 class="section-title">功能入口</h2>
      <div class="menu-grid">
        <div
          v-for="item in menuItems"
          :key="item.label"
          class="menu-item"
        >
          <div class="menu-icon" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
          </div>
          <div class="menu-info">
            <span class="menu-label">{{ item.label }}</span>
            <span class="menu-desc">{{ item.desc }}</span>
          </div>
          <div class="menu-arrow">›</div>
        </div>
      </div>
    </section>

    <section class="activity-section">
      <div class="section-header">
        <h2 class="section-title">最近动态</h2>
        <span class="section-more">查看全部</span>
      </div>
      <div class="activity-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.title"
          class="activity-item"
        >
          <div class="activity-dot"></div>
          <div class="activity-content">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.user-center-page {
  padding-bottom: 48px;
}

.profile-hero {
  position: relative;
  border-radius: 16px;
  padding: 48px 56px;
  margin-bottom: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 40%, #79BBFF 100%);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%);
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.bg-circle.c1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -50px;
}

.bg-circle.c2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: 60%;
}

.bg-circle.c3 {
  width: 80px;
  height: 80px;
  top: 30%;
  left: 30%;
  background: rgba(255, 255, 255, 0.08);
}

.profile-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #E6A23C, #F0C78E);
  padding: 3px 10px;
  border-radius: 12px;
  border: 2px solid #fff;
}

.badge-text {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.user-info {
  color: #fff;
}

.user-name {
  font-size: 30px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.user-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  opacity: 0.95;
}

.user-divider {
  opacity: 0.6;
}

.user-meta {
  display: flex;
  gap: 10px;
}

.meta-tag {
  font-size: 13px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
}

.profile-right {
  flex-shrink: 0;
}

.credit-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.credit-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.credit-icon {
  font-size: 20px;
  color: #fff;
}

.credit-label {
  font-size: 14px;
  opacity: 0.9;
}

.credit-score {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.credit-level {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.credit-bar {
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.credit-fill {
  height: 100%;
  background: #fff;
  border-radius: 3px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.menu-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.menu-label {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.menu-desc {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-arrow {
  font-size: 20px;
  color: #C0C4CC;
  font-weight: 300;
  flex-shrink: 0;
}

.activity-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header .section-title {
  margin: 0;
}

.section-more {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
  transition: color 0.2s;
}

.section-more:hover {
  color: #66B1FF;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #F2F6FC;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409EFF;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-title {
  font-size: 14px;
  color: #606266;
}

.activity-time {
  font-size: 13px;
  color: #C0C4CC;
  flex-shrink: 0;
}
</style>
