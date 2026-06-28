<script setup lang="ts">
import { computed } from 'vue'
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
  gap: 32px;
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
</style>
