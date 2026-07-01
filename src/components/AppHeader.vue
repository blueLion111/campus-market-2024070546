<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell } from '@element-plus/icons-vue'
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const searchValue = ref('')

const unreadCount = computed(() => 3)

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
        <span class="brand-name">校园轻集市</span>
      </div>

      <AppNav />

      <div class="header-right">
        <div class="search-box">
          <el-input
            v-model="searchValue"
            placeholder="搜索..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="header-actions">
          <div class="action-item message-btn" @click="handleMessage">
            <el-icon class="action-icon"><Bell /></el-icon>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </div>
          <div class="user-avatar" @click="handleProfile">
            <div class="avatar-circle">
              <span class="avatar-text">{{ userStore.nickname.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-8);
  height: var(--header-height);
}

.brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-left: auto;
  flex-shrink: 0;
}

.search-box {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  padding: 0 var(--space-3);
  transition: all var(--transition-fast);
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-text-tertiary) inset;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  background-color: var(--color-surface);
  box-shadow: 0 0 0 1px var(--color-accent) inset;
}

.search-input :deep(.el-input__inner) {
  font-size: 13px;
  height: 32px;
}

.search-icon {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.action-item:hover {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

.action-icon {
  font-size: 18px;
  line-height: 1;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: var(--color-danger);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid var(--color-surface);
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.user-avatar:hover {
  background-color: var(--color-bg);
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--color-text-primary);
}

.avatar-text {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  line-height: 1;
}
</style>
