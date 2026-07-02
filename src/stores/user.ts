import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams } from '../api/user'
import { getUserByUsername, createUser } from '../api/user'

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
  const creditScore = computed(() => currentUser.value?.creditScore ?? 0)

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
  /** 登录：校验账号密码 */
  async function login(params: LoginParams): Promise<{ success: boolean; message: string }> {
    try {
      const res = await getUserByUsername(params.username)
      const users = res.data
      if (!users || users.length === 0) {
        return { success: false, message: '用户不存在' }
      }
      const user = users[0]
      if (!user) {
        return { success: false, message: '用户不存在' }
      }
      if (user.password !== params.password) {
        return { success: false, message: '密码错误' }
      }
      // 移除 password 后存入 store
      const { password: _pwd, ...userWithoutPassword } = user
      void _pwd
      currentUser.value = userWithoutPassword as User
      isLoggedIn.value = true
      localStorage.setItem('campus-user', JSON.stringify(userWithoutPassword))
      return { success: true, message: '登录成功' }
    } catch {
      return { success: false, message: '登录失败，请检查 Mock 服务是否启动' }
    }
  }

  /** 注册：创建新用户并自动登录 */
  async function register(params: RegisterParams): Promise<{ success: boolean; message: string }> {
    try {
      // 检查用户名是否已存在
      const res = await getUserByUsername(params.username)
      if (res.data && res.data.length > 0) {
        return { success: false, message: '用户名已存在' }
      }
      // 创建新用户
      const newUser = await createUser({
        username: params.username,
        password: params.password,
        nickname: params.nickname,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`,
        college: '未设置',
        major: '未设置',
        grade: '2024级',
        studentId: '',
        campus: params.campus,
        creditScore: 100,
        level: 'LV.1',
        publishCount: 0,
        favoriteCount: 0,
        orderCount: 0,
        messageCount: 0,
        joinDate: new Date().toISOString().slice(0, 10),
        phone: '',
        email: '',
      })
      // 自动登录
      const { password: _pwd, ...userWithoutPassword } = newUser.data
      void _pwd
      currentUser.value = userWithoutPassword as User
      isLoggedIn.value = true
      localStorage.setItem('campus-user', JSON.stringify(userWithoutPassword))
      return { success: true, message: '注册成功' }
    } catch {
      return { success: false, message: '注册失败，请检查 Mock 服务是否启动' }
    }
  }

  /** 从 localStorage 恢复登录状态 */
  function restoreLogin(): void {
    const stored = localStorage.getItem('campus-user')
    if (stored) {
      try {
        const user = JSON.parse(stored) as User
        currentUser.value = user
        isLoggedIn.value = true
      } catch {
        localStorage.removeItem('campus-user')
      }
    }
  }

  /** 退出登录 */
  function logout(): void {
    currentUser.value = null
    isLoggedIn.value = false
    localStorage.removeItem('campus-user')
  }

  /** 更新用户资料（部分更新） */
  function updateProfile(data: Partial<User>): void {
    if (!currentUser.value) return
    currentUser.value = { ...currentUser.value, ...data }
    localStorage.setItem('campus-user', JSON.stringify(currentUser.value))
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
    register,
    restoreLogin,
    logout,
    updateProfile,
    setLoggedIn,
  }
})
