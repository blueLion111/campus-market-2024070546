<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 真实可靠的图片URL - 使用 picsum.photos 和可靠的校园场景图片
const posts = ref([
  {
    id: 1,
    type: 'secondhand',
    typeName: '二手交易',
    typeColor: '#409EFF',
    title: '高等数学同济第七版 教材全新未使用',
    price: 25,
    campus: '狮子山校区',
    location: '图书馆门口',
    image: 'https://picsum.photos/seed/book1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    publisher: '张同学',
    time: '2小时前',
    favoriteCount: 12,
    isFavorite: false,
  },
  {
    id: 2,
    type: 'lost',
    typeName: '失物招领',
    typeColor: '#E6A23C',
    title: '捡到一张校园卡 请失主联系',
    price: null,
    campus: '成龙校区',
    location: '食堂一楼',
    image: 'https://picsum.photos/seed/card1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    publisher: '李同学',
    time: '3小时前',
    favoriteCount: 8,
    isFavorite: false,
  },
  {
    id: 3,
    type: 'group',
    typeName: '拼单搭子',
    typeColor: '#67C23A',
    title: '奶茶拼单 还差2人 露露奶茶店',
    price: null,
    campus: '狮子山校区',
    location: '校门口奶茶店',
    image: 'https://picsum.photos/seed/drink1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    publisher: '王同学',
    time: '1小时前',
    favoriteCount: 5,
    isFavorite: true,
  },
  {
    id: 4,
    type: 'errand',
    typeName: '跑腿委托',
    typeColor: '#F56C6C',
    title: '代取快递 酬劳10元 西门快递点',
    price: 10,
    campus: '成龙校区',
    location: '西门快递柜',
    image: 'https://picsum.photos/seed/package1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    publisher: '陈同学',
    time: '30分钟前',
    favoriteCount: 3,
    isFavorite: false,
  },
  {
    id: 5,
    type: 'secondhand',
    typeName: '二手交易',
    typeColor: '#409EFF',
    title: '蓝牙耳机 漫步者 半价出售',
    price: 89,
    campus: '狮子山校区',
    location: '宿舍楼下',
    image: 'https://picsum.photos/seed/headphone1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    publisher: '刘同学',
    time: '5小时前',
    favoriteCount: 18,
    isFavorite: false,
  },
  {
    id: 6,
    type: 'lost',
    typeName: '失物招领',
    typeColor: '#E6A23C',
    title: '丢失钥匙 银色小钥匙扣',
    price: null,
    campus: '成龙校区',
    location: '教学楼B区',
    image: 'https://picsum.photos/seed/key1/400/300',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
    publisher: '赵同学',
    time: '昨天',
    favoriteCount: 6,
    isFavorite: false,
  },
])

const notices = ref([
  { id: 1, title: '关于校园集市交易安全的温馨提示', time: '今天' },
  { id: 2, title: '本周失物招领统计：已找回15件物品', time: '昨天' },
  { id: 3, title: '拼单搭子活动火热进行中', time: '本周' },
])

const hotPosts = ref([
  { id: 1, title: '全新iPad 低价转让', views: 256 },
  { id: 2, title: '英语四级资料打包出售', views: 189 },
  { id: 3, title: '代取快递长期接单', views: 142 },
])

const currentPage = ref(1)
const pageSize = ref(6)

const toggleFavorite = (post: any) => {
  post.isFavorite = !post.isFavorite
  post.favoriteCount += post.isFavorite ? 1 : -1
}

const goToDetail = (id: number) => {
  router.push(`/detail/${id}`)
}

const formatPrice = (price: number | null) => {
  return price ? `¥${price}` : '面议'
}
</script>

<template>
  <div class="home-page">
    <!-- 左侧信息流卡片 -->
    <div class="main-content">
      <div class="section-header">
        <h2>今日集市</h2>
        <span class="subtitle">最新发布的校园信息</span>
        <el-button type="primary" size="small" link @click="router.push('/list')">
          查看更多
        </el-button>
      </div>

      <div class="card-grid">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="goToDetail(post.id)"
        >
          <!-- 业务类型标签 -->
          <div class="type-tag" :style="{ backgroundColor: post.typeColor }">
            {{ post.typeName }}
          </div>

          <!-- 商品图片 -->
          <div class="card-image">
            <img :src="post.image" :alt="post.title" loading="lazy" />
          </div>

          <!-- 卡片内容 -->
          <div class="card-body">
            <h3 class="card-title">{{ post.title }}</h3>

            <div class="card-meta">
              <span class="price" v-if="post.price">{{ formatPrice(post.price) }}</span>
              <span class="price free" v-else>免费</span>
              <span class="location">
                <el-icon size="12"><Location /></el-icon>
                {{ post.campus }}
              </span>
            </div>

            <div class="card-footer">
              <div class="publisher">
                <el-avatar :size="24" :src="post.avatar" />
                <span class="publisher-name">{{ post.publisher }}</span>
              </div>

              <div class="actions">
                <span class="favorite-count" :class="{ active: post.isFavorite }">
                  <el-icon size="14">
                    <Star v-if="post.isFavorite" />
                    <Star v-else />
                  </el-icon>
                  {{ post.favoriteCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="20"
          layout="prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- 右侧侧边栏 -->
    <aside class="sidebar">
      <!-- 校园公告 -->
      <div class="sidebar-card notice-card">
        <div class="card-header">
          <el-icon color="#409EFF"><Bell /></el-icon>
          <span>校园公告</span>
        </div>
        <div class="notice-list">
          <div v-for="notice in notices" :key="notice.id" class="notice-item">
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-time">{{ notice.time }}</span>
          </div>
        </div>
      </div>

      <!-- 热门推荐 -->
      <div class="sidebar-card hot-card">
        <div class="card-header">
          <el-icon color="#F56C6C"><TrendCharts /></el-icon>
          <span>热门推荐</span>
        </div>
        <div class="hot-list">
          <div v-for="(hot, index) in hotPosts" :key="hot.id" class="hot-item">
            <span class="hot-index" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="hot-title">{{ hot.title }}</span>
            <span class="hot-views">{{ hot.views }}浏览</span>
          </div>
        </div>
      </div>

      <!-- 快速发布入口 -->
      <div class="sidebar-card quick-publish">
        <div class="publish-header">
          <el-icon color="#fff"><Plus /></el-icon>
          <span>快速发布</span>
        </div>
        <el-button type="primary" size="large" class="publish-btn" @click="router.push('/publish')">
          发布信息
        </el-button>
        <div class="publish-types">
          <el-tag :color="'#409EFF'" effect="dark" size="small" @click="router.push('/publish')">
            二手交易
          </el-tag>
          <el-tag :color="'#E6A23C'" effect="dark" size="small" @click="router.push('/publish')">
            失物招领
          </el-tag>
          <el-tag :color="'#67C23A'" effect="dark" size="small" @click="router.push('/publish')">
            拼单搭子
          </el-tag>
          <el-tag :color="'#F56C6C'" effect="dark" size="small" @click="router.push('/publish')">
            跑腿委托
          </el-tag>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="sidebar-card safety-card">
        <div class="card-header">
          <el-icon color="#E6A23C"><Warning /></el-icon>
          <span>交易安全提示</span>
        </div>
        <ul class="safety-tips">
          <li>选择公共安全场所交易</li>
          <li>贵重物品当面验真</li>
          <li>保护个人隐私信息</li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  gap: 24px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  flex: 1;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
}

.type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.card-image {
  height: 180px;
  overflow: hidden;
  background: #f0f2f5;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .card-image img {
  transform: scale(1.05);
}

.card-body {
  padding: 14px;
}

.card-title {
  font-size: 15px;
  color: #303133;
  margin: 0 0 10px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #F56C6C;
}

.price.free {
  font-size: 14px;
  color: #67C23A;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f5f7fa;
}

.publisher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publisher-name {
  font-size: 12px;
  color: #606266;
}

.favorite-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #c0c4cc;
}

.favorite-count.active {
  color: #F56C6C;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 侧边栏 */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
  font-size: 15px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 13px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f5f7fa;
}

.notice-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.notice-title {
  color: #606266;
  flex: 1;
  line-height: 1.5;
}

.notice-time {
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 8px;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.hot-index {
  width: 22px;
  height: 22px;
  background: #e6e8eb;
  color: #909399;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.hot-index.top {
  background: #409EFF;
  color: #fff;
}

.hot-title {
  flex: 1;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-views {
  color: #c0c4cc;
  font-size: 12px;
  flex-shrink: 0;
}

.quick-publish {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
}

.publish-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 14px;
}

.publish-btn {
  width: 100%;
  background: #fff;
  color: #409EFF;
  border: none;
  font-weight: 600;
  margin-bottom: 12px;
}

.publish-btn:hover {
  background: #f0f7ff;
}

.publish-types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.safety-card {
  border: 1px solid #fdf6ec;
  background: #fdf6ec;
}

.safety-tips {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #865a21;
  line-height: 1.8;
}

.safety-tips li {
  margin-bottom: 4px;
}
</style>