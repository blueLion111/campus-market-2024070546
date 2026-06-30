<script setup lang="ts">
interface Props {
  label: string
  required?: boolean
  error?: string
}

defineProps<Props>()
</script>

<template>
  <div class="form-field">
    <label class="field-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <slot />
    <div v-if="error" class="field-error">{{ error }}</div>
  </div>
</template>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.required-mark {
  color: #F56C6C;
  margin-left: 2px;
}

.field-error {
  font-size: 12px;
  color: #F56C6C;
  margin-top: 4px;
}
</style>
