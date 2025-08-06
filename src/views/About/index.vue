<template>
  <div class="about-page">
    <NavBar title="关于我们" left-arrow @click-left="$router.back()" />
    
    <div class="about-content">
      <!-- 应用信息 -->
      <div class="app-info">
        <div class="app-logo">🍔</div>
        <h2 class="app-name">Vue3饿了吗</h2>
        <p class="app-version">版本 v1.0.0</p>
        <p class="app-desc">基于Vue3的高性能外卖应用</p>
      </div>
      
      <!-- 功能介绍 -->
      <div class="feature-section">
        <h3 class="section-title">主要功能</h3>
        <div class="feature-list">
          <div class="feature-item">
            <van-icon name="shop-o" size="24" color="#1989fa" />
            <div class="feature-content">
              <h4>商家浏览</h4>
              <p>浏览附近优质商家，查看详细信息</p>
            </div>
          </div>
          
          <div class="feature-item">
            <van-icon name="shopping-cart-o" size="24" color="#1989fa" />
            <div class="feature-content">
              <h4>在线下单</h4>
              <p>便捷的购物车功能，快速下单</p>
            </div>
          </div>
          
          <div class="feature-item">
            <van-icon name="logistics" size="24" color="#1989fa" />
            <div class="feature-content">
              <h4>订单跟踪</h4>
              <p>实时跟踪订单状态，配送进度</p>
            </div>
          </div>
          
          <div class="feature-item">
            <van-icon name="location-o" size="24" color="#1989fa" />
            <div class="feature-content">
              <h4>地址管理</h4>
              <p>管理收货地址，支持多地址切换</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 技术栈 -->
      <div class="tech-section">
        <h3 class="section-title">技术栈</h3>
        <div class="tech-tags">
          <van-tag type="primary">Vue 3</van-tag>
          <van-tag type="success">TypeScript</van-tag>
          <van-tag type="warning">Vite</van-tag>
          <van-tag type="danger">Pinia</van-tag>
          <van-tag>Vue Router</van-tag>
          <van-tag>Vant UI</van-tag>
          <van-tag>SCSS</van-tag>
          <van-tag>PWA</van-tag>
        </div>
      </div>
      
      <!-- 联系我们 -->
      <div class="contact-section">
        <h3 class="section-title">联系我们</h3>
        <van-cell-group>
          <van-cell
            title="官方网站"
            value="www.vue3-eleme.com"
            is-link
            @click="openWebsite"
          />
          <van-cell
            title="客服邮箱"
            value="support@vue3-eleme.com"
            is-link
            @click="sendEmail"
          />
          <van-cell
            title="客服电话"
            value="400-123-4567"
            is-link
            @click="callPhone"
          />
        </van-cell-group>
      </div>
      
      <!-- 版权信息 -->
      <div class="copyright">
        <p>© 2024 Vue3饿了吗. All rights reserved.</p>
        <p>本应用仅供学习交流使用</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'

// 打开官网
const openWebsite = () => {
  showToast('跳转到官方网站')
}

// 发送邮件
const sendEmail = () => {
  showToast('打开邮件客户端')
}

// 拨打电话
const callPhone = () => {
  showToast('拨打客服电话')
}
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background-color: $background-color;
}

.about-content {
  padding-bottom: $padding-xl;
}

.app-info {
  text-align: center;
  padding: $padding-xl $padding-md;
  background: $white;
  margin-bottom: $padding-lg;
  
  .app-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto $padding-md;
  }
  
  .app-name {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 $padding-xs;
  }
  
  .app-version {
    font-size: $font-size-md;
    color: $text-color-2;
    margin: 0 0 $padding-sm;
  }
  
  .app-desc {
    font-size: $font-size-md;
    color: $text-color-3;
    margin: 0;
  }
}

.feature-section, .tech-section, .contact-section {
  background: $white;
  margin-bottom: $padding-lg;
  
  .section-title {
    padding: $padding-lg $padding-md $padding-md;
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    margin: 0;
    border-bottom: 1px solid $border-color;
  }
}

.feature-list {
  padding: $padding-md;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: $padding-md 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
  
  .feature-content {
    margin-left: $padding-md;
    flex: 1;
    
    h4 {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-color;
      margin: 0 0 $padding-xs;
    }
    
    p {
      font-size: $font-size-sm;
      color: $text-color-3;
      margin: 0;
    }
  }
}

.tech-tags {
  padding: $padding-md;
  display: flex;
  flex-wrap: wrap;
  gap: $padding-sm;
}

.copyright {
  text-align: center;
  padding: $padding-xl $padding-md;
  color: $text-color-3;
  font-size: $font-size-sm;
  
  p {
    margin: $padding-xs 0;
  }
}

:deep(.van-cell-group) {
  margin: 0;
}
</style>
