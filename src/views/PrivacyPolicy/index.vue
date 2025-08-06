<template>
  <div class="privacy-policy-page">
    <NavBar title="隐私政策" left-arrow @click-left="$router.back()" />
    
    <div class="policy-content">
      <div class="policy-header">
        <h2>Vue3饿了吗隐私政策</h2>
        <p class="update-time">最后更新时间：2024年1月1日</p>
      </div>
      
      <div class="policy-body">
        <section class="policy-section">
          <h3>1. 信息收集</h3>
          <p>我们会收集以下类型的信息以提供更好的服务：</p>
          <ul>
            <li><strong>账户信息：</strong>手机号码、昵称、头像等</li>
            <li><strong>订单信息：</strong>订单详情、支付信息、配送地址等</li>
            <li><strong>位置信息：</strong>用于推荐附近商家和配送服务</li>
            <li><strong>设备信息：</strong>设备型号、操作系统、应用版本等</li>
            <li><strong>使用信息：</strong>浏览记录、搜索记录、偏好设置等</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>2. 信息使用</h3>
          <p>我们使用收集的信息用于：</p>
          <ul>
            <li>提供订餐和配送服务</li>
            <li>处理订单和支付</li>
            <li>推荐个性化内容</li>
            <li>改进产品和服务</li>
            <li>客户服务和技术支持</li>
            <li>安全防护和风险控制</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>3. 信息共享</h3>
          <p>我们不会出售、出租或交易您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
          <ul>
            <li><strong>商家合作：</strong>与商家共享订单相关信息以完成配送</li>
            <li><strong>支付处理：</strong>与支付服务提供商共享必要的支付信息</li>
            <li><strong>法律要求：</strong>根据法律法规要求披露信息</li>
            <li><strong>安全保护：</strong>为保护用户和平台安全而必要的信息共享</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>4. 信息存储</h3>
          <p>我们采取以下措施保护您的信息安全：</p>
          <ul>
            <li>数据加密传输和存储</li>
            <li>访问权限控制</li>
            <li>定期安全审计</li>
            <li>员工隐私培训</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>5. Cookie和类似技术</h3>
          <p>我们使用Cookie和类似技术来：</p>
          <ul>
            <li>记住您的登录状态</li>
            <li>保存您的偏好设置</li>
            <li>分析网站使用情况</li>
            <li>提供个性化体验</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>6. 您的权利</h3>
          <p>您对自己的个人信息享有以下权利：</p>
          <ul>
            <li><strong>访问权：</strong>查看我们持有的您的个人信息</li>
            <li><strong>更正权：</strong>更正不准确或不完整的信息</li>
            <li><strong>删除权：</strong>要求删除您的个人信息</li>
            <li><strong>限制权：</strong>限制我们处理您的信息</li>
            <li><strong>反对权：</strong>反对我们处理您的信息</li>
          </ul>
        </section>
        
        <section class="policy-section">
          <h3>7. 儿童隐私</h3>
          <p>我们的服务面向18岁以上的成年人。我们不会故意收集18岁以下儿童的个人信息。</p>
        </section>
        
        <section class="policy-section">
          <h3>8. 政策更新</h3>
          <p>我们可能会不时更新本隐私政策。重大变更时，我们会通过应用内通知或其他方式告知您。</p>
        </section>
        
        <section class="policy-section">
          <h3>9. 联系我们</h3>
          <p>如果您对本隐私政策有任何疑问或建议，请联系我们：</p>
          <ul>
            <li>邮箱：privacy@vue3-eleme.com</li>
            <li>电话：400-123-4567</li>
            <li>地址：北京市朝阳区xxx大厦xxx室</li>
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
.privacy-policy-page {
  min-height: 100vh;
  background-color: $background-color;
}

.policy-content {
  padding: $padding-md;
}

.policy-header {
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

.policy-body {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $padding-lg;
}

.policy-section {
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
      
      strong {
        color: $text-color;
        font-weight: 600;
      }
    }
  }
}
</style>
