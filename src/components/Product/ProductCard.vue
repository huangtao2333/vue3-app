<template>
  <div class="product-card" @click="showDetail">
    <div class="product-image">
      <img v-lazy="product.image" :alt="product.name" />
    </div>
    
    <div class="product-info">
      <h4 class="product-name">{{ product.name }}</h4>
      <p v-if="product.description" class="product-desc">{{ product.description }}</p>
      
      <div class="product-tags">
        <span
          v-for="tag in product.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      
      <div class="product-footer">
        <div class="price-info">
          <span class="current-price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">
            ¥{{ product.originalPrice }}
          </span>
        </div>
        
        <div class="product-actions">
          <van-stepper
            v-if="currentQuantity > 0"
            :model-value="currentQuantity"
            :min="0"
            @update:model-value="updateQuantity"
            @click.stop
          />
          <van-button
            v-else
            type="primary"
            size="small"
            round
            @click.stop="addToCart"
          >
            <van-icon name="plus" />
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

interface Product {
  id: string
  name: string
  description?: string
  image: string
  price: number
  originalPrice?: number
  tags?: string[]
  specs?: Array<{
    name: string
    options: string[]
  }>
}

interface Props {
  product: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addToCart: [product: Product, specs?: string[]]
}>()

const cartStore = useCartStore()

// 当前商品在购物车中的数量
const currentQuantity = computed(() => {
  return cartStore.getItemQuantity(props.product.id)
})

// 添加到购物车
const addToCart = () => {
  if (props.product.specs && props.product.specs.length > 0) {
    // 有规格的商品，显示规格选择
    showSpecSelector()
  } else {
    // 无规格商品，直接添加
    emit('addToCart', props.product)
  }
}

// 更新数量
const updateQuantity = (quantity: number) => {
  if (quantity === 0) {
    cartStore.removeFromCart(props.product.id)
  } else {
    const diff = quantity - currentQuantity.value
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        emit('addToCart', props.product)
      }
    } else {
      for (let i = 0; i < Math.abs(diff); i++) {
        cartStore.decreaseQuantity(props.product.id)
      }
    }
  }
}

// 显示商品详情
const showDetail = () => {
  // TODO: 显示商品详情弹窗或跳转到详情页
  console.log('显示商品详情:', props.product)
}

// 显示规格选择器
const showSpecSelector = () => {
  // TODO: 显示规格选择器
  console.log('显示规格选择器:', props.product)
}
</script>

<style lang="scss" scoped>
.product-card {
  display: flex;
  padding: $padding-md;
  background-color: $white;
  border-bottom: 1px solid $border-color-light;
  cursor: pointer;
  
  &:hover {
    background-color: $gray-1;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.product-image {
  width: 80px;
  height: 80px;
  margin-right: $padding-md;
  border-radius: $border-radius-md;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-color;
  margin-bottom: $padding-xs;
  @include ellipsis;
}

.product-desc {
  font-size: $font-size-sm;
  color: $text-color-3;
  margin-bottom: $padding-xs;
  @include ellipsis-2;
}

.product-tags {
  margin-bottom: $padding-sm;
  
  .tag {
    display: inline-block;
    padding: 2px $padding-xs;
    margin-right: $padding-xs;
    background-color: $gray-2;
    color: $text-color-2;
    font-size: $font-size-xs;
    border-radius: $border-radius-sm;
  }
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-info {
  display: flex;
  align-items: center;
  
  .current-price {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $danger-color;
  }
  
  .original-price {
    margin-left: $padding-xs;
    font-size: $font-size-sm;
    color: $text-color-3;
    text-decoration: line-through;
  }
}

.product-actions {
  display: flex;
  align-items: center;
}
</style>
