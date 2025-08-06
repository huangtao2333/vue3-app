<template>
  <div class="shop-card" @click="onClick">
    <div class="shop-image">
      <img v-lazy="shop.image" :alt="shop.name" />
      
      <!-- 配送标签 -->
      <div v-if="shop.deliveryTag" class="delivery-tag">
        {{ shop.deliveryTag }}
      </div>
    </div>
    
    <div class="shop-info">
      <div class="shop-header">
        <h3 class="shop-name">{{ shop.name }}</h3>
        <div class="shop-rating">
          <van-rate
            :value="shop.rating"
            :size="12"
            :gutter="2"
            color="#ffd21e"
            void-color="#eee"
            readonly
          />
          <span class="rating-text">{{ shop.rating }}</span>
        </div>
      </div>
      
      <div class="shop-tags">
        <span
          v-for="tag in shop.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      
      <div class="shop-delivery">
        <div class="delivery-info">
          <span class="delivery-fee">配送费 ¥{{ shop.deliveryFee }}</span>
          <span class="delivery-time">{{ shop.deliveryTime }}分钟</span>
        </div>
        <div class="distance">{{ shop.distance }}km</div>
      </div>
      
      <!-- 优惠信息 -->
      <div v-if="shop.promotions && shop.promotions.length" class="promotions">
        <div
          v-for="promotion in shop.promotions.slice(0, 2)"
          :key="promotion.id"
          class="promotion-item"
          :class="promotion.type"
        >
          {{ promotion.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Shop {
  id: string
  name: string
  image: string
  rating: number
  tags: string[]
  deliveryFee: number
  deliveryTime: number
  distance: number
  deliveryTag?: string
  promotions?: Array<{
    id: string
    type: string
    text: string
  }>
}

interface Props {
  shop: Shop
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const onClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.shop-card {
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

.shop-image {
  position: relative;
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
  
  .delivery-tag {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to right, #ff6b35, #f7931e);
    color: $white;
    font-size: $font-size-xs;
    text-align: center;
    padding: 2px;
  }
}

.shop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $padding-xs;
  
  .shop-name {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    @include ellipsis;
    flex: 1;
    margin-right: $padding-sm;
  }
  
  .shop-rating {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
    .rating-text {
      margin-left: $padding-xs;
      font-size: $font-size-sm;
      color: $text-color-2;
    }
  }
}

.shop-tags {
  margin-bottom: $padding-xs;
  
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

.shop-delivery {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $padding-xs;
  
  .delivery-info {
    display: flex;
    align-items: center;
    
    .delivery-fee {
      color: $text-color-2;
      font-size: $font-size-sm;
      margin-right: $padding-md;
    }
    
    .delivery-time {
      color: $text-color-2;
      font-size: $font-size-sm;
    }
  }
  
  .distance {
    color: $text-color-3;
    font-size: $font-size-sm;
  }
}

.promotions {
  display: flex;
  gap: $padding-xs;
  
  .promotion-item {
    padding: 2px $padding-xs;
    font-size: $font-size-xs;
    border-radius: $border-radius-sm;
    color: $white;
    
    &.discount {
      background-color: #ff4d4f;
    }
    
    &.full-reduce {
      background-color: #ff7875;
    }
    
    &.new-user {
      background-color: #52c41a;
    }
  }
}
</style>
