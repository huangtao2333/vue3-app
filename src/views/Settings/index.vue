<template>
  <div class="settings-page">
    <NavBar title="设置" left-arrow @click-left="$router.back()" />
    
    <div class="settings-content">
      <!-- 账户设置 -->
      <div class="settings-section">
        <h3 class="section-title">账户设置</h3>
        <van-cell-group>
          <van-cell
            title="修改密码"
            is-link
            @click="changePassword"
          />
          <van-cell
            title="绑定手机"
            is-link
            :value="userInfo?.phone || '未绑定'"
            @click="bindPhone"
          />
          <van-cell
            title="实名认证"
            is-link
            value="未认证"
            @click="realNameAuth"
          />
        </van-cell-group>
      </div>
      
      <!-- 消息设置 -->
      <div class="settings-section">
        <h3 class="section-title">消息设置</h3>
        <van-cell-group>
          <van-cell title="订单消息">
            <template #right-icon>
              <van-switch v-model="settings.orderNotification" />
            </template>
          </van-cell>
          <van-cell title="优惠活动">
            <template #right-icon>
              <van-switch v-model="settings.promotionNotification" />
            </template>
          </van-cell>
          <van-cell title="系统通知">
            <template #right-icon>
              <van-switch v-model="settings.systemNotification" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      
      <!-- 隐私设置 -->
      <div class="settings-section">
        <h3 class="section-title">隐私设置</h3>
        <van-cell-group>
          <van-cell
            title="隐私政策"
            is-link
            @click="showPrivacyPolicy"
          />
          <van-cell
            title="用户协议"
            is-link
            @click="showUserAgreement"
          />
          <van-cell
            title="清除缓存"
            is-link
            :value="cacheSize"
            @click="clearCache"
          />
        </van-cell-group>
      </div>
      
      <!-- 其他设置 -->
      <div class="settings-section">
        <h3 class="section-title">其他</h3>
        <van-cell-group>
          <van-cell
            title="检查更新"
            is-link
            value="v1.0.0"
            @click="checkUpdate"
          />
          <van-cell
            title="意见反馈"
            is-link
            @click="goToFeedback"
          />
          <van-cell
            title="关于我们"
            is-link
            @click="showAbout"
          />
        </van-cell-group>
      </div>
      
      <!-- 退出登录 -->
      <div class="logout-section">
        <van-button
          type="danger"
          block
          @click="handleLogout"
        >
          退出登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showToast, showConfirmDialog } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'

const router = useRouter()
const appStore = useAppStore()

// 用户信息
const userInfo = appStore.userInfo

// 设置项
const settings = ref({
  orderNotification: true,
  promotionNotification: true,
  systemNotification: false
})

// 缓存大小
const cacheSize = ref('12.5MB')

// 修改密码
const changePassword = () => {
  showToast('跳转到修改密码页面')
}

// 绑定手机
const bindPhone = () => {
  showToast('跳转到绑定手机页面')
}

// 实名认证
const realNameAuth = () => {
  showToast('跳转到实名认证页面')
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  router.push('/privacy-policy')
}

// 显示用户协议
const showUserAgreement = () => {
  router.push('/user-agreement')
}

// 清除缓存
const clearCache = async () => {
  const result = await showConfirmDialog({
    title: '清除缓存',
    message: '确定要清除所有缓存数据吗？'
  })
  
  if (result === 'confirm') {
    // 模拟清除缓存
    setTimeout(() => {
      cacheSize.value = '0MB'
      showToast('缓存清除成功')
    }, 1000)
  }
}

// 检查更新
const checkUpdate = () => {
  showToast('当前已是最新版本')
}

// 意见反馈
const goToFeedback = () => {
  router.push('/feedback')
}

// 关于我们
const showAbout = () => {
  router.push('/about')
}

// 退出登录
const handleLogout = async () => {
  const result = await showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？'
  })
  
  if (result === 'confirm') {
    appStore.logout()
    showToast('已退出登录')
    router.replace('/login')
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: $background-color;
}

.settings-content {
  padding-bottom: $padding-xl;
}

.settings-section {
  margin-bottom: $padding-lg;
  
  .section-title {
    padding: $padding-lg $padding-md $padding-sm;
    font-size: $font-size-md;
    color: $text-color-2;
    margin: 0;
  }
}

.logout-section {
  padding: $padding-xl $padding-md;
}

:deep(.van-cell-group) {
  margin: 0;
}

:deep(.van-cell) {
  padding: $padding-md;
  
  &:not(:last-child)::after {
    left: $padding-md;
  }
}
</style>
