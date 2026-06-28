<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchKeyword = ref('')
const activeCategory = ref('all')

const categories = [
  { key: 'all', label: '全部', color: '#409EFF' },
  { key: 'secondhand', label: '二手交易', color: '#409EFF' },
  { key: 'lost', label: '失物招领', color: '#E6A23C' },
  { key: 'group', label: '拼单搭子', color: '#67C23A' },
  { key: 'errand', label: '跑腿委托', color: '#F56C6C' },
]

const navItems = [
  { path: '/home', label: '首页' },
  { path: '/list', label: '列表页' },
  { path: '/publish', label: '发布页' },
  { path: '/message', label: '消息页' },
  { path: '/profile', label: '个人中心' },
]

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/list', query: { keyword: searchKeyword.value.trim() } })
  }
}

const handleCategoryChange = (key: string) => {
  activeCategory.value = key
  router.push({ path: '/list', query: key !== 'all' ? { category: key } : {} })
}

const currentPath = computed(() => route.path)
</script>

<template>
  <div class="app-wrapper">
    <!-- 顶部全局导航栏 -->
    <header class="global-header">
      <div class="header-content">
        <!-- Logo + 品牌 -->
        <div class="brand" @click="router.push('/home')">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#409EFF"/>
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="brand-name">校园轻集市</span>
        </div>

        <!-- 全站搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索二手教材、耳机、自行车..."
            clearable
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>

        <!-- 分类筛选Tab -->
        <div class="category-tabs">
          <span
            v-for="cat in categories"
            :key="cat.key"
            :class="['cat-tab', { active: activeCategory === cat.key }]"
            :style="activeCategory === cat.key ? { color: cat.color, borderColor: cat.color } : {}"
            @click="handleCategoryChange(cat.key)"
          >
            {{ cat.label }}
          </span>
        </div>

        <!-- 用户入口 -->
        <div class="user-actions">
          <el-badge :value="3" :max="9" class="badge-item">
            <el-button circle size="large" @click="router.push('/message')">
              <el-icon size="18"><Bell /></el-icon>
            </el-button>
          </el-badge>
          <el-dropdown trigger="click">
            <el-avatar
              :size="36"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
              class="user-avatar"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="router.push('/profile')">我的发布</el-dropdown-item>
                <el-dropdown-item @click="router.push('/profile')">我的收藏</el-dropdown-item>
                <el-dropdown-item divided @click="router.push('/profile')">账号设置</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 导航菜单栏 -->
      <nav class="nav-menu">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: currentPath.startsWith(item.path) }]"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #F5F7FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-wrapper {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.global-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #409EFF;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.category-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cat-tab {
  padding: 6px 14px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.cat-tab:hover {
  background: #ecf5ff;
}

.cat-tab.active {
  font-weight: 500;
  background: #ecf5ff;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  cursor: pointer;
  border: 2px solid #ecf5ff;
  transition: border-color 0.2s;
}

.user-avatar:hover {
  border-color: #409EFF;
}

.nav-menu {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 32px;
  border-top: 1px solid #ebeef5;
}

.nav-item {
  padding: 12px 0;
  color: #606266;
  font-size: 15px;
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #409EFF;
}

.nav-item.active {
  color: #409EFF;
  font-weight: 500;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #409EFF;
  border-radius: 2px 2px 0 0;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
</style>