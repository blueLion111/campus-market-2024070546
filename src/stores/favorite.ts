import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Favorite } from '../api/favorite'

// ==================== 类型定义 ====================
export interface FavoriteItem {
  id: string | number
  itemId: string | number
  itemType: string
  title: string
  price: number | null
  image: string
  publisher: string
  campus: string
  favoriteTime: string
  status: string
}

// ==================== Store 定义 ====================
export const useFavoriteStore = defineStore('favorite', () => {
  // ========== State（原始状态）==========
  /** 收藏列表 */
  const favorites = ref<FavoriteItem[]>([])

  // ========== Getters（派生状态，纯函数，无参数，只读）==========
  /** 收藏总数 */
  const total = computed(() => favorites.value.length)

  /** 是否已收藏（返回一个函数，因为 getter 不能接受参数） */
  const hasItem = computed(() => (itemId: string | number, itemType: string) => {
    return favorites.value.some(
      f => String(f.itemId) === String(itemId) && f.itemType === itemType
    )
  })

  /** 获取收藏记录的 ID（返回一个函数） */
  const getItemId = computed(() => (itemId: string | number, itemType: string) => {
    const item = favorites.value.find(
      f => String(f.itemId) === String(itemId) && f.itemType === itemType
    )
    return item?.id ?? null
  })

  /** 按类型分组统计 */
  const countByType = computed(() => {
    const counts: Record<string, number> = {}
    favorites.value.forEach(f => {
      counts[f.itemType] = (counts[f.itemType] || 0) + 1
    })
    return counts
  })

  // ========== Actions（可修改 state，可以有参数和副作用）==========
  /** 添加收藏 */
  function add(item: Omit<FavoriteItem, 'id' | 'favoriteTime' | 'status'>): void {
    if (hasItem.value(item.itemId, item.itemType)) return

    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    const newFavorite: FavoriteItem = {
      ...item,
      id: `fav_${Date.now()}`,
      favoriteTime: now,
      status: 'active',
    }
    favorites.value.unshift(newFavorite)
  }

  /** 移除收藏 */
  function remove(itemId: string | number, itemType: string): void {
    favorites.value = favorites.value.filter(
      f => !(String(f.itemId) === String(itemId) && f.itemType === itemType)
    )
  }

  /** 切换收藏状态（返回是否被收藏） */
  function toggle(item: {
    id: string | number
    type: string
    title: string
    price?: number | null
    image: string
    publisher?: string
    campus?: string
  }): boolean {
    if (hasItem.value(item.id, item.type)) {
      remove(item.id, item.type)
      return false
    } else {
      add({
        itemId: item.id,
        itemType: item.type,
        title: item.title,
        price: item.price ?? null,
        image: item.image,
        publisher: item.publisher || '匿名用户',
        campus: item.campus || '',
      })
      return true
    }
  }

  /** 从后端 API 数据批量初始化收藏列表 */
  function initFromBackend(backendFavorites: Favorite[]): void {
    favorites.value = backendFavorites.map(f => ({
      id: f.id,
      itemId: f.itemId,
      itemType: f.itemType,
      title: f.title,
      price: f.price ?? null,
      image: f.image,
      publisher: f.publisher,
      campus: f.campus,
      favoriteTime: f.favoriteTime,
      status: f.status,
    }))
  }

  /** 清空所有收藏 */
  function clear(): void {
    favorites.value = []
  }

  // ========== 导出（按 State / Getters / Actions 分组）==========
  return {
    // State
    favorites,
    // Getters
    total,
    hasItem,
    getItemId,
    countByType,
    // Actions
    add,
    remove,
    toggle,
    initFromBackend,
    clear,
  }
})