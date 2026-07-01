import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../api/user'

// ==================== Store 定义 ====================
export const useUserStore = defineStore('user', () => {
  // ========== State（原始状态）==========
  /** 当前登录用户 */
  const currentUser = ref<User | null>(null)

  /** 是否已登录 */
  const isLoggedIn = ref(false)

  // ========== Getters（派生状态，纯函数，无参数，只读）==========
  /** 用户昵称（未登录时显示默认值） */
  const nickname = computed(() => currentUser.value?.nickname || '未登录用户')

  /** 用户头像 */
  const avatar = computed(() => currentUser.value?.avatar || '')

  /** 用户学院 */
  const college = computed(() => currentUser.value?.college || '')

  /** 用户专业 */
  const major = computed(() => currentUser.value?.major || '')

  /** 用户年级 */
  const grade = computed(() => currentUser.value?.grade || '')

  /** 用户校区 */
  const campus = computed(() => currentUser.value?.campus || '')

  /** 用户信用分 */
  const creditScore = computed(() => currentUser.value?.creditScore || 0)

  /** 用户等级 */
  const level = computed(() => currentUser.value?.level || '')

  /** 用户资料是否完整 */
  const isProfileComplete = computed(() => {
    const user = currentUser.value
    if (!user) return false
    return Boolean(user.nickname && user.avatar && user.college && user.major)
  })

  /** 用户摘要信息（用于展示） */
  const profileSummary = computed(() => {
    const user = currentUser.value
    if (!user) return null
    return {
      nickname: user.nickname,
      avatar: user.avatar,
      college: user.college,
      grade: user.grade,
      level: user.level,
      creditScore: user.creditScore,
    }
  })

  // ========== Actions（可修改 state，可以有参数和副作用）==========
  /** 设置当前用户（登录成功后调用） */
  function login(user: User): void {
    currentUser.value = user
    isLoggedIn.value = true
  }

  /** 清除当前用户（退出登录时调用） */
  function logout(): void {
    currentUser.value = null
    isLoggedIn.value = false
  }

  /** 更新用户资料（部分更新） */
  function updateProfile(data: Partial<User>): void {
    if (!currentUser.value) return
    currentUser.value = { ...currentUser.value, ...data }
  }

  /** 设置登录状态（仅用于模拟场景） */
  function setLoggedIn(status: boolean): void {
    isLoggedIn.value = status
  }

  // ========== 导出（按 State / Getters / Actions 分组）==========
  return {
    // State
    currentUser,
    isLoggedIn,
    // Getters
    nickname,
    avatar,
    college,
    major,
    grade,
    campus,
    creditScore,
    level,
    isProfileComplete,
    profileSummary,
    // Actions
    login,
    logout,
    updateProfile,
    setLoggedIn,
  }
})