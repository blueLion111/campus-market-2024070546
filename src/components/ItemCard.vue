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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.item-card:hover {
  border-color: var(--color-text-tertiary);
}

.item-tag {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  padding: 2px 8px;
  background: rgba(26, 26, 26, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  border-radius: var(--radius-sm);
  z-index: 2;
}

.favorite-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 2;
  cursor: pointer;
}

.item-image {
  height: 160px;
  overflow: hidden;
  background: var(--color-border-light);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.item-card:hover .item-image img {
  transform: scale(1.02);
}

.item-body {
  padding: var(--space-4);
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.item-location {
  font-size: 12px;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-location .location-icon {
  font-size: 12px;
}

.item-footer {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
}

.publisher {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.publisher-avatar {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
}

.publisher-name {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
