import { inject } from 'vue'

export const useReload = () => {
  const reload = inject<() => void>('reload', () => {
    console.warn('reload 方法未提供，请在 App.vue 中配置 provide("reload", reload)')
  })
  return { reload }
}
