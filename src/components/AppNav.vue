<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页' },
  { path: '/trade', label: '二手交易' },
  { path: '/lost-found', label: '失物招领' },
  { path: '/group-buy', label: '拼单搭子' },
  { path: '/errand', label: '跑腿委托' },
  { path: '/publish', label: '发布' },
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
  gap: var(--space-1);
  align-items: center;
}

.nav-item {
  padding: 6px 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 400;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg);
}

.nav-item.active {
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  font-weight: 500;
}
</style>
