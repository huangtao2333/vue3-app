<template>
  <div class="order-detail-page">
    <NavBar title="订单详情" left-arrow />
    
    <div class="order-detail-content">
      <!-- 订单状态 -->
      <div class="order-status-card">
        <div class="status-icon">
          <van-icon :name="getStatusIcon(order?.status)" size="32" />
        </div>
        <div class="status-info">
          <h3>{{ getStatusText(order?.status) }}</h3>
          <p v-if="order?.estimatedTime">预计{{ order.estimatedTime }}分钟送达</p>
        </div>
      </div>
      
      <!-- 配送信息 -->
      <div v-if="order" class="delivery-card">
        <div class="card-header">
          <h4>配送信息</h4>
        </div>
        <div class="delivery-info">
          <div class="address-info">
            <van-icon name="location-o" />
            <div class="address-detail">
              <p class="contact">{{ order.deliveryAddress.name }} {{ order.deliveryAddress.phone }}</p>
              <p class="address">{{ order.deliveryAddress.address }}{{ order.deliveryAddress.detail }}</p>
            </div>
          </div>
          <div class="delivery-time">
            <span>配送时间：{{ order.deliveryTime }}</span>
          </div>
        </div>
      </div>
      
      <!-- 商家信息 -->
      <div v-if="order" class="shop-card">
        <div class="shop-info">
          <img :src="order.shopImage" :alt="order.shopName" />
          <span class="shop-name">{{ order.shopName }}</span>
        </div>
      </div>
      
      <!-- 商品列表 -->
      <div v-if="order" class="products-card">
        <div class="card-header">
          <h4>商品清单</h4>
        </div>
        <div class="product-list">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="product-item"
          >
            <img :src="item.image" :alt="item.name" />
            <div class="product-info">
              <h5>{{ item.name }}</h5>
              <p v-if="item.specs" class="specs">{{ item.specs.join(', ') }}</p>
            </div>
            <div class="product-price">
              <span class="quantity">x{{ item.quantity }}</span>
              <span class="price">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 费用明细 -->
      <div v-if="order" class="cost-card">
        <div class="card-header">
          <h4>费用明细</h4>
        </div>
        <div class="cost-list">
          <div class="cost-item">
            <span>商品总额</span>
            <span>¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="cost-item">
            <span>配送费</span>
            <span>¥{{ order.deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="cost-item">
            <span>包装费</span>
            <span>¥{{ order.packagingFee.toFixed(2) }}</span>
          </div>
          <div v-if="order.discountAmount > 0" class="cost-item discount">
            <span>优惠金额</span>
            <span>-¥{{ order.discountAmount.toFixed(2) }}</span>
          </div>
          <div class="cost-item total">
            <span>实付款</span>
            <span>¥{{ order.actualAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 订单信息 -->
      <div v-if="order" class="order-info-card">
        <div class="card-header">
          <h4>订单信息</h4>
        </div>
        <div class="info-list">
          <div class="info-item">
            <span>订单号</span>
            <span>{{ order.orderNo }}</span>
          </div>
          <div class="info-item">
            <span>下单时间</span>
            <span>{{ formatTime(order.createTime) }}</span>
          </div>
          <div v-if="order.payTime" class="info-item">
            <span>支付时间</span>
            <span>{{ formatTime(order.payTime) }}</span>
          </div>
          <div v-if="order.completeTime" class="info-item">
            <span>完成时间</span>
            <span>{{ formatTime(order.completeTime) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div v-if="order" class="order-actions">
      <van-button
        v-if="order.status === 'pending'"
        type="danger"
        @click="cancelOrder"
      >
        取消订单
      </van-button>
      
      <van-button
        v-if="order.status === 'pending'"
        type="primary"
        @click="payOrder"
      >
        立即支付
      </van-button>
      
      <van-button
        v-if="order.status === 'delivering'"
        type="primary"
        @click="confirmOrder"
      >
        确认收货
      </van-button>
      
      <van-button
        v-if="order.status === 'completed'"
        type="default"
        @click="reorderOrder"
      >
        再来一单
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/Layout/NavBar.vue'
import { getOrderDetail } from '@/api/order'
import { showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()

// 响应式数据
const order = ref(null)

// 获取状态图标
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    pending: 'clock-o',
    confirmed: 'checked',
    preparing: 'fire-o',
    delivering: 'logistics',
    completed: 'success',
    cancelled: 'cross'
  }
  return iconMap[status] || 'clock-o'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '等待支付',
    confirmed: '商家已接单',
    preparing: '正在制作',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN')
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    const orderId = route.params.id as string
    // 模拟订单数据
    order.value = {
      id: orderId,
      orderNo: `ELM${Date.now()}`,
      status: 'delivering',
      shopId: '1',
      shopName: '美味餐厅',
      shopImage: '/banner1.jpg',
      items: [
        {
          id: '1',
          name: '汉堡套餐',
          price: 25.8,
          quantity: 1,
          image: '/banner2.webp',
          specs: ['大份', '微辣']
        },
        {
          id: '2',
          name: '可乐',
          price: 8.5,
          quantity: 2,
          image: '/banner3.webp'
        }
      ],
      totalAmount: 42.8,
      deliveryFee: 3,
      packagingFee: 2,
      discountAmount: 5,
      actualAmount: 42.8,
      deliveryAddress: {
        name: '张三',
        phone: '138****8888',
        address: '北京市朝阳区某某街道',
        detail: '某某小区1号楼2单元301室'
      },
      deliveryTime: '立即送达',
      estimatedTime: 25,
      createTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      payTime: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
  }
}

// 取消订单
const cancelOrder = async () => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: '确定要取消这个订单吗？'
    })
    
    console.log('取消订单')
  } catch {
    // 用户取消
  }
}

// 支付订单
const payOrder = () => {
  console.log('支付订单')
}

// 确认收货
const confirmOrder = async () => {
  try {
    await showConfirmDialog({
      title: '确认收货',
      message: '确认已收到商品吗？'
    })
    
    console.log('确认收货')
  } catch {
    // 用户取消
  }
}

// 再来一单
const reorderOrder = () => {
  console.log('再来一单')
}

// 生命周期
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 80px;
}

.order-detail-content {
  padding: $padding-sm;
}

.order-status-card,
.delivery-card,
.shop-card,
.products-card,
.cost-card,
.order-info-card {
  background-color: $white;
  border-radius: $border-radius-lg;
  margin-bottom: $padding-sm;
  overflow: hidden;
}

.order-status-card {
  display: flex;
  align-items: center;
  padding: $padding-xl;
  text-align: center;
  
  .status-icon {
    margin-right: $padding-lg;
    color: $primary-color;
  }
  
  .status-info {
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $padding-xs;
    }
    
    p {
      font-size: $font-size-sm;
      color: $text-color-3;
    }
  }
}

.card-header {
  padding: $padding-md;
  border-bottom: 1px solid $border-color-light;
  
  h4 {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
  }
}

.delivery-info {
  padding: $padding-md;
  
  .address-info {
    display: flex;
    align-items: flex-start;
    margin-bottom: $padding-md;
    
    .van-icon {
      margin-right: $padding-sm;
      margin-top: 2px;
      color: $primary-color;
    }
    
    .address-detail {
      flex: 1;
      
      .contact {
        font-size: $font-size-md;
        color: $text-color;
        margin-bottom: $padding-xs;
      }
      
      .address {
        font-size: $font-size-sm;
        color: $text-color-2;
        line-height: 1.4;
      }
    }
  }
  
  .delivery-time {
    font-size: $font-size-sm;
    color: $text-color-3;
  }
}

.shop-card {
  padding: $padding-md;
  
  .shop-info {
    display: flex;
    align-items: center;
    
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: $padding-sm;
    }
    
    .shop-name {
      font-size: $font-size-md;
      font-weight: 500;
      color: $text-color;
    }
  }
}

.product-list {
  padding: $padding-md;
  
  .product-item {
    display: flex;
    align-items: center;
    margin-bottom: $padding-md;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    img {
      width: 50px;
      height: 50px;
      border-radius: $border-radius-sm;
      margin-right: $padding-md;
    }
    
    .product-info {
      flex: 1;
      
      h5 {
        font-size: $font-size-md;
        color: $text-color;
        margin-bottom: $padding-xs;
      }
      
      .specs {
        font-size: $font-size-xs;
        color: $text-color-3;
      }
    }
    
    .product-price {
      text-align: right;
      
      .quantity {
        display: block;
        font-size: $font-size-sm;
        color: $text-color-2;
        margin-bottom: $padding-xs;
      }
      
      .price {
        font-size: $font-size-md;
        color: $danger-color;
        font-weight: 600;
      }
    }
  }
}

.cost-list,
.info-list {
  padding: $padding-md;
  
  .cost-item,
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: $padding-sm;
    font-size: $font-size-sm;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.discount {
      color: $success-color;
    }
    
    &.total {
      font-size: $font-size-md;
      font-weight: 600;
      color: $danger-color;
      border-top: 1px solid $border-color-light;
      padding-top: $padding-sm;
      margin-top: $padding-sm;
    }
  }
}

.order-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: $padding-md;
  padding: $padding-md;
  background-color: $white;
  border-top: 1px solid $border-color;
  z-index: $z-index-fixed;
}
</style>
