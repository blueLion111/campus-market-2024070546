<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入关键词搜索',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const inputValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val
  }
)

const handleInput = (value: string) => {
  emit('update:modelValue', value)
}

const handleSearch = () => {
  emit('search', inputValue.value.trim())
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <div class="search-bar">
    <el-input
      :model-value="inputValue"
      :placeholder="placeholder"
      clearable
      @input="handleInput"
      @keyup.enter="handleSearch"
      @clear="handleClear"
    >
      <template #prefix>
        <el-icon class="search-icon"><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
}

.search-bar :deep(.el-input__wrapper) {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  transition: all var(--transition-fast);
}

.search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-text-tertiary) inset;
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-accent) inset;
}

.search-bar :deep(.el-input__inner) {
  height: 40px;
  font-size: 14px;
}

.search-icon {
  font-size: 16px;
  color: var(--color-text-tertiary);
}
</style>
