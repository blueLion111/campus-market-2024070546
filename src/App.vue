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

  // 从后端同步收藏数据到 Pinia Store，确保各页面数据一致
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
</style>