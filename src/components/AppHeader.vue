<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppNav from './AppNav.vue'

const router = useRouter()
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="brand" @click="router.push('/')">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#409EFF"/>
          <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="brand-name">校园轻集市</span>
      </div>
      <AppNav />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 48px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #409EFF;
  white-space: nowrap;
  letter-spacing: -0.5px;
}
</style>
