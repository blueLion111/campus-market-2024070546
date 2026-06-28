<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('published')

const userInfo = ref({
  nickname: '小川同学',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xiaochuan',
  college: '计算机科学学院',
  campus: '狮子山校区',
  creditScore: 98,
  publishCount: 12,
  favoriteCount: 28,
  joinDate: '2025-09-01',
})

const myPublished = ref([
  {
    id: 1,
    title: '高等数学教材 全新',
    type: '二手交易',
    typeColor: '#409eff',
    price: 25,
    status: 'active',
    statusText: '进行中',
    image: 'https://picsum.photos/seed/textbook22/400/300',
    createdAt: '2026-06-28',
  },
  {
    id: 2,
    title: '丢失校园卡一张',
    type: '失物招领',
    typeColor: '#e6a23c',
    price: null,
    status: 'completed',
    statusText: '已找回',
    image: 'https://picsum.photos/seed/card33/400/300',
    createdAt: '2026-06-25',
  },
  {
    id: 3,
    title: '奶茶拼单 还差2人',
    type: '拼单搭子',
    typeColor: '#67c23a',
    price: null,
    status: 'active',
    statusText: '进行中',
    image: 'https://picsum.photos/seed/milktea44/400/300',
    createdAt: '2026-06-20',
  },
])

const myFavorites = ref([
  {
    id: 101,
    title: '蓝牙耳机 漫步者',
    type: '二手交易',
    typeColor: '#409eff',
    price: 89,
    image: 'https://picsum.photos/seed/headphone55/400/300',
    publisher: '刘同学',
    publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu',
  },
  {
    id: 102,
    title: '代取快递 长期接单',
    type: '跑腿委托',
    typeColor: '#f56c6c',
    price: 10,
    image: 'https://picsum.photos/seed/package66/400/300',
    publisher: '陈同学',
    publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen2',
  },
  {
    id: 103,
    title: '图书馆学习搭子',
    type: '拼单搭子',
    typeColor: '#67c23a',
    price: null,
    image: 'https://picsum.photos/seed/library77/400/300',
    publisher: '钱同学',
    publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Qian',
  },
  {
    id: 104,
    title: '台灯 LED护眼灯',
    type: '二手交易',
    typeColor: '#409eff',
    price: 35,
    image: 'https://picsum.photos/seed/lamp88/400/300',
    publisher: '周同学',
    publisherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhou',
  },
])

const recentActivity = ref([
  { id: 1, action: '发布了新信息', target: '高等数学教材', time: '2小时前', icon: 'Document' },
  { id: 2, action: '收藏了', target: '蓝牙耳机 漫步者', time: '5小时前', icon: 'Star' },
  { id: 3, action: '更新了状态', target: '丢失校园卡 → 已找回', time: '昨天', icon: 'Check' },
  { id: 4, action: '发送了消息给', target: '张同学', time: '昨天', icon: 'ChatDotRound' },
])

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const updateStatus = (item: any) => {
  item.status = item.status === 'active' ? 'completed' : 'active'
  item.statusText = item.status === 'active' ? '进行中' : '已完成'
}

const removeFavorite = (id: number) => {
  myFavorites.value = myFavorites.value.filter(f => f.id !== id)
}

const statCards = [
  { label: '发布', value: computed(() => userInfo.value.publishCount), icon: 'Document', color: '#409eff' },
  { label: '收藏', value: computed(() => userInfo.value.favoriteCount), icon: 'Star', color: '#f56c6c' },
  { label: '信用分', value: computed(() => userInfo.value.creditScore), icon: 'Medal', color: '#e6a23c' },
]
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">个人中心</h2>

    <div class="profile-container">
      <div class="main-content">
        <el-card shadow="never" class="user-card">
          <div class="user-info">
            <el-avatar :size="88" :src="userInfo.avatar" class="user-avatar" />
            <div class="user-details">
              <h2 class="user-name">{{ userInfo.nickname }}</h2>
              <p class="user-college">
                <el-icon><School /></el-icon>
                {{ userInfo.college }}
              </p>
              <p class="user-campus">
                <el-icon><Location /></el-icon>
                {{ userInfo.campus }}
              </p>
              <div class="user-stats">
                <div class="stat" v-for="s in statCards" :key="s.label">
                  <span class="stat-value" :style="{ color: s.color }">{{ s.value.value }}</span>
                  <span class="stat-label">{{ s.label }}</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <el-button type="primary" plain>
                <el-icon><Edit /></el-icon>
                编辑资料
              </el-button>
              <el-button plain>
                <el-icon><Setting /></el-icon>
                设置
              </el-button>
            </div>
          </div>
        </el-card>

        <div class="function-grid">
          <el-card shadow="hover" class="func-card" @click="activeTab = 'published'">
            <div class="func-icon" style="background: #ecf5ff; color: #409eff">
              <el-icon :size="24"><Document /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的发布</span>
              <span class="func-desc">管理你发布的信息</span>
            </div>
          </el-card>

          <el-card shadow="hover" class="func-card" @click="activeTab = 'favorites'">
            <div class="func-icon" style="background: #fef0f0; color: #f56c6c">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的收藏</span>
              <span class="func-desc">查看收藏的信息</span>
            </div>
          </el-card>

          <el-card shadow="hover" class="func-card" @click="router.push('/publish')">
            <div class="func-icon" style="background: #f0f9eb; color: #67c23a">
              <el-icon :size="24"><Plus /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">发布新信息</span>
              <span class="func-desc">快速发布校园信息</span>
            </div>
          </el-card>

          <el-card shadow="hover" class="func-card">
            <div class="func-icon" style="background: #fdf6ec; color: #e6a23c">
              <el-icon :size="24"><Setting /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">账号设置</span>
              <span class="func-desc">修改个人资料</span>
            </div>
          </el-card>
        </div>

        <el-card shadow="never" class="tab-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="我的发布" name="published">
              <div class="list-content">
                <div
                  v-for="item in myPublished"
                  :key="item.id"
                  class="list-item"
                  @click="goToDetail(item.id)"
                >
                  <el-image :src="item.image" style="width: 100px; height: 100px; border-radius: 10px; flex-shrink: 0" fit="cover" />
                  <div class="item-info">
                    <div class="item-header">
                      <el-tag :color="item.typeColor" effect="dark" size="small">{{ item.type }}</el-tag>
                      <h3 class="item-title">{{ item.title }}</h3>
                    </div>
                    <p class="item-desc" v-if="item.price">售价：<span class="price">¥{{ item.price }}</span></p>
                    <p class="item-time">发布于 {{ item.createdAt }}</p>
                    <div class="item-actions">
                      <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small" effect="plain">
                        {{ item.statusText }}
                      </el-tag>
                      <el-button size="small" type="primary" plain @click.stop="updateStatus(item)">
                        {{ item.status === 'active' ? '标记完成' : '重新上架' }}
                      </el-button>
                      <el-button size="small" type="danger" plain @click.stop="goToDetail(item.id)">
                        编辑
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="我的收藏" name="favorites">
              <div class="favorite-grid">
                <el-card
                  v-for="item in myFavorites"
                  :key="item.id"
                  shadow="hover"
                  class="favorite-card"
                >
                  <div class="fav-image" @click="goToDetail(item.id)">
                    <img :src="item.image" :alt="item.title" />
                    <el-tag :color="item.typeColor" effect="dark" size="small" class="fav-type">
                      {{ item.type }}
                    </el-tag>
                    <div class="fav-overlay">
                      <el-button type="primary" size="small">查看详情</el-button>
                    </div>
                  </div>
                  <div class="fav-info">
                    <h3 class="fav-title" @click="goToDetail(item.id)">{{ item.title }}</h3>
                    <div class="fav-meta">
                      <span v-if="item.price" class="fav-price">¥{{ item.price }}</span>
                      <div class="fav-publisher">
                        <el-avatar :size="20" :src="item.publisherAvatar" />
                        <span>{{ item.publisher }}</span>
                      </div>
                    </div>
                    <el-button size="small" type="danger" plain class="fav-remove" @click="removeFavorite(item.id)">
                      取消收藏
                    </el-button>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <div class="sidebar">
        <el-card shadow="never" class="sidebar-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon color="#409eff"><Clock /></el-icon>
              <span>最近动态</span>
            </div>
          </template>
          <div class="activity-list">
            <div v-for="act in recentActivity" :key="act.id" class="activity-item">
              <div class="activity-icon">
                <el-icon><component :is="act.icon" /></el-icon>
              </div>
              <div class="activity-content">
                <p class="activity-text">
                  {{ act.action }} <span class="activity-target">{{ act.target }}</span>
                </p>
                <span class="activity-time">{{ act.time }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="sidebar-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon color="#409eff"><InfoFilled /></el-icon>
              <span>账户信息</span>
            </div>
          </template>
          <div class="account-info">
            <div class="info-row">
              <span class="info-label">加入时间</span>
              <span class="info-value">{{ userInfo.joinDate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">信用等级</span>
              <el-tag type="success" size="small" effect="dark">
                <el-icon><Medal /></el-icon>
                优秀
              </el-tag>
            </div>
            <div class="info-row">
              <span class="info-label">校区</span>
              <span class="info-value">{{ userInfo.campus }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">学院</span>
              <span class="info-value">{{ userInfo.college }}</span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="sidebar-card tips-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon color="#67c23a"><MagicStick /></el-icon>
              <span>使用建议</span>
            </div>
          </template>
          <ul class="tips-list">
            <li>保持信息真实，提高信用分</li>
            <li>及时更新商品状态</li>
            <li>积极互动，建立良好口碑</li>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 20px 0;
}

.profile-container {
  display: flex;
  gap: 24px;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.user-card :deep(.el-card__body) {
  padding: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24px;
  color: #fff;
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  background: #fff;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 26px;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.user-college,
.user-campus {
  font-size: 14px;
  margin: 0 0 6px 0;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.func-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.func-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.func-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.func-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.func-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.func-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.func-desc {
  font-size: 12px;
  color: #909399;
}

.tab-card {
  border-radius: 12px;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-item {
  display: flex;
  gap: 16px;
  padding: 18px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.list-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin: 0;
}

.item-desc {
  font-size: 13px;
  color: #606266;
  margin: 0;
}

.price {
  font-weight: 600;
  color: #f56c6c;
}

.item-time {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.favorite-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.fav-image {
  height: 130px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.fav-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.fav-image:hover img {
  transform: scale(1.05);
}

.fav-type {
  position: absolute;
  top: 8px;
  left: 8px;
}

.fav-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.fav-image:hover .fav-overlay {
  opacity: 1;
}

.fav-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fav-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-title:hover {
  color: #409eff;
}

.fav-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}

.fav-publisher {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
}

.fav-remove {
  width: 100%;
  margin-top: 4px;
}

.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  border-radius: 12px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #303133;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 13px;
  color: #606266;
  margin: 0 0 4px 0;
  line-height: 1.5;
}

.activity-target {
  color: #409eff;
  font-weight: 500;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.info-label {
  color: #909399;
}

.info-value {
  color: #303133;
}

.tips-card {
  background: #f0f9eb;
  border: none;
}

.tips-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.tips-list li {
  margin-bottom: 4px;
}
</style>
