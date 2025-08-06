<template>
  <div class="product-detail-page">
    <NavBar title="商品详情" left-arrow />
    
    <div class="product-detail-content">
      <!-- 商品图片 -->
      <div class="product-images">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(image, index) in product?.images" :key="index">
            <img :src="image" :alt="product?.name" />
          </van-swipe-item>
        </van-swipe>
      </div>
      
      <!-- 商品信息 -->
      <div v-if="product" class="product-info-card">
        <div class="product-header">
          <h2 class="product-name">{{ product.name }}</h2>
          <div class="product-price">
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ¥{{ product.originalPrice }}
            </span>
          </div>
        </div>
        
        <div v-if="product.description" class="product-desc">
          {{ product.description }}
        </div>
        
        <div v-if="product.tags" class="product-tags">
          <span
            v-for="tag in product.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
        
        <div class="product-stats">
          <span class="sales">月售{{ product.monthlySales || 0 }}份</span>
          <span class="rating">好评率{{ product.rating || 95 }}%</span>
        </div>
      </div>
      
      <!-- 规格选择 -->
      <div v-if="product?.specs && product.specs.length > 0" class="specs-card">
        <div class="card-header">
          <h4>选择规格</h4>
        </div>
        <div class="specs-list">
          <div
            v-for="spec in product.specs"
            :key="spec.name"
            class="spec-group"
          >
            <h5 class="spec-name">{{ spec.name }}</h5>
            <div class="spec-options">
              <div
                v-for="option in spec.options"
                :key="option"
                class="spec-option"
                :class="{ active: selectedSpecs[spec.name] === option }"
                @click="selectSpec(spec.name, option)"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品详情 -->
      <div class="product-detail-card">
        <div class="card-header">
          <h4>商品详情</h4>
        </div>
        <div class="detail-content">
          <div v-if="product?.detailImages" class="detail-images">
            <img
              v-for="(image, index) in product.detailImages"
              :key="index"
              :src="image"
              :alt="`详情图${index + 1}`"
            />
          </div>
          <div v-else class="detail-text">
            <p>{{ product?.detailDescription || '暂无详细描述' }}</p>
          </div>
        </div>
      </div>
      
      <!-- 商家信息 -->
      <div v-if="shop" class="shop-info-card">
        <div class="shop-header">
          <img :src="shop.image" :alt="shop.name" />
          <div class="shop-details">
            <h4>{{ shop.name }}</h4>
            <div class="shop-rating">
              <van-rate
                :value="shop.rating"
                :size="12"
                color="#ffd21e"
                readonly
              />
              <span>{{ shop.rating }}</span>
            </div>
          </div>
          <van-button size="small" @click="goToShop">
            进店
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="product-actions">
      <div class="quantity-control">
        <van-stepper
          v-model="quantity"
          :min="0"
          @change="onQuantityChange"
        />
      </div>
      
      <van-button
        type="warning"
        size="large"
        @click="addToCart"
      >
        加入购物车
      </van-button>
      
      <van-button
        type="primary"
        size="large"
        @click="buyNow"
      >
        立即购买
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import NavBar from '@/components/Layout/NavBar.vue'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const product = ref(null)
const shop = ref(null)
const quantity = ref(1)
const selectedSpecs = reactive({})

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    const productId = route.params.id as string
    
    // 模拟商品数据
    product.value = {
      id: productId,
      name: '经典汉堡套餐',
      price: 25.8,
      originalPrice: 32.8,
      description: '新鲜牛肉饼配生菜、番茄、洋葱，搭配薯条和可乐，经典美味组合',
      images: [
        '/banner1.jpg',
        '/banner2.webp',
        '/banner3.webp'
      ],
      detailImages: [
        '/banner4.webp',
        '/banner1.jpg',
        '/banner2.webp'
      ],
      tags: ['热销', '推荐', '新品'],
      monthlySales: 1234,
      rating: 98,
      specs: [
        {
          name: '规格',
          options: ['小份', '中份', '大份']
        },
        {
          name: '口味',
          options: ['原味', '微辣', '中辣', '特辣']
        }
      ],
      shopId: 'shop1',
      categoryId: '1'
    }
    
    // 模拟商家数据
    shop.value = {
      id: 'shop1',
      name: '美味汉堡店',
      image: '/banner3.webp',
      rating: 4.8
    }
    
    // 初始化默认规格
    if (product.value.specs) {
      product.value.specs.forEach(spec => {
        selectedSpecs[spec.name] = spec.options[0]
      })
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
  }
}

// 选择规格
const selectSpec = (specName: string, option: string) => {
  selectedSpecs[specName] = option
}

// 数量变化
const onQuantityChange = (value: number) => {
  quantity.value = value
}

// 添加到购物车
const addToCart = () => {
  if (!product.value) return
  
  if (quantity.value === 0) {
    showToast('请选择商品数量')
    return
  }
  
  const specs = Object.keys(selectedSpecs).length > 0 
    ? Object.values(selectedSpecs) as string[]
    : undefined
  
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.images[0],
      shopId: product.value.shopId,
      shopName: shop.value?.name || '',
      specs
    })
  }
  
  showToast('已添加到购物车')
}

// 立即购买
const buyNow = () => {
  addToCart()
  router.push('/cart')
}

// 跳转到商家页面
const goToShop = () => {
  router.push(`/shop/${product.value?.shopId}`)
}

// 生命周期
onMounted(() => {
  fetchProductDetail()
})
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 80px;
}

.product-detail-content {
  padding-bottom: $padding-sm;
}

.product-images {
  height: 300px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info-card,
.specs-card,
.product-detail-card,
.shop-info-card {
  background-color: $white;
  margin-bottom: $padding-sm;
}

.product-info-card {
  padding: $padding-lg;
  
  .product-header {
    margin-bottom: $padding-md;
    
    .product-name {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $padding-sm;
      line-height: 1.4;
    }
    
    .product-price {
      display: flex;
      align-items: baseline;
      
      .current-price {
        font-size: $font-size-xl * 1.2;
        font-weight: 600;
        color: $danger-color;
        margin-right: $padding-sm;
      }
      
      .original-price {
        font-size: $font-size-md;
        color: $text-color-3;
        text-decoration: line-through;
      }
    }
  }
  
  .product-desc {
    font-size: $font-size-md;
    color: $text-color-2;
    line-height: 1.5;
    margin-bottom: $padding-md;
  }
  
  .product-tags {
    margin-bottom: $padding-md;
    
    .tag {
      display: inline-block;
      padding: 2px $padding-xs;
      margin-right: $padding-xs;
      background-color: $danger-color;
      color: $white;
      font-size: $font-size-xs;
      border-radius: $border-radius-sm;
    }
  }
  
  .product-stats {
    display: flex;
    gap: $padding-lg;
    font-size: $font-size-sm;
    color: $text-color-3;
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

.specs-list {
  padding: $padding-md;
  
  .spec-group {
    margin-bottom: $padding-lg;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .spec-name {
      font-size: $font-size-md;
      color: $text-color;
      margin-bottom: $padding-sm;
    }
    
    .spec-options {
      display: flex;
      flex-wrap: wrap;
      gap: $padding-sm;
      
      .spec-option {
        padding: $padding-sm $padding-md;
        border: 1px solid $border-color;
        border-radius: $border-radius-md;
        font-size: $font-size-sm;
        color: $text-color-2;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: $primary-color;
        }
        
        &.active {
          border-color: $primary-color;
          background-color: $primary-color;
          color: $white;
        }
      }
    }
  }
}

.detail-content {
  padding: $padding-md;
  
  .detail-images {
    img {
      width: 100%;
      margin-bottom: $padding-sm;
      border-radius: $border-radius-md;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .detail-text {
    p {
      font-size: $font-size-md;
      color: $text-color-2;
      line-height: 1.6;
    }
  }
}

.shop-info-card {
  padding: $padding-md;
  
  .shop-header {
    display: flex;
    align-items: center;
    
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: $padding-md;
    }
    
    .shop-details {
      flex: 1;
      
      h4 {
        font-size: $font-size-md;
        font-weight: 500;
        color: $text-color;
        margin-bottom: $padding-xs;
      }
      
      .shop-rating {
        display: flex;
        align-items: center;
        
        span {
          margin-left: $padding-xs;
          font-size: $font-size-sm;
          color: $text-color-2;
        }
      }
    }
  }
}

.product-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: $padding-md;
  padding: $padding-md;
  background-color: $white;
  border-top: 1px solid $border-color;
  z-index: $z-index-fixed;
  
  .quantity-control {
    margin-right: auto;
  }
}
</style>
