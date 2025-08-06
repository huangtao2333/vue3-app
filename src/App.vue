<template>
  <div id="app">
    <!-- 错误边界 -->
    <ErrorBoundary>
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAlivePages">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </ErrorBoundary>

    <!-- 全局加载组件 -->
    <van-loading v-if="globalLoading" class="global-loading" type="spinner" color="#1989fa">
      加载中...
    </van-loading>

    <!-- PWA 提示组件 -->
    <PWAPrompt />

    <!-- 全局提示 -->
    <van-toast />
    <van-dialog />
    <van-notify />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import ErrorBoundary from '@/components/Common/ErrorBoundary.vue'
import PWAPrompt from '@/components/Common/PWAPrompt.vue'
import { networkManager } from '@/utils/network'
import { performanceMonitor } from '@/utils/performance'

const appStore = useAppStore()

// 需要缓存的页面
const keepAlivePages = ['Home', 'Category', 'Cart', 'Profile']

// 全局加载状态
const globalLoading = computed(() => appStore.loading)

// 初始化应用
onMounted(() => {
  // 标记应用启动时间
  performanceMonitor.mark('app-start')

  // 初始化网络监控
  networkManager.addListener((online) => {
    if (online) {
      console.log('网络已连接')
    } else {
      console.log('网络已断开')
    }
  })

  // 性能监控
  setTimeout(() => {
    performanceMonitor.mark('app-ready')
    const startupTime = performanceMonitor.measure('app-startup', 'app-start', 'app-ready')
    console.log(`应用启动耗时: ${startupTime.toFixed(2)}ms`)
  }, 100)
})
</script>

<style lang="scss">
#app {
  height: 100%;
  position: relative;
}

.global-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

// 安全区域适配
.safe-area-inset-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.safe-area-inset-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
