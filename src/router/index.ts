import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import(/* webpackChunkName: "category" */ '@/views/Category/index.vue'),
    meta: {
      title: '分类',
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import(/* webpackChunkName: "cart" */ '@/views/Cart/index.vue'),
    meta: {
      title: '购物车',
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile/index.vue'),
    meta: {
      title: '我的',
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '@/views/Search/index.vue'),
    meta: {
      title: '搜索'
    }
  },
  {
    path: '/shop/:id',
    name: 'Shop',
    component: () => import(/* webpackChunkName: "shop" */ '@/views/Shop/index.vue'),
    meta: {
      title: '商家详情'
    }
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import(/* webpackChunkName: "product" */ '@/views/Product/index.vue'),
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import(/* webpackChunkName: "order" */ '@/views/Order/index.vue'),
    meta: {
      title: '订单列表'
    }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import(/* webpackChunkName: "order" */ '@/views/Order/detail.vue'),
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import(/* webpackChunkName: "address" */ '@/views/Address/index.vue'),
    meta: {
      title: '收货地址'
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import(/* webpackChunkName: "order" */ '@/views/Checkout/index.vue'),
    meta: {
      title: '确认订单'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Register/index.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/coupon',
    name: 'Coupon',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Coupon/index.vue'),
    meta: {
      title: '我的优惠券'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Settings/index.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Feedback/index.vue'),
    meta: {
      title: '意见反馈'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/About/index.vue'),
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/CustomerService/index.vue'),
    meta: {
      title: '客服中心'
    }
  },
  {
    path: '/user-agreement',
    name: 'UserAgreement',
    component: () => import(/* webpackChunkName: "legal" */ '@/views/UserAgreement/index.vue'),
    meta: {
      title: '用户协议'
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import(/* webpackChunkName: "legal" */ '@/views/PrivacyPolicy/index.vue'),
    meta: {
      title: '隐私政策'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue3饿了吗App`
  }
  
  // 显示加载状态
  appStore.setLoading(true)
  
  next()
})

router.afterEach(() => {
  const appStore = useAppStore()
  
  // 隐藏加载状态
  setTimeout(() => {
    appStore.setLoading(false)
  }, 300)
})

export default router
