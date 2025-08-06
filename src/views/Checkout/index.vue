<template>
  <div class="checkout-page">
    <NavBar title="确认订单" left-arrow @click-left="$router.back()" />
    
    <div class="checkout-content">
      <!-- 收货地址 -->
      <div class="address-section" @click="selectAddress">
        <div v-if="selectedAddress" class="address-info">
          <div class="address-header">
            <van-icon name="location-o" />
            <span class="receiver">{{ selectedAddress.receiver }}</span>
            <span class="phone">{{ selectedAddress.phone }}</span>
          </div>
          <div class="address-detail">{{ selectedAddress.address }}</div>
        </div>
        
        <div v-else class="no-address">
          <van-icon name="add-o" />
          <span>请选择收货地址</span>
        </div>
        
        <van-icon name="arrow" />
      </div>
      
      <!-- 商品列表 -->
      <div class="goods-section">
        <div class="shop-header">
          <van-icon name="shop-o" />
          <span>{{ shopInfo.name }}</span>
        </div>
        
        <div class="goods-list">
          <div
            v-for="item in orderItems"
            :key="item.id"
            class="goods-item"
          >
            <img :src="item.image" :alt="item.name" class="goods-image" />
            <div class="goods-info">
              <h4 class="goods-name">{{ item.name }}</h4>
              <p class="goods-spec">{{ item.spec }}</p>
              <div class="goods-price">
                <span class="price">¥{{ item.price }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 优惠券 -->
      <div class="coupon-section" @click="selectCoupon">
        <div class="coupon-info">
          <van-icon name="coupon-o" />
          <span>优惠券</span>
        </div>
        <div class="coupon-value">
          <span v-if="selectedCoupon">-¥{{ selectedCoupon.amount }}</span>
          <span v-else>请选择</span>
          <van-icon name="arrow" />
        </div>
      </div>
      
      <!-- 配送信息 -->
      <div class="delivery-section">
        <div class="delivery-item">
          <span>配送费</span>
          <span>¥{{ deliveryFee }}</span>
        </div>
        <div class="delivery-item">
          <span>包装费</span>
          <span>¥{{ packagingFee }}</span>
        </div>
      </div>
      
      <!-- 备注 -->
      <div class="remark-section">
        <van-field
          v-model="remark"
          label="备注"
          placeholder="请输入备注信息（选填）"
          maxlength="50"
        />
      </div>
    </div>
    
    <!-- 底部结算 -->
    <div class="checkout-footer">
      <div class="price-info">
        <div class="total-price">
          <span>实付：</span>
          <span class="price">¥{{ finalPrice }}</span>
        </div>
        <div class="original-price" v-if="discount > 0">
          <span>原价：¥{{ originalPrice }}</span>
        </div>
      </div>
      
      <van-button
        type="primary"
        size="large"
        :loading="submitting"
        @click="submitOrder"
      >
        提交订单
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'

const router = useRouter()
const route = useRoute()

// 页面状态
const submitting = ref(false)
const remark = ref('')

// 收货地址
const selectedAddress = ref({
  id: '1',
  receiver: '张三',
  phone: '138****8888',
  address: '北京市朝阳区三里屯街道工体北路8号'
})

// 商家信息
const shopInfo = ref({
  id: '1',
  name: '美味餐厅'
})

// 订单商品
const orderItems = ref([
  {
    id: '1',
    name: '宫保鸡丁',
    spec: '微辣',
    price: 28,
    quantity: 1,
    image: '/banner1.jpg'
  },
  {
    id: '2',
    name: '麻婆豆腐',
    spec: '中辣',
    price: 18,
    quantity: 2,
    image: '/banner2.webp'
  }
])

// 优惠券
const selectedCoupon = ref(null)

// 费用
const deliveryFee = ref(3)
const packagingFee = ref(2)

// 计算价格
const goodsPrice = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

const originalPrice = computed(() => {
  return goodsPrice.value + deliveryFee.value + packagingFee.value
})

const discount = computed(() => {
  return selectedCoupon.value ? selectedCoupon.value.amount : 0
})

const finalPrice = computed(() => {
  return Math.max(0, originalPrice.value - discount.value)
})

// 选择地址
const selectAddress = () => {
  router.push('/address?from=checkout')
}

// 选择优惠券
const selectCoupon = () => {
  router.push('/coupon?from=checkout')
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    showToast('请选择收货地址')
    return
  }
  
  const result = await showConfirmDialog({
    title: '确认下单',
    message: `确认支付 ¥${finalPrice.value} 吗？`
  })
  
  if (result !== 'confirm') return
  
  submitting.value = true
  
  try {
    // 模拟提交订单
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showToast('订单提交成功')
    
    // 跳转到订单详情或支付页面
    router.replace('/order')
    
  } catch (error) {
    showToast('订单提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 页面初始化
onMounted(() => {
  // 从路由参数获取商品信息
  const items = route.query.items
  if (items) {
    try {
      orderItems.value = JSON.parse(items as string)
    } catch (e) {
      console.error('解析商品信息失败:', e)
    }
  }
})
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 80px;
}

.checkout-content {
  padding-bottom: $padding-lg;
}

.address-section {
  background: $white;
  padding: $padding-lg;
  margin-bottom: $padding-sm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  .address-info {
    flex: 1;
    
    .address-header {
      display: flex;
      align-items: center;
      margin-bottom: $padding-xs;
      
      .van-icon {
        color: $primary-color;
        margin-right: $padding-xs;
      }
      
      .receiver {
        font-weight: 600;
        margin-right: $padding-sm;
      }
      
      .phone {
        color: $text-color-2;
      }
    }
    
    .address-detail {
      color: $text-color-2;
      font-size: $font-size-sm;
    }
  }
  
  .no-address {
    flex: 1;
    display: flex;
    align-items: center;
    color: $text-color-3;
    
    .van-icon {
      margin-right: $padding-xs;
    }
  }
}

.goods-section {
  background: $white;
  margin-bottom: $padding-sm;
  
  .shop-header {
    padding: $padding-md $padding-lg;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    
    .van-icon {
      color: $primary-color;
      margin-right: $padding-xs;
    }
    
    span {
      font-weight: 600;
    }
  }
}

.goods-list {
  padding: $padding-md $padding-lg;
}

.goods-item {
  display: flex;
  margin-bottom: $padding-md;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .goods-image {
    width: 60px;
    height: 60px;
    border-radius: $border-radius-md;
    margin-right: $padding-md;
    object-fit: cover;
  }
  
  .goods-info {
    flex: 1;
    
    .goods-name {
      font-size: $font-size-md;
      font-weight: 600;
      margin: 0 0 $padding-xs;
      @include ellipsis;
    }
    
    .goods-spec {
      font-size: $font-size-sm;
      color: $text-color-3;
      margin: 0 0 $padding-xs;
    }
    
    .goods-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price {
        color: $primary-color;
        font-weight: 600;
      }
      
      .quantity {
        color: $text-color-3;
      }
    }
  }
}

.coupon-section, .delivery-section {
  background: $white;
  margin-bottom: $padding-sm;
}

.coupon-section {
  padding: $padding-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  .coupon-info {
    display: flex;
    align-items: center;
    
    .van-icon {
      color: $primary-color;
      margin-right: $padding-xs;
    }
  }
  
  .coupon-value {
    display: flex;
    align-items: center;
    color: $text-color-2;
    
    .van-icon {
      margin-left: $padding-xs;
    }
  }
}

.delivery-section {
  padding: $padding-lg;
  
  .delivery-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: $padding-sm;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    span:first-child {
      color: $text-color-2;
    }
  }
}

.remark-section {
  background: $white;
}

.checkout-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $white;
  padding: $padding-lg;
  border-top: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .price-info {
    .total-price {
      font-size: $font-size-lg;
      
      .price {
        color: $primary-color;
        font-weight: bold;
      }
    }
    
    .original-price {
      font-size: $font-size-sm;
      color: $text-color-3;
      text-decoration: line-through;
    }
  }
}
</style>
