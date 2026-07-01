<script setup lang="ts">
import { ref, provide, nextTick, onMounted } from 'vue'
import AppLayout from './components/AppLayout.vue'
import { useUserStore } from './stores/user'
import { useFavoriteStore } from './stores/favorite'
import { getUserById } from './api/user'
import { getFavorites } from './api/favorite'

const isRouterAlive = ref(true)
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}

provide('reload', reload)

onMounted(async () => {
  try {
    const res = await getUserById(1)
    if (res.data) {
      userStore.login(res.data)
    }
  } catch {
    console.warn('加载当前用户失败，使用默认模拟用户')
  }

  try {
    const favRes = await getFavorites({ userId: 1 })
    if (favRes.data && favRes.data.length > 0) {
      favoriteStore.initFromBackend(favRes.data)
    }
  } catch {
    console.warn('加载收藏数据失败，使用空收藏列表')
  }
})
</script>

<template>
  <AppLayout>
    <router-view v-if="isRouterAlive" />
  </AppLayout>
</template>

<style>
:root {
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E5E5E5;
  --color-border-light: #F0F0F0;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-muted: #BFBFBF;
  --color-accent: #1A1A1A;
  --color-accent-hover: #333333;
  --color-danger: #E5484D;
  --color-success: #30D158;
  --color-warning: #FF9F0A;

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;

  --transition-fast: 120ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

  --container-width: 1400px;
  --header-height: 56px;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

p {
  margin: 0;
}

a {
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-text-secondary);
}

button {
  font-family: inherit;
}

img {
  max-width: 100%;
  display: block;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

.el-button--primary {
  --el-button-bg-color: var(--color-accent) !important;
  --el-button-border-color: var(--color-accent) !important;
  --el-button-hover-bg-color: var(--color-accent-hover) !important;
  --el-button-hover-border-color: var(--color-accent-hover) !important;
  --el-button-active-bg-color: #000 !important;
  --el-button-active-border-color: #000 !important;
}

.el-button--primary.is-plain {
  --el-button-bg-color: transparent !important;
  --el-button-text-color: var(--color-accent) !important;
  --el-button-border-color: var(--color-accent) !important;
  --el-button-hover-bg-color: var(--color-accent) !important;
  --el-button-hover-text-color: #fff !important;
}

.el-input__wrapper {
  border-radius: var(--radius-md) !important;
  box-shadow: 0 0 0 1px var(--color-border) inset !important;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--color-text-tertiary) inset !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--color-accent) inset !important;
}

.el-card {
  border-radius: var(--radius-md) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-none) !important;
}

.el-pagination button {
  border-radius: var(--radius-md) !important;
}

.el-pagination .el-pager li {
  border-radius: var(--radius-md) !important;
}

.el-avatar {
  border-radius: var(--radius-md) !important;
}

.el-tag {
  border-radius: var(--radius-sm) !important;
}
</style>
