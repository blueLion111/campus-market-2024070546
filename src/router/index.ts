import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '登录', public: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: '注册', public: true },
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '校园轻集市' },
    },
    {
      path: '/list',
      name: 'List',
      component: () => import('../views/ListView.vue'),
      meta: { title: '全部列表' },
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('../views/DetailView.vue'),
      meta: { title: '详情' },
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('../views/PublishView.vue'),
      meta: { title: '发布信息' },
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/MessageView.vue'),
      meta: { title: '消息中心' },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: '个人资料' },
    },
    {
      path: '/board',
      name: 'Board',
      component: () => import('../views/BoardView.vue'),
      meta: { title: '校园公告' },
    },
    {
      path: '/trade',
      name: 'Trade',
      component: () => import('../views/TradeView.vue'),
      meta: { title: '二手交易' },
    },
    {
      path: '/lost-found',
      name: 'LostFound',
      component: () => import('../views/LostFoundView.vue'),
      meta: { title: '失物招领' },
    },
    {
      path: '/group-buy',
      name: 'GroupBuy',
      component: () => import('../views/GroupBuyView.vue'),
      meta: { title: '拼单搭子' },
    },
    {
      path: '/errand',
      name: 'Errand',
      component: () => import('../views/ErrandView.vue'),
      meta: { title: '跑腿委托' },
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: () => import('../views/UserCenterView.vue'),
      meta: { title: '个人中心' },
    },
  ],
})

// 登录守卫：未登录用户只能访问 public 页面
router.beforeEach((to) => {
  const userStore = useUserStore()
  const isPublic = to.meta?.public === true
  if (!isPublic && !userStore.isLoggedIn) {
    return { name: 'Login' }
  }
})

router.afterEach((to) => {
  const title = to.meta?.title
  if (title) {
    document.title = `${title} - 校园轻集市`
  } else {
    document.title = '校园轻集市'
  }
})

export default router
