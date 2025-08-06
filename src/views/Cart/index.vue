<template>
  <div class="cart-page">
    <NavBar title="购物车" />
    
    <div class="cart-content">
      <!-- 购物车为空 -->
      <Empty
        v-if="cartStore.isEmpty"
        image="/banner1.jpg"
        description="购物车空空如也"
        button-text="去逛逛"
        @button-click="goToHome"
      />
      
      <!-- 购物车商品 -->
      <div v-else class="cart-list">
        <div
          v-for="(shopItems, shopId) in cartStore.groupedByShop"
          :key="shopId"
          class="shop-group"
        >
          <!-- 商家信息 -->
          <div class="shop-header">
            <van-checkbox
              :model-value="isShopSelected(shopId)"
              @update:model-value="toggleShopSelection(shopId)"
            />
            <span class="shop-name">{{ getShopName(shopItems[0]) }}</span>
          </div>
          
          <!-- 商品列表 -->
          <div class="product-list">
            <div
              v-for="item in shopItems"
              :key="`${item.id}-${JSON.stringify(item.specs)}`"
              class="cart-item"
            >
              <van-checkbox
                :model-value="selectedItems.includes(getItemKey(item))"
                @update:model-value="toggleItemSelection(item)"
              />
              
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <div v-if="item.specs" class="item-specs">
                  {{ item.specs.join(', ') }}
                </div>
                <div class="item-price">¥{{ item.price }}</div>
              </div>
              
              <div class="item-actions">
                <van-stepper
                  :model-value="item.quantity"
                  :min="0"
                  @update:model-value="updateQuantity(item, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部结算栏 -->
    <div v-if="!cartStore.isEmpty" class="cart-footer">
      <div class="footer-left">
        <van-checkbox
          :model-value="isAllSelected"
          @update:model-value="toggleAllSelection"
        >
          全选
        </van-checkbox>
        
        <span class="total-info">
          合计: <span class="total-price">¥{{ selectedTotalPrice }}</span>
        </span>
      </div>
      
      <van-button
        type="primary"
        size="large"
        :disabled="selectedItems.length === 0"
        @click="goToCheckout"
      >
        去结算({{ selectedItems.length }})
      </van-button>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import NavBar from '@/components/Layout/NavBar.vue'
import TabBar from '@/components/Layout/TabBar.vue'
import Empty from '@/components/Common/Empty.vue'

const router = useRouter()
const cartStore = useCartStore()

// 选中的商品
const selectedItems = ref<string[]>([])

// 计算属性
const isAllSelected = computed(() => {
  return selectedItems.value.length === cartStore.items.length && cartStore.items.length > 0
})

const selectedTotalPrice = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(getItemKey(item)))
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2)
})

// 获取商品唯一标识
const getItemKey = (item: any) => {
  return `${item.id}-${JSON.stringify(item.specs)}`
}

// 获取商家名称
const getShopName = (item: any) => {
  return item.shopName || '未知商家'
}

// 检查商家是否全选
const isShopSelected = (shopId: string) => {
  const shopItems = cartStore.groupedByShop[shopId]
  return shopItems.every(item => selectedItems.value.includes(getItemKey(item)))
}

// 切换商家选择状态
const toggleShopSelection = (shopId: string) => {
  const shopItems = cartStore.groupedByShop[shopId]
  const isSelected = isShopSelected(shopId)
  
  shopItems.forEach(item => {
    const itemKey = getItemKey(item)
    if (isSelected) {
      // 取消选择
      const index = selectedItems.value.indexOf(itemKey)
      if (index > -1) {
        selectedItems.value.splice(index, 1)
      }
    } else {
      // 选择
      if (!selectedItems.value.includes(itemKey)) {
        selectedItems.value.push(itemKey)
      }
    }
  })
}

// 切换商品选择状态
const toggleItemSelection = (item: any) => {
  const itemKey = getItemKey(item)
  const index = selectedItems.value.indexOf(itemKey)
  
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemKey)
  }
}

// 切换全选状态
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = cartStore.items.map(item => getItemKey(item))
  }
}

// 更新商品数量
const updateQuantity = (item: any, quantity: number) => {
  if (quantity === 0) {
    cartStore.removeFromCart(item.id, item.specs)
    // 从选中列表中移除
    const itemKey = getItemKey(item)
    const index = selectedItems.value.indexOf(itemKey)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }
  } else {
    const diff = quantity - item.quantity
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        cartStore.increaseQuantity(item.id, item.specs)
      }
    } else {
      for (let i = 0; i < Math.abs(diff); i++) {
        cartStore.decreaseQuantity(item.id, item.specs)
      }
    }
  }
}

// 跳转到首页
const goToHome = () => {
  router.push('/home')
}

// 去结算
const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    return
  }

  // 获取选中的商品信息
  const checkoutItems = selectedItems.value.map(itemKey => {
    // 查找对应的商品（直接通过itemKey匹配）
    const item = cartStore.items.find(item => getItemKey(item) === itemKey)

    if (!item) return null

    return {
      id: item.id,
      name: item.name,
      spec: item.specs?.join(', ') || '默认规格',
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }
  }).filter(item => item !== null) // 过滤掉无效项

  if (checkoutItems.length === 0) {
    showToast('请选择要结算的商品')
    return
  }

  // 跳转到结算页面，传递商品信息
  router.push({
    path: '/checkout',
    query: {
      items: JSON.stringify(checkoutItems)
    }
  })
}
</script>

<style lang="scss" scoped>
.cart-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
}

.cart-list {
  padding: $padding-sm 0;
}

.shop-group {
  background-color: $white;
  margin-bottom: $padding-sm;
  
  .shop-header {
    display: flex;
    align-items: center;
    padding: $padding-md;
    border-bottom: 1px solid $border-color-light;
    
    .shop-name {
      margin-left: $padding-sm;
      font-weight: 500;
      color: $text-color;
    }
  }
}

.product-list {
  .cart-item {
    display: flex;
    align-items: center;
    padding: $padding-md;
    border-bottom: 1px solid $border-color-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 60px;
      height: 60px;
      margin: 0 $padding-md;
      border-radius: $border-radius-md;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .item-info {
      flex: 1;
      
      .item-name {
        font-size: $font-size-md;
        color: $text-color;
        margin-bottom: $padding-xs;
        @include ellipsis;
      }
      
      .item-specs {
        font-size: $font-size-sm;
        color: $text-color-3;
        margin-bottom: $padding-xs;
      }
      
      .item-price {
        font-size: $font-size-lg;
        color: $danger-color;
        font-weight: 600;
      }
    }
    
    .item-actions {
      margin-left: $padding-md;
    }
  }
}

.cart-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $padding-md;
  background-color: $white;
  border-top: 1px solid $border-color;
  z-index: $z-index-fixed;
  
  .footer-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .total-info {
      margin-left: $padding-lg;
      font-size: $font-size-md;
      color: $text-color;
      
      .total-price {
        color: $danger-color;
        font-weight: 600;
        font-size: $font-size-lg;
      }
    }
  }
}
</style>
