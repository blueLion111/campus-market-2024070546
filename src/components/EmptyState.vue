<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂无数据',
  description: '快来发布第一条信息吧~',
})
</script>

<template>
  <div class="empty-state">
    <el-icon class="empty-icon"><Document /></el-icon>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-9) var(--space-5);
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  width: 40px;
  height: 40px;
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
}

.empty-title {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2) 0;
  font-weight: 500;
}

.empty-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
}
</style>
