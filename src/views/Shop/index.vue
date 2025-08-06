<template>
  <div class="shop-page">
    <!-- 商家头部信息 -->
    <div class="shop-header">
      <NavBar
        left-arrow
        :title="shop?.name || ''"
        @click-left="goBack"
      />
      
      <div v-if="shop" class="shop-info">
        <div class="shop-banner">
          <img :src="shop.banner" :alt="shop.name" />
        </div>
        
        <div class="shop-details">
          <div class="shop-basic">
            <h2 class="shop-name">{{ shop.name }}</h2>
            <div class="shop-rating">
              <van-rate
                :value="shop.rating"
                :size="14"
                color="#ffd21e"
                readonly
              />
              <span class="rating-text">{{ shop.rating }}</span>
              <span class="sales-text">月售{{ shop.monthlySales }}单</span>
            </div>
          </div>
          
          <div class="delivery-info">
            <span class="delivery-time">{{ shop.deliveryTime }}分钟送达</span>
            <span class="delivery-fee">配送费¥{{ shop.deliveryFee }}</span>
          </div>
          
          <!-- 优惠信息 -->
          <div v-if="shop.promotions" class="promotions">
            <div
              v-for="promotion in shop.promotions"
              :key="promotion.id"
              class="promotion-tag"
            >
              {{ promotion.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 商品分类和列表 -->
    <div class="shop-content">
      <!-- 左侧分类 -->
      <div class="category-sidebar">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
          <span v-if="getCategoryCount(category.id)" class="category-count">
            {{ getCategoryCount(category.id) }}
          </span>
        </div>
      </div>
      
      <!-- 右侧商品列表 -->
      <div class="product-list">
        <div
          v-for="category in categories"
          :key="category.id"
          :ref="el => categoryRefs[category.id] = el"
          class="product-category"
        >
          <h3 class="category-title">{{ category.name }}</h3>
          
          <div class="products">
            <ProductCard
              v-for="product in getProductsByCategory(category.id)"
              :key="product.id"
              :product="product"
              @add-to-cart="addToCart"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 购物车悬浮按钮 -->
    <div v-if="cartStore.totalCount > 0" class="cart-float">
      <van-button
        type="primary"
        round
        size="large"
        @click="showCartDetail = true"
      >
        <van-icon name="shopping-cart-o" />
        <span class="cart-count">{{ cartStore.totalCount }}</span>
        <span class="cart-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
      </van-button>
    </div>
    
    <!-- 购物车详情弹窗 -->
    <van-popup
      v-model:show="showCartDetail"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="cart-detail">
        <div class="cart-header">
          <h3>购物车</h3>
          <van-button type="danger" size="small" @click="clearCart">
            清空
          </van-button>
        </div>
        
        <div class="cart-items">
          <div
            v-for="item in currentShopCartItems"
            :key="`${item.id}-${JSON.stringify(item.specs)}`"
            class="cart-item"
          >
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">¥{{ item.price }}</span>
            </div>
            
            <van-stepper
              :model-value="item.quantity"
              :min="0"
              @update:model-value="updateCartQuantity(item, $event)"
            />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import NavBar from '@/components/Layout/NavBar.vue'
import ProductCard from '@/components/Product/ProductCard.vue'
import { getShopDetail, getShopCategories, getShopProducts } from '@/api/shop'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const shop = ref(null)
const categories = ref([])
const products = ref([])
const activeCategory = ref('')
const showCartDetail = ref(false)
const categoryRefs = ref({})

// 当前商家的购物车商品
const currentShopCartItems = computed(() => {
  const shopId = route.params.id as string
  return cartStore.items.filter(item => item.shopId === shopId)
})

// 获取分类下的商品数量（购物车中）
const getCategoryCount = (categoryId: string) => {
  return currentShopCartItems.value
    .filter(item => {
      const product = products.value.find(p => p.id === item.id)
      return product?.categoryId === categoryId
    })
    .reduce((total, item) => total + item.quantity, 0)
}

// 获取分类下的商品
const getProductsByCategory = (categoryId: string) => {
  return products.value.filter(product => product.categoryId === categoryId)
}

// 获取商家详情
const fetchShopDetail = async () => {
  try {
    const shopId = route.params.id as string
    shop.value = await getShopDetail(shopId)
  } catch (error) {
    console.error('获取商家详情失败:', error)
  }
}

// 获取商品分类
const fetchCategories = async () => {
  try {
    const shopId = route.params.id as string
    categories.value = await getShopCategories(shopId)
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
    }
  } catch (error) {
    console.error('获取商品分类失败:', error)
  }
}

// 获取商品列表
const fetchProducts = async () => {
  try {
    const shopId = route.params.id as string
    products.value = await getShopProducts(shopId)
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

// 选择分类
const selectCategory = (categoryId: string) => {
  activeCategory.value = categoryId
  
  // 滚动到对应分类
  nextTick(() => {
    const element = categoryRefs.value[categoryId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 添加到购物车
const addToCart = (product: any, specs?: string[]) => {
  const shopId = route.params.id as string
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    shopId,
    shopName: shop.value?.name || '',
    specs
  })
}

// 更新购物车数量
const updateCartQuantity = (item: any, quantity: number) => {
  if (quantity === 0) {
    cartStore.removeFromCart(item.id, item.specs)
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

// 清空购物车
const clearCart = () => {
  const shopId = route.params.id as string
  cartStore.clearShopItems(shopId)
  showCartDetail.value = false
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  fetchShopDetail()
  fetchCategories()
  fetchProducts()
})
</script>

<style lang="scss" scoped>
.shop-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.shop-header {
  background-color: $white;
  
  .shop-info {
    .shop-banner {
      height: 120px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .shop-details {
      padding: $padding-md;
      
      .shop-basic {
        margin-bottom: $padding-sm;
        
        .shop-name {
          font-size: $font-size-xl;
          font-weight: 600;
          color: $text-color;
          margin-bottom: $padding-xs;
        }
        
        .shop-rating {
          display: flex;
          align-items: center;
          
          .rating-text {
            margin-left: $padding-xs;
            font-size: $font-size-sm;
            color: $text-color-2;
          }
          
          .sales-text {
            margin-left: $padding-md;
            font-size: $font-size-sm;
            color: $text-color-3;
          }
        }
      }
      
      .delivery-info {
        display: flex;
        gap: $padding-md;
        margin-bottom: $padding-sm;
        
        span {
          font-size: $font-size-sm;
          color: $text-color-2;
        }
      }
      
      .promotions {
        display: flex;
        gap: $padding-xs;
        
        .promotion-tag {
          padding: 2px $padding-xs;
          background-color: $danger-color;
          color: $white;
          font-size: $font-size-xs;
          border-radius: $border-radius-sm;
        }
      }
    }
  }
}

.shop-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-sidebar {
  width: 80px;
  background-color: $gray-1;
  overflow-y: auto;
  
  .category-item {
    position: relative;
    padding: $padding-md $padding-xs;
    text-align: center;
    font-size: $font-size-sm;
    color: $text-color-2;
    cursor: pointer;
    border-bottom: 1px solid $border-color-light;
    
    &.active {
      background-color: $white;
      color: $primary-color;
    }
    
    .category-count {
      position: absolute;
      top: $padding-xs;
      right: $padding-xs;
      background-color: $danger-color;
      color: $white;
      font-size: $font-size-xs;
      padding: 1px 4px;
      border-radius: 8px;
      min-width: 16px;
      height: 16px;
      line-height: 14px;
      text-align: center;
    }
  }
}

.product-list {
  flex: 1;
  background-color: $white;
  overflow-y: auto;
  
  .product-category {
    .category-title {
      position: sticky;
      top: 0;
      background-color: $gray-1;
      padding: $padding-sm $padding-md;
      font-size: $font-size-md;
      font-weight: 500;
      color: $text-color;
      z-index: $z-index-sticky;
    }
    
    .products {
      padding: 0 $padding-md;
    }
  }
}

.cart-float {
  position: fixed;
  bottom: 80px;
  right: $padding-md;
  z-index: $z-index-fixed;
  
  .cart-count {
    margin-left: $padding-xs;
    background-color: $danger-color;
    color: $white;
    font-size: $font-size-xs;
    padding: 1px 4px;
    border-radius: 8px;
    min-width: 16px;
  }
  
  .cart-price {
    margin-left: $padding-xs;
    font-weight: 600;
  }
}

.cart-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-md;
    border-bottom: 1px solid $border-color;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
  }
  
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: $padding-md;
    
    .cart-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $padding-sm 0;
      border-bottom: 1px solid $border-color-light;
      
      .item-info {
        flex: 1;
        
        .item-name {
          display: block;
          font-size: $font-size-md;
          color: $text-color;
          margin-bottom: $padding-xs;
        }
        
        .item-price {
          font-size: $font-size-sm;
          color: $danger-color;
        }
      }
    }
  }
}
</style>
