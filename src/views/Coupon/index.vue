<template>
  <div class="coupon-page">
    <NavBar title="我的优惠券" left-arrow @click-left="$router.back()" />
    
    <div class="coupon-tabs">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <van-tab title="可使用" name="available">
          <div class="coupon-list">
            <div
              v-for="coupon in availableCoupons"
              :key="coupon.id"
              class="coupon-item available"
            >
              <div class="coupon-left">
                <div class="amount">¥{{ coupon.amount }}</div>
                <div class="condition">满{{ coupon.minAmount }}可用</div>
              </div>
              <div class="coupon-right">
                <div class="title">{{ coupon.title }}</div>
                <div class="desc">{{ coupon.desc }}</div>
                <div class="expire">有效期至 {{ coupon.expireDate }}</div>
              </div>
              <div class="coupon-action">
                <van-button size="small" type="primary" @click="useCoupon(coupon)">
                  立即使用
                </van-button>
              </div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="已使用" name="used">
          <div class="coupon-list">
            <div
              v-for="coupon in usedCoupons"
              :key="coupon.id"
              class="coupon-item used"
            >
              <div class="coupon-left">
                <div class="amount">¥{{ coupon.amount }}</div>
                <div class="condition">满{{ coupon.minAmount }}可用</div>
              </div>
              <div class="coupon-right">
                <div class="title">{{ coupon.title }}</div>
                <div class="desc">{{ coupon.desc }}</div>
                <div class="expire">已于 {{ coupon.usedDate }} 使用</div>
              </div>
              <div class="coupon-status">已使用</div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="已过期" name="expired">
          <div class="coupon-list">
            <div
              v-for="coupon in expiredCoupons"
              :key="coupon.id"
              class="coupon-item expired"
            >
              <div class="coupon-left">
                <div class="amount">¥{{ coupon.amount }}</div>
                <div class="condition">满{{ coupon.minAmount }}可用</div>
              </div>
              <div class="coupon-right">
                <div class="title">{{ coupon.title }}</div>
                <div class="desc">{{ coupon.desc }}</div>
                <div class="expire">已于 {{ coupon.expireDate }} 过期</div>
              </div>
              <div class="coupon-status">已过期</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    
    <!-- 空状态 -->
    <Empty
      v-if="currentCoupons.length === 0"
      image="/banner1.jpg"
      description="暂无优惠券"
      button-text="去逛逛"
      @button-click="goToHome"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'
import Empty from '@/components/Common/Empty.vue'

const router = useRouter()

// 当前选中的标签
const activeTab = ref('available')

// 模拟优惠券数据
const availableCoupons = ref([
  {
    id: '1',
    title: '新用户专享',
    desc: '首单立减',
    amount: 10,
    minAmount: 30,
    expireDate: '2024-12-31'
  },
  {
    id: '2',
    title: '满减优惠',
    desc: '全场通用',
    amount: 5,
    minAmount: 20,
    expireDate: '2024-11-30'
  }
])

const usedCoupons = ref([
  {
    id: '3',
    title: '周末特惠',
    desc: '周末专用',
    amount: 8,
    minAmount: 25,
    usedDate: '2024-01-15'
  }
])

const expiredCoupons = ref([
  {
    id: '4',
    title: '过期优惠券',
    desc: '已过期',
    amount: 15,
    minAmount: 50,
    expireDate: '2023-12-31'
  }
])

// 当前显示的优惠券列表
const currentCoupons = computed(() => {
  switch (activeTab.value) {
    case 'available':
      return availableCoupons.value
    case 'used':
      return usedCoupons.value
    case 'expired':
      return expiredCoupons.value
    default:
      return []
  }
})

// 标签切换
const onTabChange = (name: string) => {
  activeTab.value = name
}

// 使用优惠券
const useCoupon = (coupon: any) => {
  showToast('跳转到商家页面使用优惠券')
  router.push('/category')
}

// 去首页
const goToHome = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
.coupon-page {
  min-height: 100vh;
  background-color: $background-color;
}

.coupon-tabs {
  :deep(.van-tabs__nav) {
    background-color: $white;
  }
}

.coupon-list {
  padding: $padding-md;
}

.coupon-item {
  display: flex;
  background: $white;
  border-radius: $border-radius-lg;
  margin-bottom: $padding-md;
  overflow: hidden;
  position: relative;
  
  &.available {
    .coupon-left {
      background: linear-gradient(135deg, $primary-color, #40a9ff);
    }
  }
  
  &.used, &.expired {
    opacity: 0.6;
    
    .coupon-left {
      background: $gray-6;
    }
  }
}

.coupon-left {
  width: 100px;
  padding: $padding-lg;
  color: $white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .amount {
    font-size: $font-size-xl;
    font-weight: bold;
    margin-bottom: $padding-xs;
  }
  
  .condition {
    font-size: $font-size-sm;
    opacity: 0.9;
  }
}

.coupon-right {
  flex: 1;
  padding: $padding-lg;
  
  .title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $padding-xs;
  }
  
  .desc {
    font-size: $font-size-md;
    color: $text-color-2;
    margin-bottom: $padding-sm;
  }
  
  .expire {
    font-size: $font-size-sm;
    color: $text-color-3;
  }
}

.coupon-action {
  padding: $padding-lg;
  display: flex;
  align-items: center;
}

.coupon-status {
  position: absolute;
  right: $padding-lg;
  top: 50%;
  transform: translateY(-50%);
  font-size: $font-size-sm;
  color: $text-color-3;
}
</style>
