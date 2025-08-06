<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">
          <img v-if="userInfo?.avatar" :src="userInfo.avatar" :alt="userInfo.nickname" />
          <van-icon v-else name="user-o" size="40" />
        </div>
        
        <div v-if="isLoggedIn" class="user-details">
          <h3 class="nickname">{{ userInfo.nickname }}</h3>
          <p class="phone">{{ userInfo.phone }}</p>
        </div>
        
        <div v-else class="login-prompt" @click="goToLogin">
          <span>点击登录</span>
          <van-icon name="arrow" />
        </div>
      </div>
      
      <div v-if="isLoggedIn" class="user-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userStats.orderCount }}</span>
          <span class="stat-label">订单</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userStats.couponCount }}</span>
          <span class="stat-label">优惠券</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userStats.pointCount }}</span>
          <span class="stat-label">积分</span>
        </div>
      </div>
    </div>
    
    <!-- 订单相关 -->
    <div v-if="isLoggedIn" class="order-section">
      <div class="section-header">
        <h3>我的订单</h3>
        <span class="more-link" @click="goToOrderList">查看全部</span>
      </div>
      
      <div class="order-types">
        <div
          v-for="type in orderTypes"
          :key="type.key"
          class="order-type"
          @click="goToOrderList(type.key)"
        >
          <van-icon :name="type.icon" size="24" />
          <span>{{ type.name }}</span>
          <van-badge v-if="type.count > 0" :content="type.count" />
        </div>
      </div>
    </div>
    
    <!-- 功能菜单 -->
    <div class="menu-section">
      <van-cell-group>
        <van-cell
          v-for="menu in menuList"
          :key="menu.key"
          :title="menu.title"
          :icon="menu.icon"
          is-link
          @click="handleMenuClick(menu)"
        >
          <template #right-icon>
            <van-badge v-if="menu.badge" :content="menu.badge" />
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    
    <!-- 设置菜单 -->
    <div class="setting-section">
      <van-cell-group>
        <van-cell
          v-for="setting in settingList"
          :key="setting.key"
          :title="setting.title"
          :icon="setting.icon"
          is-link
          @click="handleSettingClick(setting)"
        />
      </van-cell-group>
    </div>
    
    <!-- 退出登录 -->
    <div v-if="isLoggedIn" class="logout-section">
      <van-button type="danger" block @click="handleLogout">
        退出登录
      </van-button>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showConfirmDialog } from 'vant'
import TabBar from '@/components/Layout/TabBar.vue'

const router = useRouter()
const appStore = useAppStore()

// 计算属性
const isLoggedIn = computed(() => appStore.isLoggedIn)
const userInfo = computed(() => appStore.userInfo)

// 用户统计数据
const userStats = ref({
  orderCount: 12,
  couponCount: 3,
  pointCount: 1580
})

// 订单类型
const orderTypes = [
  {
    key: 'pending',
    name: '待付款',
    icon: 'pending-payment',
    count: 1
  },
  {
    key: 'confirmed',
    name: '待接单',
    icon: 'tosend',
    count: 0
  },
  {
    key: 'delivering',
    name: '配送中',
    icon: 'logistics',
    count: 2
  },
  {
    key: 'completed',
    name: '已完成',
    icon: 'completed',
    count: 0
  }
]

// 功能菜单
const menuList = [
  {
    key: 'address',
    title: '收货地址',
    icon: 'location-o'
  },
  {
    key: 'coupon',
    title: '优惠券',
    icon: 'coupon-o',
    badge: 3
  },
  {
    key: 'points',
    title: '积分商城',
    icon: 'gift-o'
  },
  {
    key: 'customer-service',
    title: '客服中心',
    icon: 'service-o'
  }
]

// 设置菜单
const settingList = [
  {
    key: 'about',
    title: '关于我们',
    icon: 'info-o'
  },
  {
    key: 'feedback',
    title: '意见反馈',
    icon: 'comment-o'
  },
  {
    key: 'settings',
    title: '设置',
    icon: 'setting-o'
  }
]

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 跳转到订单列表
const goToOrderList = (status?: string) => {
  const query = status ? { status } : {}
  router.push({ path: '/order', query })
}

// 处理菜单点击
const handleMenuClick = (menu: any) => {
  switch (menu.key) {
    case 'address':
      router.push('/address')
      break
    case 'coupon':
      router.push('/coupon')
      break
    case 'points':
      // TODO: 跳转到积分商城
      console.log('跳转到积分商城')
      break
    case 'customer-service':
      router.push('/customer-service')
      break
  }
}

// 处理设置点击
const handleSettingClick = (setting: any) => {
  switch (setting.key) {
    case 'about':
      router.push('/about')
      break
    case 'feedback':
      router.push('/feedback')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    
    appStore.logout()
    router.push('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 60px;
}

.profile-header {
  background: linear-gradient(135deg, $primary-color, #40a9ff);
  color: $white;
  padding: $padding-xl $padding-md;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: $padding-lg;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: $padding-md;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .user-details {
      flex: 1;
      
      .nickname {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $padding-xs;
      }
      
      .phone {
        font-size: $font-size-sm;
        opacity: 0.8;
      }
    }
    
    .login-prompt {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      
      span {
        font-size: $font-size-lg;
      }
    }
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: $font-size-xl;
        font-weight: 600;
        margin-bottom: $padding-xs;
      }
      
      .stat-label {
        font-size: $font-size-sm;
        opacity: 0.8;
      }
    }
  }
}

.order-section {
  background-color: $white;
  margin-top: $padding-sm;
  padding: $padding-md;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $padding-md;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
    
    .more-link {
      font-size: $font-size-sm;
      color: $text-color-3;
      cursor: pointer;
    }
  }
  
  .order-types {
    display: flex;
    justify-content: space-around;
    
    .order-type {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      
      span {
        margin-top: $padding-xs;
        font-size: $font-size-sm;
        color: $text-color-2;
      }
      
      :deep(.van-badge) {
        position: absolute;
        top: -4px;
        right: -4px;
      }
    }
  }
}

.menu-section,
.setting-section {
  margin-top: $padding-sm;
  
  :deep(.van-cell) {
    padding: $padding-md;
    
    .van-cell__title {
      font-size: $font-size-md;
      color: $text-color;
    }
    
    .van-cell__right-icon {
      display: flex;
      align-items: center;
      gap: $padding-xs;
    }
  }
}

.logout-section {
  margin: $padding-xl $padding-md;
}
</style>
