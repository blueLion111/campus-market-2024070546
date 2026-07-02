<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
})
</script>

<template>
  <div class="loading-state">
    <div class="loading-spinner">
      <el-icon class="spinner-icon"><Loading /></el-icon>
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-text-tertiary);
}

.loading-spinner {
  margin-bottom: 16px;
}

.spinner-icon {
  font-size: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
