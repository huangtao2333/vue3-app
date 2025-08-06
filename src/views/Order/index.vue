<template>
  <div class="order-page">
    <NavBar title="我的订单" left-arrow />
    
    <!-- 订单状态筛选 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab
        v-for="tab in orderTabs"
        :key="tab.key"
        :title="tab.title"
        :name="tab.key"
      >
        <div class="order-list">
          <!-- 订单列表 -->
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-item"
            @click="goToOrderDetail(order.id)"
          >
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="shop-info">
                <img :src="order.shopImage" :alt="order.shopName" />
                <span class="shop-name">{{ order.shopName }}</span>
              </div>
              <span class="order-status" :class="order.status">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <!-- 订单商品 -->
            <div class="order-products">
              <div
                v-for="item in order.items.slice(0, 3)"
                :key="item.id"
                class="product-item"
              >
                <img :src="item.image" :alt="item.name" />
                <div class="product-info">
                  <span class="product-name">{{ item.name }}</span>
                  <span class="product-specs" v-if="item.specs">
                    {{ item.specs.join(', ') }}
                  </span>
                </div>
                <span class="product-quantity">x{{ item.quantity }}</span>
              </div>
              
              <div v-if="order.items.length > 3" class="more-products">
                还有{{ order.items.length - 3 }}件商品
              </div>
            </div>
            
            <!-- 订单金额 -->
            <div class="order-amount">
              <span>实付款：</span>
              <span class="amount">¥{{ order.actualAmount.toFixed(2) }}</span>
            </div>
            
            <!-- 订单操作 -->
            <div class="order-actions">
              <van-button
                v-if="order.status === 'pending'"
                type="danger"
                size="small"
                @click.stop="cancelOrder(order.id)"
              >
                取消订单
              </van-button>
              
              <van-button
                v-if="order.status === 'pending'"
                type="primary"
                size="small"
                @click.stop="payOrder(order.id)"
              >
                立即支付
              </van-button>
              
              <van-button
                v-if="order.status === 'delivering'"
                type="primary"
                size="small"
                @click.stop="confirmOrder(order.id)"
              >
                确认收货
              </van-button>
              
              <van-button
                v-if="order.status === 'completed'"
                type="default"
                size="small"
                @click.stop="reorderOrder(order.id)"
              >
                再来一单
              </van-button>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <Loading v-if="loading" />
          
          <!-- 空状态 -->
          <Empty
            v-if="!loading && orders.length === 0"
            description="暂无订单"
            button-text="去逛逛"
            @button-click="goToHome"
          />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import NavBar from '@/components/Layout/NavBar.vue'
import Loading from '@/components/Common/Loading.vue'
import Empty from '@/components/Common/Empty.vue'
import { getOrderList } from '@/api/order'
import { showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// 响应式数据
const activeTab = ref('all')
const orders = ref([])
const loading = ref(false)

// 订单状态标签
const orderTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待付款' },
  { key: 'confirmed', title: '待接单' },
  { key: 'delivering', title: '配送中' },
  { key: 'completed', title: '已完成' }
]

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待付款',
    confirmed: '待接单',
    preparing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  
  try {
    const status = activeTab.value === 'all' ? undefined : activeTab.value
    const data = await getOrderList({ status, page: 1, pageSize: 20 })
    orders.value = data.list
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换标签
const onTabChange = () => {
  fetchOrders()
}

// 取消订单
const cancelOrder = async (orderId: string) => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: '确定要取消这个订单吗？'
    })
    
    // TODO: 调用取消订单API
    console.log('取消订单:', orderId)
  } catch {
    // 用户取消
  }
}

// 支付订单
const payOrder = (orderId: string) => {
  // TODO: 跳转到支付页面
  console.log('支付订单:', orderId)
}

// 确认收货
const confirmOrder = async (orderId: string) => {
  try {
    await showConfirmDialog({
      title: '确认收货',
      message: '确认已收到商品吗？'
    })
    
    // TODO: 调用确认收货API
    console.log('确认收货:', orderId)
  } catch {
    // 用户取消
  }
}

// 再来一单
const reorderOrder = (orderId: string) => {
  // TODO: 重新下单
  console.log('再来一单:', orderId)
}

// 跳转到订单详情
const goToOrderDetail = (orderId: string) => {
  router.push(`/order/${orderId}`)
}

// 跳转到首页
const goToHome = () => {
  router.push('/home')
}

// 生命周期
onMounted(() => {
  // 从路由参数获取初始状态
  const status = route.query.status as string
  if (status && orderTabs.some(tab => tab.key === status)) {
    activeTab.value = status
  }
  
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background-color: $background-color;
}

.order-list {
  padding: $padding-sm 0;
}

.order-item {
  background-color: $white;
  margin-bottom: $padding-sm;
  padding: $padding-md;
  cursor: pointer;
  
  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $padding-md;
    
    .shop-info {
      display: flex;
      align-items: center;
      
      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: $padding-xs;
      }
      
      .shop-name {
        font-size: $font-size-md;
        font-weight: 500;
        color: $text-color;
      }
    }
    
    .order-status {
      font-size: $font-size-sm;
      
      &.pending {
        color: $warning-color;
      }
      
      &.confirmed,
      &.preparing,
      &.delivering {
        color: $primary-color;
      }
      
      &.completed {
        color: $success-color;
      }
      
      &.cancelled {
        color: $text-color-3;
      }
    }
  }
  
  .order-products {
    margin-bottom: $padding-md;
    
    .product-item {
      display: flex;
      align-items: center;
      margin-bottom: $padding-xs;
      
      img {
        width: 40px;
        height: 40px;
        border-radius: $border-radius-sm;
        margin-right: $padding-sm;
      }
      
      .product-info {
        flex: 1;
        
        .product-name {
          display: block;
          font-size: $font-size-sm;
          color: $text-color;
          margin-bottom: 2px;
          @include ellipsis;
        }
        
        .product-specs {
          font-size: $font-size-xs;
          color: $text-color-3;
        }
      }
      
      .product-quantity {
        font-size: $font-size-sm;
        color: $text-color-2;
      }
    }
    
    .more-products {
      font-size: $font-size-sm;
      color: $text-color-3;
      text-align: center;
      padding: $padding-xs 0;
    }
  }
  
  .order-amount {
    display: flex;
    justify-content: flex-end;
    margin-bottom: $padding-md;
    font-size: $font-size-sm;
    color: $text-color-2;
    
    .amount {
      color: $danger-color;
      font-weight: 600;
      margin-left: $padding-xs;
    }
  }
  
  .order-actions {
    display: flex;
    justify-content: flex-end;
    gap: $padding-sm;
  }
}
</style>
