<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <el-container class="app-layout">
    <el-header class="layout-header">
      <AppHeader />
    </el-header>
    <el-main class="layout-main">
      <div class="main-content">
        <slot />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--color-bg);
}

.layout-header {
  padding: 0;
  height: auto;
}

.layout-main {
  padding: 0;
}

.main-content {
  width: 100%;
}
</style>
