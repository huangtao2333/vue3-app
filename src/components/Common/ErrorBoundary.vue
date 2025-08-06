<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <van-icon name="warning-o" size="48" color="#ff4d4f" />
      </div>
      
      <h3 class="error-title">{{ errorTitle }}</h3>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div class="error-actions">
        <van-button type="primary" @click="retry">
          重试
        </van-button>
        <van-button @click="goHome">
          返回首页
        </van-button>
      </div>
      
      <!-- 开发环境显示详细错误信息 -->
      <div v-if="isDev && errorDetails" class="error-details">
        <van-collapse v-model="showDetails">
          <van-collapse-item title="错误详情" name="details">
            <pre>{{ errorDetails }}</pre>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  fallback?: string
  onError?: (error: Error, instance: any, info: string) => void
}

const props = defineProps<Props>()

const router = useRouter()

// 响应式数据
const hasError = ref(false)
const errorTitle = ref('出现了一些问题')
const errorMessage = ref('页面遇到了错误，请稍后重试')
const errorDetails = ref('')
const showDetails = ref([])
const isDev = ref(import.meta.env.DEV)

// 错误捕获
onErrorCaptured((error: Error, instance: any, info: string) => {
  console.error('ErrorBoundary caught an error:', error)
  
  hasError.value = true
  
  // 根据错误类型设置不同的提示信息
  if (error.name === 'ChunkLoadError') {
    errorTitle.value = '资源加载失败'
    errorMessage.value = '页面资源加载失败，请检查网络连接后重试'
  } else if (error.message.includes('Network Error')) {
    errorTitle.value = '网络连接失败'
    errorMessage.value = '网络连接异常，请检查网络设置后重试'
  } else if (error.message.includes('timeout')) {
    errorTitle.value = '请求超时'
    errorMessage.value = '请求超时，请稍后重试'
  } else {
    errorTitle.value = '页面出错了'
    errorMessage.value = '页面遇到了未知错误，请稍后重试'
  }
  
  // 开发环境显示详细错误信息
  if (isDev.value) {
    errorDetails.value = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack}\n\nComponent Info:\n${info}`
  }
  
  // 调用错误回调
  if (props.onError) {
    props.onError(error, instance, info)
  }
  
  // 上报错误（生产环境）
  if (!isDev.value) {
    reportError(error, info)
  }
  
  return false
})

// 重试
const retry = () => {
  hasError.value = false
  errorDetails.value = ''
  
  // 刷新页面
  window.location.reload()
}

// 返回首页
const goHome = () => {
  hasError.value = false
  router.replace('/home')
}

// 错误上报
const reportError = (error: Error, info: string) => {
  // TODO: 实现错误上报逻辑
  const errorReport = {
    message: error.message,
    stack: error.stack,
    componentInfo: info,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }
  
  console.log('Error Report:', errorReport)
  
  // 可以发送到错误监控服务
  // fetch('/api/error-report', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorReport)
  // }).catch(() => {
  //   // 忽略上报失败
  // })
}

// 全局错误处理
onMounted(() => {
  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    hasError.value = true
    errorTitle.value = '异步操作失败'
    errorMessage.value = '页面异步操作失败，请稍后重试'
    
    if (isDev.value) {
      errorDetails.value = `Unhandled Promise Rejection: ${event.reason}`
    }
    
    if (!isDev.value) {
      reportError(new Error(event.reason), 'Unhandled Promise Rejection')
    }
    
    event.preventDefault()
  })
  
  // 捕获全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    // 如果是资源加载错误
    if (event.target !== window) {
      hasError.value = true
      errorTitle.value = '资源加载失败'
      errorMessage.value = '页面资源加载失败，请刷新页面重试'
      return
    }
    
    hasError.value = true
    errorTitle.value = '脚本执行错误'
    errorMessage.value = '页面脚本执行出错，请刷新页面重试'
    
    if (isDev.value && event.error) {
      errorDetails.value = `${event.error.name}: ${event.error.message}\n\nStack Trace:\n${event.error.stack}`
    }
    
    if (!isDev.value && event.error) {
      reportError(event.error, 'Global Error')
    }
  })
})
</script>

<style lang="scss" scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-color;
  padding: $padding-xl;
}

.error-content {
  text-align: center;
  max-width: 400px;
  
  .error-icon {
    margin-bottom: $padding-lg;
  }
  
  .error-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $padding-md;
  }
  
  .error-message {
    font-size: $font-size-md;
    color: $text-color-2;
    line-height: 1.5;
    margin-bottom: $padding-xl;
  }
  
  .error-actions {
    display: flex;
    gap: $padding-md;
    justify-content: center;
    margin-bottom: $padding-xl;
  }
  
  .error-details {
    text-align: left;
    
    pre {
      background-color: $gray-1;
      padding: $padding-md;
      border-radius: $border-radius-md;
      font-size: $font-size-xs;
      line-height: 1.4;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
