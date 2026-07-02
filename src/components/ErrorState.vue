<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'

interface Props {
  title?: string
  description?: string
  retryText?: string
}

const emit = defineEmits<{
  (e: 'retry'): void
}>()

withDefaults(defineProps<Props>(), {
  title: '加载失败',
  description: '网络异常或服务器未启动，请检查后重试',
  retryText: '重新加载',
})

const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <div class="error-state">
    <div class="error-icon">
      <el-icon :size="40"><Warning /></el-icon>
    </div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-desc">{{ description }}</p>
    <el-button v-if="retryText" type="primary" @click="handleRetry">
      {{ retryText }}
    </el-button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  margin-bottom: 16px;
  color: var(--color-text-tertiary);
}

.error-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.error-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0 0 24px 0;
  max-width: 360px;
  line-height: 1.6;
}
</style>
