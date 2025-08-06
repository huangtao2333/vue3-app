<template>
  <!-- PWA 安装提示 -->
  <van-popup
    v-model:show="showInstallPrompt"
    position="bottom"
    :style="{ borderRadius: '16px 16px 0 0' }"
  >
    <div class="pwa-prompt">
      <div class="prompt-header">
        <div class="app-info">
          <div class="app-logo">🍔</div>
          <div class="app-details">
            <h3 class="app-name">Vue3饿了吗</h3>
            <p class="app-desc">安装到主屏幕，获得更好的体验</p>
          </div>
        </div>
        <van-button
          type="primary"
          size="small"
          @click="installApp"
        >
          安装
        </van-button>
      </div>
      
      <div class="prompt-features">
        <div class="feature-item">
          <van-icon name="lightning" />
          <span>更快的启动速度</span>
        </div>
        <div class="feature-item">
          <van-icon name="shield-o" />
          <span>离线也能使用</span>
        </div>
        <div class="feature-item">
          <van-icon name="desktop-o" />
          <span>桌面快捷方式</span>
        </div>
      </div>
      
      <div class="prompt-actions">
        <van-button block @click="dismissPrompt">
          暂不安装
        </van-button>
      </div>
    </div>
  </van-popup>
  
  <!-- 更新提示 -->
  <van-popup
    v-model:show="showUpdatePrompt"
    position="bottom"
    :style="{ borderRadius: '16px 16px 0 0' }"
  >
    <div class="update-prompt">
      <div class="update-header">
        <van-icon name="upgrade" size="24" color="#1989fa" />
        <h3>发现新版本</h3>
      </div>
      
      <p class="update-desc">
        新版本已准备就绪，重启应用即可更新
      </p>
      
      <div class="update-actions">
        <van-button @click="dismissUpdate">
          稍后更新
        </van-button>
        <van-button type="primary" @click="updateApp">
          立即更新
        </van-button>
      </div>
    </div>
  </van-popup>
  
  <!-- 离线提示 -->
  <van-notify
    v-model:show="showOfflineNotify"
    type="warning"
    message="网络连接已断开，正在使用离线模式"
    :duration="0"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNetwork } from '@/utils/network'

// PWA 相关状态
const showInstallPrompt = ref(false)
const showUpdatePrompt = ref(false)
const showOfflineNotify = ref(false)
const deferredPrompt = ref<any>(null)
const registration = ref<ServiceWorkerRegistration | null>(null)

// 网络状态
const { isOnline } = useNetwork()

// 监听 PWA 安装提示事件
const handleBeforeInstallPrompt = (event: Event) => {
  // 阻止默认的安装提示
  event.preventDefault()
  
  // 保存事件，稍后使用
  deferredPrompt.value = event
  
  // 检查是否应该显示安装提示
  if (shouldShowInstallPrompt()) {
    showInstallPrompt.value = true
  }
}

// 检查是否应该显示安装提示
const shouldShowInstallPrompt = (): boolean => {
  // 检查是否已经安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false
  }
  
  // 检查是否已经拒绝过
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
    
    // 如果拒绝时间少于7天，不显示提示
    if (daysSinceDismissed < 7) {
      return false
    }
  }
  
  return true
}

// 安装应用
const installApp = async () => {
  if (!deferredPrompt.value) return
  
  // 显示安装提示
  deferredPrompt.value.prompt()
  
  // 等待用户响应
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    console.log('用户接受了安装提示')
  } else {
    console.log('用户拒绝了安装提示')
  }
  
  // 清理
  deferredPrompt.value = null
  showInstallPrompt.value = false
}

// 拒绝安装提示
const dismissPrompt = () => {
  showInstallPrompt.value = false
  
  // 记录拒绝时间
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

// 监听 Service Worker 更新
const handleServiceWorkerUpdate = (reg: ServiceWorkerRegistration) => {
  registration.value = reg
  
  // 检查是否有等待中的 Service Worker
  if (reg.waiting) {
    showUpdatePrompt.value = true
  }
  
  // 监听新的 Service Worker 安装
  reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdatePrompt.value = true
        }
      })
    }
  })
}

// 更新应用
const updateApp = () => {
  if (registration.value?.waiting) {
    // 通知 Service Worker 跳过等待
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // 监听控制权变更
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }
  
  showUpdatePrompt.value = false
}

// 拒绝更新
const dismissUpdate = () => {
  showUpdatePrompt.value = false
}

// 监听网络状态变化
watch(isOnline, (online) => {
  showOfflineNotify.value = !online
})

// 生命周期
onMounted(() => {
  // 监听 PWA 安装提示
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  
  // 监听应用安装完成
  window.addEventListener('appinstalled', () => {
    console.log('PWA 安装完成')
    showInstallPrompt.value = false
  })
  
  // 注册 Service Worker 更新监听
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(handleServiceWorkerUpdate)
    
    // 监听 Service Worker 消息
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        showUpdatePrompt.value = true
      }
    })
  }
  
  // 初始化离线状态
  showOfflineNotify.value = !isOnline.value
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})
</script>

<style lang="scss" scoped>
.pwa-prompt {
  padding: $padding-lg;
  
  .prompt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $padding-lg;
    
    .app-info {
      display: flex;
      align-items: center;
      
      .app-logo {
        width: 48px;
        height: 48px;
        border-radius: $border-radius-lg;
        margin-right: $padding-md;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background-color: $primary-color;
      }
      
      .app-details {
        .app-name {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $text-color;
          margin-bottom: $padding-xs;
        }
        
        .app-desc {
          font-size: $font-size-sm;
          color: $text-color-3;
        }
      }
    }
  }
  
  .prompt-features {
    display: flex;
    justify-content: space-around;
    margin-bottom: $padding-lg;
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      :deep(.van-icon) {
        margin-bottom: $padding-xs;
        color: $primary-color;
      }
      
      span {
        font-size: $font-size-xs;
        color: $text-color-2;
      }
    }
  }
  
  .prompt-actions {
    margin-top: $padding-md;
  }
}

.update-prompt {
  padding: $padding-lg;
  text-align: center;
  
  .update-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $padding-md;
    
    h3 {
      margin-left: $padding-sm;
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
  }
  
  .update-desc {
    font-size: $font-size-md;
    color: $text-color-2;
    margin-bottom: $padding-lg;
    line-height: 1.5;
  }
  
  .update-actions {
    display: flex;
    gap: $padding-md;
    justify-content: center;
  }
}
</style>
