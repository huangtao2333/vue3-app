<template>
  <van-tabbar
    v-if="showTabbar"
    v-model="active"
    fixed
    placeholder
    safe-area-inset-bottom
    @change="onChange"
  >
    <van-tabbar-item
      v-for="item in tabbarItems"
      :key="item.name"
      :name="item.name"
      :icon="item.icon"
      :badge="item.badge"
      :dot="item.dot"
    >
      {{ item.text }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 当前激活的标签
const active = ref('home')

// 标签栏配置
const tabbarItems = computed(() => [
  {
    name: 'home',
    text: '首页',
    icon: 'home-o',
    route: '/home'
  },
  {
    name: 'category',
    text: '分类',
    icon: 'apps-o',
    route: '/category'
  },
  {
    name: 'cart',
    text: '购物车',
    icon: 'shopping-cart-o',
    badge: cartStore.totalCount > 0 ? cartStore.totalCount : '',
    route: '/cart'
  },
  {
    name: 'profile',
    text: '我的',
    icon: 'user-o',
    route: '/profile'
  }
])

// 是否显示标签栏
const showTabbar = computed(() => {
  return route.meta.showTabbar
})

// 根据当前路由设置激活状态
watch(
  () => route.path,
  (newPath) => {
    const item = tabbarItems.value.find(item => item.route === newPath)
    if (item) {
      active.value = item.name
    }
  },
  { immediate: true }
)

// 标签切换事件
const onChange = (name: string) => {
  const item = tabbarItems.value.find(item => item.name === name)
  if (item && route.path !== item.route) {
    router.push(item.route)
  }
}
</script>

<style lang="scss">
.van-tabbar {
  background-color: $white;
  border-top: 1px solid $border-color;
}

.van-tabbar-item {
  color: $text-color-3;

  &.van-tabbar-item--active {
    color: $primary-color;
  }
}
</style>
