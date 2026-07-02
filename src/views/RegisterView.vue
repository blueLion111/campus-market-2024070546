<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  campus: '成龙校区',
})

const campusOptions = [
  { value: '狮子山校区', label: '狮子山校区' },
  { value: '成龙校区', label: '成龙校区' },
]

const validateForm = () => {
  if (!registerForm.username.trim()) {
    ElMessage.warning('请输入用户名')
    return false
  }
  if (registerForm.username.trim().length < 3) {
    ElMessage.warning('用户名至少 3 个字符')
    return false
  }
  if (!registerForm.password) {
    ElMessage.warning('请输入密码')
    return false
  }
  if (registerForm.password.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return false
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.warning('两次密码不一致')
    return false
  }
  if (!registerForm.nickname.trim()) {
    ElMessage.warning('请输入昵称')
    return false
  }
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  loading.value = true
  try {
    const result = await userStore.register({
      username: registerForm.username.trim(),
      password: registerForm.password,
      nickname: registerForm.nickname.trim(),
      campus: registerForm.campus,
    })
    if (result.success) {
      ElMessage.success(result.message)
      router.push('/home')
    } else {
      ElMessage.error(result.message)
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">校园轻集市</h1>
        <p class="register-subtitle">创建你的账号</p>
      </div>

      <div class="form-section">
        <div class="form-field">
          <label class="field-label">用户名 <span class="required">*</span></label>
          <el-input
            v-model="registerForm.username"
            placeholder="至少 3 个字符，用于登录"
            size="large"
          />
        </div>
        <div class="form-field">
          <label class="field-label">昵称 <span class="required">*</span></label>
          <el-input
            v-model="registerForm.nickname"
            placeholder="显示给其他用户的名称"
            size="large"
          />
        </div>
        <div class="form-field">
          <label class="field-label">密码 <span class="required">*</span></label>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="至少 6 位"
            size="large"
            show-password
          />
        </div>
        <div class="form-field">
          <label class="field-label">确认密码 <span class="required">*</span></label>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
            @keyup.enter="handleRegister"
          />
        </div>
        <div class="form-field">
          <label class="field-label">校区</label>
          <el-select v-model="registerForm.campus" size="large" class="full-width">
            <el-option
              v-for="c in campusOptions"
              :key="c.value"
              :label="c.label"
              :value="c.value"
            />
          </el-select>
        </div>
        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>
        <p class="hint-text">
          已有账号？<span class="link" @click="goToLogin">去登录</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 40px 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 48px 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.register-subtitle {
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

.required {
  color: var(--color-danger);
}

.full-width {
  width: 100%;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
  height: 44px;
  font-size: 15px;
}

.hint-text {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-tertiary);
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
