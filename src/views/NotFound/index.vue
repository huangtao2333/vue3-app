<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-image">
        <img src="/404.png" alt="404" />
      </div>
      
      <h2 class="error-title">页面不存在</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被删除</p>
      
      <div class="error-actions">
        <van-button type="primary" @click="goHome">
          返回首页
        </van-button>
        <van-button @click="goBack">
          返回上页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/home')
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-color;
}

.not-found-content {
  text-align: center;
  padding: $padding-xl;
  
  .error-image {
    margin-bottom: $padding-xl;
    
    img {
      width: 200px;
      height: 200px;
      object-fit: contain;
    }
  }
  
  .error-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $padding-md;
  }
  
  .error-desc {
    font-size: $font-size-md;
    color: $text-color-3;
    margin-bottom: $padding-xl;
    line-height: 1.5;
  }
  
  .error-actions {
    display: flex;
    gap: $padding-md;
    justify-content: center;
  }
}
</style>
