<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from './AppNav.vue'

const router = useRouter()
const searchValue = ref('')

const handleSearch = () => {
  if (searchValue.value.trim()) {
    router.push(`/list?keyword=${encodeURIComponent(searchValue.value)}`)
  }
}

const handleProfile = () => {
  router.push('/user')
}

const handleMessage = () => {
  router.push('/message')
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="brand" @click="router.push('/home')">
        <div class="brand-logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#409EFF"/>
            <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="brand-name">校园轻集市</span>
      </div>

      <AppNav />

      <div class="header-right">
        <div class="search-box">
          <el-input
            v-model="searchValue"
            placeholder="搜索商品、失物、拼单..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <span class="search-icon">🔍</span>
            </template>
          </el-input>
        </div>

        <div class="header-actions">
          <div class="action-item message-btn" @click="handleMessage">
            <span class="action-icon">🔔</span>
            <span class="badge">3</span>
          </div>
          <div class="action-item user-avatar" @click="handleProfile">
            <el-avatar :size="40" style="background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);">
              <span class="avatar-text">👤</span>
            </el-avatar>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #f0f2f5;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 48px;
  height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #409EFF;
  white-space: nowrap;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-left: auto;
  flex-shrink: 0;
}

.search-box {
  width: 320px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  background-color: #f5f7fa;
  box-shadow: none;
  padding: 4px 16px;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  background-color: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.search-input :deep(.el-input__inner) {
  font-size: 14px;
}

.search-icon {
  font-size: 16px;
  margin-right: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.action-icon {
  font-size: 22px;
  line-height: 1;
}

.message-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #606266;
}

.message-btn:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #f56c6c;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid #fff;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: visible;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.08);
}

.avatar-text {
  font-size: 20px;
  line-height: 1;
}
</style>
