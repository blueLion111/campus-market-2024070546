<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useFavoriteStore } from '../stores/favorite'
import { getFavorites } from '../api/favorite'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const validateForm = () => {
  if (!loginForm.username.trim()) {
    ElMessage.warning('请输入用户名')
    return false
  }
  if (!loginForm.password) {
    ElMessage.warning('请输入密码')
    return false
  }
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    const result = await userStore.login({
      username: loginForm.username.trim(),
      password: loginForm.password,
    })
    if (result.success) {
      ElMessage.success(result.message)
      try {
        const userId = userStore.currentUser?.id
        if (userId) {
          const favRes = await getFavorites({ userId })
          if (favRes.data) {
            favoriteStore.initFromBackend(favRes.data)
          }
        }
      } catch {
        // 收藏加载失败不阻断登录
      }
      router.push('/home')
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">校园轻集市</h1>
        <p class="login-subtitle">欢迎回来</p>
      </div>

      <div class="form-section">
        <div class="form-field">
          <label class="field-label">用户名</label>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="form-field">
          <label class="field-label">密码</label>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </div>
        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
        <p class="hint-text">
          测试账号：zhangwei / 123456
        </p>
        <p class="hint-text">
          没有账号？<span class="link" @click="goToRegister">立即注册</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 48px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  height: 44px;
  font-size: 15px;
}

.hint-text {
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.link {
  color: var(--color-text-primary);
  cursor: pointer;
  text-decoration: underline;
}

.link:hover {
  color: var(--color-text-secondary);
}
</style>
