<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'
import { getFavorites, deleteFavorite, type Favorite } from '@/api/favorite'
import { getOrders, type Order } from '@/api/order'
import { getWallet, getWalletRecords, type Wallet, type WalletRecord } from '@/api/wallet'
import { getPartners, type Partner } from '@/api/partner'
import { getCreditRecords, type CreditRecord } from '@/api/credit'
import { getUserById, type User } from '@/api/user'
import {
  Document, Star, Wallet as WalletIcon, Box, UserFilled, Medal, Setting,
  School, Location, Edit, Plus, InfoFilled, MagicStick,
  ShoppingCart
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const currentUserId = 1
const activeTab = ref('published')
const loading = ref(false)

const userInfo = ref<User | null>(null)
const wallet = ref<Wallet | null>(null)
const myPublished = ref<any[]>([])
const myFavorites = ref<Favorite[]>([])
const myOrders = ref<Order[]>([])
const walletRecords = ref<WalletRecord[]>([])
const myPartners = ref<Partner[]>([])
const creditRecords = ref<CreditRecord[]>([])

const orderFilter = ref('all')

const fetchAllData = async () => {
  loading.value = true
  try {
    const [userRes, tradesRes, lostFoundsRes, groupBuysRes, errandsRes, favRes, orderRes, walletRes, walletRecRes, partnerRes, creditRes] = await Promise.all([
      getUserById(currentUserId).catch(() => ({ data: null })),
      getTrades().catch(() => ({ data: [] })),
      getLostFounds().catch(() => ({ data: [] })),
      getGroupBuys().catch(() => ({ data: [] })),
      getErrands().catch(() => ({ data: [] })),
      getFavorites({ userId: currentUserId }).catch(() => ({ data: [] })),
      getOrders({ userId: currentUserId }).catch(() => ({ data: [] })),
      getWallet(currentUserId).catch(() => ({ data: [] })),
      getWalletRecords({ userId: currentUserId }).catch(() => ({ data: [] })),
      getPartners({ userId: currentUserId }).catch(() => ({ data: [] })),
      getCreditRecords({ userId: currentUserId }).catch(() => ({ data: [] })),
    ])

    userInfo.value = userRes.data

    const trades = (tradesRes as any).data || []
    const lostFounds = (lostFoundsRes as any).data || []
    const groupBuys = (groupBuysRes as any).data || []
    const errands = (errandsRes as any).data || []

    const tradeItems = trades.map((t: any) => ({
      id: t.id, rawType: 'trade', title: t.title, type: '二手交易',
      typeColor: '#409eff', price: t.price,
      status: t.status === 'open' ? 'active' : 'completed',
      statusText: t.status === 'open' ? '进行中' : '已完成',
      image: t.image, createdAt: t.publishTime?.split(' ')[0] || '',
    }))

    const lostFoundItems = lostFounds.map((t: any) => ({
      id: t.id, rawType: 'lostFound', title: t.title, type: '失物招领',
      typeColor: '#e6a23c', price: null,
      status: t.status === 'open' ? 'active' : 'completed',
      statusText: t.status === 'open' ? '进行中' : '已结束',
      image: t.image, createdAt: t.time?.split(' ')[0] || '',
    }))

    const groupBuyItems = groupBuys.map((t: any) => ({
      id: t.id, rawType: 'groupBuy', title: t.title, type: '拼单搭子',
      typeColor: '#67c23a', price: null,
      status: t.status === 'open' ? 'active' : 'completed',
      statusText: t.status === 'open' ? '进行中' : '已结束',
      image: t.image, createdAt: t.publishTime?.split(' ')[0] || '',
    }))

    const errandItems = errands.map((t: any) => ({
      id: t.id, rawType: 'errand', title: t.title, type: '跑腿委托',
      typeColor: '#f56c6c', price: t.reward,
      status: t.status === 'open' || t.status === 'accepted' ? 'active' : 'completed',
      statusText: t.status === 'done' ? '已完成' : t.status === 'accepted' ? '进行中' : '进行中',
      image: t.image, createdAt: t.publishTime?.split(' ')[0] || '',
    }))

    myPublished.value = [...tradeItems, ...lostFoundItems, ...groupBuyItems, ...errandItems]
    myFavorites.value = (favRes as any).data || []
    myOrders.value = (orderRes as any).data || []
    const walletList = (walletRes as any).data || []
    wallet.value = walletList[0] || null
    walletRecords.value = (walletRecRes as any).data || []
    myPartners.value = (partnerRes as any).data || []
    creditRecords.value = (creditRes as any).data || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const tab = route.query.tab as string
  if (tab) activeTab.value = tab
  fetchAllData()
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) activeTab.value = newTab as string
})

const goToDetail = (item: any) => {
  router.push({ path: `/detail/${item.id}`, query: { type: item.rawType || item.itemType } })
}

const updateStatus = (item: any) => {
  item.status = item.status === 'active' ? 'completed' : 'active'
  item.statusText = item.status === 'active' ? '进行中' : '已完成'
}

const removeFavorite = async (id: number) => {
  try {
    await deleteFavorite(id)
    myFavorites.value = myFavorites.value.filter(f => f.id !== id)
  } catch (e) {
    console.error('取消收藏失败:', e)
  }
}

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return myOrders.value
  return myOrders.value.filter(o => o.type === orderFilter.value)
})

const statCards = computed(() => [
  { label: '发布', value: myPublished.value.length, icon: Document, color: '#409eff', tab: 'published' },
  { label: '收藏', value: myFavorites.value.length, icon: Star, color: '#f56c6c', tab: 'favorites' },
  { label: '订单', value: myOrders.value.length, icon: Box, color: '#67c23a', tab: 'orders' },
  { label: '搭子', value: myPartners.value.length, icon: UserFilled, color: '#e6a23c', tab: 'partners' },
])

const switchTab = (tab: string) => {
  activeTab.value = tab
  router.push({ path: '/profile', query: { tab } })
}

const creditLevel = computed(() => {
  const score = userInfo.value?.creditScore ?? 0
  if (score >= 95) return { text: '优秀', color: '#67c23a' }
  if (score >= 80) return { text: '良好', color: '#409eff' }
  if (score >= 60) return { text: '一般', color: '#e6a23c' }
  return { text: '较差', color: '#f56c6c' }
})

const avatarUrlInput = ref('')

const handleAvatarUpload = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) {
    ElMessage.warning('请输入头像地址')
    return
  }
  if (!/^https?:\/\//.test(trimmed)) {
    ElMessage.warning('请输入有效的图片 URL（以 http:// 或 https:// 开头）')
    return
  }
  if (userInfo.value) {
    userInfo.value.avatar = trimmed
    ElMessage.success('头像已更新')
  }
}
</script>

<template>
  <div class="profile-page">
    <h2 class="page-title">个人中心</h2>

    <div class="profile-container">
      <div class="main-content">
        <el-card shadow="never" class="user-card" v-if="userInfo">
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
                {{ userInfo.campus }} · {{ userInfo.grade }}
              </p>
              <div class="user-stats">
                <div class="stat" v-for="s in statCards" :key="s.label" @click="switchTab(s.tab)" style="cursor:pointer">
                  <span class="stat-value">{{ s.value }}</span>
                  <span class="stat-label">{{ s.label }}</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <el-button type="primary" plain @click="switchTab('settings')">
                <el-icon><Edit /></el-icon>
                编辑资料
              </el-button>
              <el-button plain @click="switchTab('settings')">
                <el-icon><Setting /></el-icon>
                设置
              </el-button>
            </div>
          </div>
        </el-card>

        <div class="function-grid">
          <el-card shadow="never" class="func-card" @click="switchTab('published')">
            <div class="func-icon">
              <el-icon :size="24"><Document /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的发布</span>
              <span class="func-desc">管理你发布的信息</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('favorites')">
            <div class="func-icon">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的收藏</span>
              <span class="func-desc">查看收藏的信息</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('orders')">
            <div class="func-icon">
              <el-icon :size="24"><ShoppingCart /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的订单</span>
              <span class="func-desc">查看交易记录</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('wallet')">
            <div class="func-icon">
              <el-icon :size="24"><WalletIcon /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的钱包</span>
              <span class="func-desc">余额和交易记录</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('partners')">
            <div class="func-icon">
              <el-icon :size="24"><UserFilled /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">我的搭子</span>
              <span class="func-desc">一起拼单的小伙伴</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('credit')">
            <div class="func-icon">
              <el-icon :size="24"><Medal /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">信用分</span>
              <span class="func-desc">查看信用等级详情</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="router.push('/publish')">
            <div class="func-icon">
              <el-icon :size="24"><Plus /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">发布新信息</span>
              <span class="func-desc">快速发布校园信息</span>
            </div>
          </el-card>

          <el-card shadow="never" class="func-card" @click="switchTab('settings')">
            <div class="func-icon">
              <el-icon :size="24"><Setting /></el-icon>
            </div>
            <div class="func-info">
              <span class="func-title">账号设置</span>
              <span class="func-desc">个人资料和隐私</span>
            </div>
          </el-card>
        </div>

        <el-card shadow="never" class="tab-card">
          <el-tabs v-model="activeTab" @tab-change="(t: string) => switchTab(t)">
            <el-tab-pane label="我的发布" name="published">
              <div v-loading="loading" class="list-content">
                <div
                  v-for="item in myPublished"
                  :key="item.id"
                  class="list-item"
                  @click="goToDetail(item)"
                >
                  <el-image :src="item.image" class="item-image" fit="cover" />
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
                      <el-button size="small" type="danger" plain @click.stop="goToDetail(item)">
                        查看详情
                      </el-button>
                    </div>
                  </div>
                </div>
                <el-empty v-if="myPublished.length === 0" description="暂无发布内容" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="我的收藏" name="favorites">
              <div v-loading="loading" class="favorite-grid">
                <div
                  v-for="item in myFavorites"
                  :key="item.id"
                  class="favorite-card"
                >
                  <div class="fav-image" @click="goToDetail(item)">
                    <img :src="item.image" :alt="item.title" />
                    <el-tag class="fav-type" effect="dark" size="small" :color="item.itemType === 'trade' ? '#409eff' : item.itemType === 'lostFound' ? '#e6a23c' : item.itemType === 'groupBuy' ? '#67c23a' : '#f56c6c'">
                      {{ item.itemType === 'trade' ? '二手' : item.itemType === 'lostFound' ? '失物' : item.itemType === 'groupBuy' ? '拼单' : '跑腿' }}
                    </el-tag>
                  </div>
                  <div class="fav-info">
                    <h4 class="fav-title" @click="goToDetail(item)">{{ item.title }}</h4>
                    <div class="fav-meta">
                      <span class="fav-price" v-if="item.price">¥{{ item.price }}</span>
                      <span class="fav-publisher">{{ item.publisher }}</span>
                    </div>
                    <el-button class="fav-remove" size="small" type="danger" plain @click="removeFavorite(item.id)">
                      取消收藏
                    </el-button>
                  </div>
                </div>
                <el-empty v-if="myFavorites.length === 0" description="暂无收藏内容" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="我的订单" name="orders">
              <div v-loading="loading">
                <el-radio-group v-model="orderFilter" size="small" style="margin-bottom: 16px">
                  <el-radio-button value="all">全部</el-radio-button>
                  <el-radio-button value="buy">我买到的</el-radio-button>
                  <el-radio-button value="sell">我卖出的</el-radio-button>
                  <el-radio-button value="join">我参与的</el-radio-button>
                </el-radio-group>
                <div class="list-content">
                  <div
                    v-for="order in filteredOrders"
                    :key="order.id"
                    class="list-item"
                    @click="goToDetail(order)"
                  >
                    <el-image :src="order.image" class="item-image" fit="cover" />
                    <div class="item-info">
                      <div class="item-header">
                        <el-tag type="info" size="small">{{ order.typeName }}</el-tag>
                        <h3 class="item-title">{{ order.title }}</h3>
                        <el-tag :type="order.status === 'completed' ? 'success' : order.status === 'active' ? 'warning' : 'info'" size="small" effect="plain" style="margin-left: auto">
                          {{ order.statusText }}
                        </el-tag>
                      </div>
                      <p class="item-desc">订单号：{{ order.orderNo }}</p>
                      <p class="item-desc" v-if="order.price">金额：<span class="price">¥{{ order.price }}</span></p>
                      <p class="item-time">{{ order.createTime }}</p>
                    </div>
                  </div>
                  <el-empty v-if="filteredOrders.length === 0" description="暂无订单记录" />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="我的钱包" name="wallet">
              <div v-loading="loading">
                <el-card shadow="never" class="wallet-card">
                  <div class="wallet-balance">
                    <div class="balance-label">账户余额（元）</div>
                    <div class="balance-amount">{{ wallet?.balance?.toFixed(2) || '0.00' }}</div>
                  </div>
                  <div class="wallet-stats">
                    <div class="wallet-stat">
                      <span class="ws-label">总收入</span>
                      <span class="ws-value income">¥{{ wallet?.totalIncome?.toFixed(2) || '0.00' }}</span>
                    </div>
                    <div class="wallet-stat">
                      <span class="ws-label">总支出</span>
                      <span class="ws-value expense">¥{{ wallet?.totalExpense?.toFixed(2) || '0.00' }}</span>
                    </div>
                    <div class="wallet-stat">
                      <span class="ws-label">冻结金额</span>
                      <span class="ws-value">¥{{ wallet?.frozenAmount?.toFixed(2) || '0.00' }}</span>
                    </div>
                  </div>
                  <div class="wallet-actions">
                    <el-button type="primary">充值</el-button>
                    <el-button plain>提现</el-button>
                  </div>
                </el-card>

                <h3 class="section-subtitle">交易记录</h3>
                <div class="list-content">
                  <div
                    v-for="record in walletRecords"
                    :key="record.id"
                    class="wallet-record-item"
                  >
                    <div class="wr-icon" :class="record.type">
                      {{ record.type === 'income' ? '+' : record.type === 'recharge' ? '+' : '-' }}
                    </div>
                    <div class="wr-info">
                      <span class="wr-title">{{ record.title }}</span>
                      <span class="wr-time">{{ record.createTime }}</span>
                    </div>
                    <div class="wr-amount" :class="{ income: record.type === 'income' || record.type === 'recharge' }">
                      {{ record.type === 'income' || record.type === 'recharge' ? '+' : '-' }}¥{{ record.amount.toFixed(2) }}
                    </div>
                  </div>
                  <el-empty v-if="walletRecords.length === 0" description="暂无交易记录" />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="我的搭子" name="partners">
              <div v-loading="loading" class="list-content">
                <div
                  v-for="partner in myPartners"
                  :key="partner.id"
                  class="partner-item"
                >
                  <el-avatar :size="56" :src="partner.partnerAvatar" />
                  <div class="partner-info">
                    <div class="partner-header">
                      <h4 class="partner-name">{{ partner.partnerName }}</h4>
                      <el-tag :type="partner.status === 'active' ? 'success' : 'info'" size="small" effect="plain">
                        {{ partner.statusText }}
                      </el-tag>
                    </div>
                    <p class="partner-type">{{ partner.typeName }} · {{ partner.itemTitle }}</p>
                    <p class="partner-meta">一起参与 {{ partner.joinCount }} 次 · {{ partner.createTime }}</p>
                  </div>
                  <div class="partner-actions">
                    <el-button size="small" type="primary" plain>查看详情</el-button>
                  </div>
                </div>
                <el-empty v-if="myPartners.length === 0" description="暂无搭子记录" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="信用分" name="credit">
              <div v-loading="loading">
                <el-card shadow="never" class="credit-card">
                  <div class="credit-header">
                    <div class="credit-score-box">
                      <div class="cs-value">{{ userInfo?.creditScore ?? 0 }}</div>
                      <div class="cs-label">当前信用分</div>
                    </div>
                    <div class="credit-level">
                      <el-tag :color="creditLevel.color" effect="dark" size="large">
                        <el-icon><Medal /></el-icon>
                        {{ creditLevel.text }}
                      </el-tag>
                      <p class="credit-tip">信用分越高，权益越多</p>
                    </div>
                  </div>
                </el-card>

                <h3 class="section-subtitle">信用分变动记录</h3>
                <div class="list-content">
                  <div
                    v-for="record in creditRecords"
                    :key="record.id"
                    class="credit-record-item"
                  >
                    <div class="cr-icon plus">
                      +
                    </div>
                    <div class="cr-info">
                      <span class="cr-reason">{{ record.reason }}</span>
                      <span class="cr-time">{{ record.createTime }}</span>
                    </div>
                    <div class="cr-change plus">
                      +{{ record.change }}
                    </div>
                  </div>
                  <el-empty v-if="creditRecords.length === 0" description="暂无信用记录" />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="账号设置" name="settings">
              <div v-loading="loading" v-if="userInfo" class="settings-content">
                <el-form label-width="100px" class="settings-form">
                  <el-form-item label="头像">
                    <el-avatar :size="64" :src="userInfo.avatar" />
                    <div class="avatar-upload-row">
                      <el-input
                        v-model="avatarUrlInput"
                        placeholder="输入头像图片 URL"
                        size="default"
                        @keyup.enter="handleAvatarUpload(avatarUrlInput)"
                      />
                      <el-button type="primary" @click="handleAvatarUpload(avatarUrlInput)">更换</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="昵称">
                    <el-input v-model="userInfo.nickname" style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="学号">
                    <el-input v-model="userInfo.studentId" disabled style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="学院">
                    <el-input v-model="userInfo.college" disabled style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="专业">
                    <el-input v-model="userInfo.major" disabled style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="年级">
                    <el-input v-model="userInfo.grade" disabled style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="校区">
                    <el-input v-model="userInfo.campus" disabled style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="userInfo.phone" style="width: 300px" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="userInfo.email" style="width: 300px" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">保存修改</el-button>
                    <el-button>取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <div class="sidebar">
        <el-card shadow="never" class="sidebar-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon class="sidebar-icon"><InfoFilled /></el-icon>
              <span>账户信息</span>
            </div>
          </template>
          <div class="account-info" v-if="userInfo">
            <div class="info-row">
              <span class="info-label">加入时间</span>
              <span class="info-value">{{ userInfo.joinDate }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">信用等级</span>
              <el-tag :color="creditLevel.color" size="small" effect="dark">
                <el-icon><Medal /></el-icon>
                {{ creditLevel.text }}
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
            <div class="info-row">
              <span class="info-label">钱包余额</span>
              <span class="info-value wallet-balance-text">¥{{ wallet?.balance?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="sidebar-card tips-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon class="sidebar-icon"><MagicStick /></el-icon>
              <span>使用建议</span>
            </div>
          </template>
          <ul class="tips-list">
            <li>保持信息真实，提高信用分</li>
            <li>及时更新商品状态</li>
            <li>积极互动，建立良好口碑</li>
            <li>线下交易注意安全</li>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.page-title {
  font-size: 20px;
  font-weight: 500;
  color: #1A1A1A;
  margin: 0 0 24px 0;
  letter-spacing: 0.5px;
}

.profile-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #BFBFBF;
}

.user-card :deep(.el-card__body) {
  padding: 28px 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24px;
  color: #1A1A1A;
}

.user-avatar {
  border: 1px solid #BFBFBF;
  background: #f5f5f5;
  border-radius: 4px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 22px;
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #1A1A1A;
  letter-spacing: 0.5px;
}

.user-college,
.user-campus {
  font-size: 13px;
  margin: 0 0 6px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #BFBFBF;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.stat:hover {
  opacity: 0.7;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #1A1A1A;
}

.stat-label {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.5px;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.func-card {
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  border: 1px solid #BFBFBF;
}

.func-card:hover {
  border-color: #1A1A1A;
  background: #fafafa;
}

.func-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}

.func-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #BFBFBF;
}

.func-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.func-title {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.func-desc {
  font-size: 12px;
  color: #999;
}

.tab-card {
  border-radius: 6px;
  border: 1px solid #BFBFBF;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  background: #fff;
}

.list-item:hover {
  border-color: #1A1A1A;
  background: #fafafa;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.price {
  font-weight: 600;
  color: #1A1A1A;
}

.item-time {
  font-size: 12px;
  color: #999;
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
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.15s ease;
  background: #fff;
}

.favorite-card:hover {
  border-color: #1A1A1A;
}

.fav-image {
  height: 130px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
}

.fav-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fav-type {
  position: absolute;
  top: 8px;
  left: 8px;
}

.fav-info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fav-title {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  margin: 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}

.fav-title:hover {
  opacity: 0.7;
}

.fav-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-price {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.fav-publisher {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
}

.fav-remove {
  width: 100%;
  margin-top: 4px;
}

.wallet-card {
  background: #ffffff;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  color: #1A1A1A;
  margin-bottom: 20px;
}

.wallet-card :deep(.el-card__body) {
  padding: 28px 32px;
}

.wallet-balance {
  text-align: center;
  margin-bottom: 24px;
}

.balance-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.balance-amount {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #1A1A1A;
}

.wallet-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid #BFBFBF;
}

.wallet-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.ws-label {
  font-size: 12px;
  color: #999;
}

.ws-value {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.ws-value.income {
  color: #1A1A1A;
}

.ws-value.expense {
  color: #666;
}

.wallet-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.wallet-record-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  background: #fff;
}

.wr-icon {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #BFBFBF;
}

.wr-icon.income,
.wr-icon.recharge {
  background: #f5f5f5;
  color: #1A1A1A;
}

.wr-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.wr-title {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
}

.wr-time {
  font-size: 12px;
  color: #999;
}

.wr-amount {
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

.wr-amount.income {
  color: #1A1A1A;
}

.partner-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  background: #fff;
}

.partner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.partner-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.partner-name {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
  margin: 0;
}

.partner-type {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.partner-meta {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.credit-card {
  background: #ffffff;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  color: #1A1A1A;
  margin-bottom: 20px;
}

.credit-card :deep(.el-card__body) {
  padding: 28px 32px;
}

.credit-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.credit-score-box {
  text-align: center;
}

.cs-value {
  font-size: 48px;
  font-weight: 600;
  line-height: 1;
  color: #1A1A1A;
}

.cs-label {
  font-size: 13px;
  color: #999;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.credit-level {
  text-align: center;
}

.credit-tip {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.credit-record-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid #BFBFBF;
  border-radius: 6px;
  background: #fff;
}

.cr-icon {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  background: #f5f5f5;
  color: #1A1A1A;
  border: 1px solid #BFBFBF;
}

.cr-icon.plus {
  background: #f5f5f5;
  color: #1A1A1A;
}

.cr-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.cr-reason {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
}

.cr-time {
  font-size: 12px;
  color: #999;
}

.cr-change {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.cr-change.plus {
  color: #1A1A1A;
}

.settings-content {
  padding: 20px 0;
}

.settings-form {
  max-width: 500px;
}

.avatar-upload-row {
  display: flex;
  gap: 8px;
  margin-left: 16px;
  flex: 1;
  max-width: 360px;
}

.section-subtitle {
  font-size: 15px;
  color: #1A1A1A;
  margin: 0 0 16px 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.sidebar-card {
  border-radius: 6px;
  border: 1px solid #BFBFBF;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #1A1A1A;
  font-size: 14px;
}

.sidebar-icon {
  color: #666;
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
  color: #999;
}

.info-value {
  color: #1A1A1A;
}

.wallet-balance-text {
  color: #1A1A1A;
  font-weight: 600;
}

.tips-card {
  background: #ffffff;
  border: 1px solid #BFBFBF;
}

.tips-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.tips-list li {
  margin-bottom: 4px;
}
</style>
