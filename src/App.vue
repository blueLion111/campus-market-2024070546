<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #F5F7FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>