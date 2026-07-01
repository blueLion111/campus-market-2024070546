<script setup lang="ts">
import { Location } from '@element-plus/icons-vue'

interface Props {
  title: string
  image: string
  price?: number
  location?: string
  publisher?: string
  publisherAvatar?: string
  tagText?: string
  tagColor?: string
}

defineProps<Props>()
</script>

<template>
  <div class="item-card">
    <div v-if="tagText" class="item-tag" :style="{ backgroundColor: tagColor }">
      {{ tagText }}
    </div>
    <slot name="action" class="item-action-slot"></slot>
    <div class="item-image">
      <img :src="image" :alt="title" loading="lazy" />
    </div>
    <div class="item-body">
      <h3 class="item-title">{{ title }}</h3>
      <div class="item-meta">
        <span v-if="price !== undefined" class="item-price">¥{{ price }}</span>
        <span v-if="location" class="item-location">
          <el-icon class="location-icon"><Location /></el-icon>
          {{ location }}
        </span>
      </div>
      <div v-if="publisher || $slots.footer" class="item-footer">
        <div v-if="publisher" class="publisher">
          <img v-if="publisherAvatar" :src="publisherAvatar" :alt="publisher" class="publisher-avatar" />
          <span class="publisher-name">{{ publisher }}</span>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
}

.item-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  cursor: pointer;
}

.item-image {
  height: 180px;
  overflow: hidden;
  background: #f0f2f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.item-card:hover .item-image img {
  transform: scale(1.05);
}

.item-body {
  padding: 14px;
}

.item-title {
  font-size: 15px;
  color: #303133;
  margin: 0 0 10px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-price {
  font-size: 18px;
  font-weight: 600;
  color: #F56C6C;
}

.item-location {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-location .location-icon {
  font-size: 12px;
}

.item-footer {
  padding-top: 10px;
  border-top: 1px solid #f5f7fa;
}

.publisher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publisher-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e4e7ed;
}

.publisher-name {
  font-size: 12px;
  color: #606266;
}
</style>
