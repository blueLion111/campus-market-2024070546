<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeIndex = ref(route.path)

const handleSelect = (index: string) => {
  router.push(index)
}
</script>

<template>
  <el-container>
    <el-header>
      <h2>校园轻集市</h2>
      <el-menu
        mode="horizontal"
        :default-active="activeIndex"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/list">列表</el-menu-item>
        <el-menu-item index="/publish">发布</el-menu-item>
        <el-menu-item index="/message">消息</el-menu-item>
        <el-menu-item index="/profile">我的</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid #e4e7ed;
}

.el-header h2 {
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
}

.el-main {
  padding: 24px;
}
</style>
