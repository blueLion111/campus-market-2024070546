<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <el-container class="app-layout">
    <el-header>
      <AppHeader />
    </el-header>
    <el-main>
      <slot />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.el-header {
  padding: 0;
  height: auto;
}

.el-main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
</style>
