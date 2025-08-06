<template>
  <div class="user-agreement-page">
    <NavBar title="用户协议" left-arrow @click-left="$router.back()" />
    
    <div class="agreement-content">
      <div class="agreement-header">
        <h2>Vue3饿了吗用户服务协议</h2>
        <p class="update-time">最后更新时间：2024年1月1日</p>
      </div>
      
      <div class="agreement-body">
        <section class="agreement-section">
          <h3>1. 服务条款的确认和接纳</h3>
          <p>欢迎使用Vue3饿了吗服务！请您仔细阅读以下条款，如果您不同意本协议的任意内容，请不要注册或使用Vue3饿了吗服务。</p>
        </section>
        
        <section class="agreement-section">
          <h3>2. 服务简介</h3>
          <p>Vue3饿了吗是一个基于Vue3技术栈开发的外卖订餐平台，为用户提供便捷的在线订餐服务。</p>
          <ul>
            <li>浏览商家和商品信息</li>
            <li>在线下单和支付</li>
            <li>订单跟踪和管理</li>
            <li>用户评价和反馈</li>
          </ul>
        </section>
        
        <section class="agreement-section">
          <h3>3. 用户注册</h3>
          <p>用户在使用本服务前需要注册一个账户。用户应当提供真实、准确、完整的个人信息。</p>
          <ul>
            <li>用户必须年满18周岁</li>
            <li>一个手机号码只能注册一个账户</li>
            <li>用户对账户和密码的安全负责</li>
          </ul>
        </section>
        
        <section class="agreement-section">
          <h3>4. 用户行为规范</h3>
          <p>用户在使用服务时应当遵守以下规范：</p>
          <ul>
            <li>不得发布虚假信息</li>
            <li>不得恶意评价商家</li>
            <li>不得进行欺诈行为</li>
            <li>遵守相关法律法规</li>
          </ul>
        </section>
        
        <section class="agreement-section">
          <h3>5. 订单和支付</h3>
          <p>用户下单后应当按照约定支付订单金额。订单一经确认，用户不得随意取消。</p>
        </section>
        
        <section class="agreement-section">
          <h3>6. 退款政策</h3>
          <p>在以下情况下，用户可以申请退款：</p>
          <ul>
            <li>商家无法履行订单</li>
            <li>商品质量问题</li>
            <li>配送超时</li>
          </ul>
        </section>
        
        <section class="agreement-section">
          <h3>7. 知识产权</h3>
          <p>Vue3饿了吗的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法保护。</p>
        </section>
        
        <section class="agreement-section">
          <h3>8. 免责声明</h3>
          <p>Vue3饿了吗仅作为信息平台，对于商家提供的商品和服务质量不承担直接责任。</p>
        </section>
        
        <section class="agreement-section">
          <h3>9. 协议修改</h3>
          <p>Vue3饿了吗有权随时修改本协议条款。修改后的协议将在平台上公布，用户继续使用服务即视为同意修改后的协议。</p>
        </section>
        
        <section class="agreement-section">
          <h3>10. 联系我们</h3>
          <p>如果您对本协议有任何疑问，请通过以下方式联系我们：</p>
          <ul>
            <li>客服电话：400-123-4567</li>
            <li>客服邮箱：support@vue3-eleme.com</li>
            <li>在线客服：工作时间 9:00-22:00</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/Layout/NavBar.vue'
</script>

<style lang="scss" scoped>
.user-agreement-page {
  min-height: 100vh;
  background-color: $background-color;
}

.agreement-content {
  padding: $padding-md;
}

.agreement-header {
  text-align: center;
  margin-bottom: $padding-xl;
  
  h2 {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 $padding-sm;
  }
  
  .update-time {
    font-size: $font-size-sm;
    color: $text-color-3;
    margin: 0;
  }
}

.agreement-body {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $padding-lg;
}

.agreement-section {
  margin-bottom: $padding-xl;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    margin: 0 0 $padding-md;
    padding-bottom: $padding-sm;
    border-bottom: 2px solid $primary-color;
  }
  
  p {
    font-size: $font-size-md;
    color: $text-color-2;
    line-height: 1.6;
    margin: 0 0 $padding-md;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    margin: $padding-md 0;
    padding-left: $padding-lg;
    
    li {
      font-size: $font-size-md;
      color: $text-color-2;
      line-height: 1.6;
      margin-bottom: $padding-xs;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
