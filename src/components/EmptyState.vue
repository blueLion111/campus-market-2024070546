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
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
  color: #c0c4cc;
}

.empty-title {
  font-size: 18px;
  color: #606266;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.empty-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}
</style>
