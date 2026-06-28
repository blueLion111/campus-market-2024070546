<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/trade', label: '二手交易' },
  { path: '/lost-found', label: '失物招领' },
  { path: '/group-buy', label: '拼单搭子' },
  { path: '/errand', label: '跑腿委托' },
  { path: '/publish', label: '发布信息' },
  { path: '/message', label: '消息' },
  { path: '/user', label: '个人中心' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="nav-menu">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      :class="['nav-item', { active: isActive(item.path) }]"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.nav-menu {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-item {
  padding: 10px 20px;
  color: #4b5563;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.25s ease;
  position: relative;
  white-space: nowrap;
}

.nav-item:hover {
  color: #409EFF;
  background-color: #ecf5ff;
  transform: translateY(-1px);
}

.nav-item.active {
  color: #fff;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
}

.nav-item.active:hover {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: #fff;
}
</style>
