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
  background-color: #f5f7fa;
}

.layout-header {
  padding: 0;
  height: auto;
}

.layout-main {
  padding: 32px 0;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}
</style>
