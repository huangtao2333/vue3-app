<template>
  <div class="customer-service-page">
    <NavBar title="客服中心" left-arrow @click-left="$router.back()" />
    
    <div class="service-content">
      <!-- 快速联系 -->
      <div class="quick-contact">
        <h3 class="section-title">快速联系</h3>
        <div class="contact-methods">
          <div class="contact-item" @click="startChat">
            <van-icon name="chat-o" size="32" color="#1989fa" />
            <span>在线客服</span>
            <p>工作时间：9:00-22:00</p>
          </div>
          
          <div class="contact-item" @click="callPhone">
            <van-icon name="phone-o" size="32" color="#07c160" />
            <span>电话客服</span>
            <p>400-123-4567</p>
          </div>
        </div>
      </div>
      
      <!-- 常见问题 -->
      <div class="faq-section">
        <h3 class="section-title">常见问题</h3>
        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-for="faq in faqList"
            :key="faq.id"
            :title="faq.question"
            :name="faq.id"
          >
            <div class="faq-answer">{{ faq.answer }}</div>
          </van-collapse-item>
        </van-collapse>
      </div>
      
      <!-- 帮助分类 -->
      <div class="help-categories">
        <h3 class="section-title">帮助分类</h3>
        <van-grid :column-num="2" :border="false">
          <van-grid-item
            v-for="category in helpCategories"
            :key="category.id"
            :icon="category.icon"
            :text="category.name"
            @click="goToHelp(category)"
          />
        </van-grid>
      </div>
      
      <!-- 意见反馈 -->
      <div class="feedback-section">
        <van-cell
          title="意见反馈"
          is-link
          icon="edit"
          @click="goToFeedback"
        >
          <template #label>
            <span>告诉我们您的建议</span>
          </template>
        </van-cell>
      </div>
    </div>
    
    <!-- 在线客服弹窗 -->
    <van-popup
      v-model:show="showChat"
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="chat-container">
        <div class="chat-header">
          <h4>在线客服</h4>
          <van-icon name="cross" @click="showChat = false" />
        </div>
        
        <div class="chat-messages">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="['message', message.type]"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        
        <div class="chat-input">
          <van-field
            v-model="inputMessage"
            placeholder="请输入您的问题..."
            @keyup.enter="sendMessage"
          >
            <template #button>
              <van-button size="small" type="primary" @click="sendMessage">
                发送
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'

const router = useRouter()

// 折叠面板激活项
const activeNames = ref(['1'])

// 在线客服
const showChat = ref(false)
const inputMessage = ref('')
const chatMessages = ref([
  {
    id: 1,
    type: 'service',
    content: '您好！我是智能客服小助手，有什么可以帮助您的吗？',
    time: '14:30'
  }
])

// 常见问题
const faqList = [
  {
    id: '1',
    question: '如何取消订单？',
    answer: '在订单详情页面，如果订单状态为"待接单"，您可以点击"取消订单"按钮进行取消。已接单的订单需要联系客服处理。'
  },
  {
    id: '2',
    question: '配送费如何计算？',
    answer: '配送费根据距离和时段动态计算，一般在2-8元之间。部分商家提供满减免配送费活动。'
  },
  {
    id: '3',
    question: '如何使用优惠券？',
    answer: '在结算页面选择可用的优惠券，系统会自动计算优惠金额。请注意优惠券的使用条件和有效期。'
  },
  {
    id: '4',
    question: '退款多久到账？',
    answer: '退款一般在1-3个工作日内到账，具体到账时间取决于您的支付方式和银行处理速度。'
  }
]

// 帮助分类
const helpCategories = [
  { id: 1, name: '订单问题', icon: 'orders-o' },
  { id: 2, name: '支付问题', icon: 'gold-coin-o' },
  { id: 3, name: '配送问题', icon: 'logistics' },
  { id: 4, name: '账户问题', icon: 'manager-o' }
]

// 开始聊天
const startChat = () => {
  showChat.value = true
}

// 拨打电话
const callPhone = () => {
  showToast('拨打客服电话：400-123-4567')
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return
  
  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'user',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString().slice(0, 5)
  })
  
  const userMessage = inputMessage.value
  inputMessage.value = ''
  
  // 模拟客服回复
  setTimeout(() => {
    chatMessages.value.push({
      id: Date.now(),
      type: 'service',
      content: `收到您的问题："${userMessage}"，我们会尽快为您处理。`,
      time: new Date().toLocaleTimeString().slice(0, 5)
    })
  }, 1000)
}

// 跳转到帮助页面
const goToHelp = (category: any) => {
  showToast(`查看${category.name}帮助`)
}

// 跳转到意见反馈
const goToFeedback = () => {
  router.push('/feedback')
}
</script>

<style lang="scss" scoped>
.customer-service-page {
  min-height: 100vh;
  background-color: $background-color;
}

.service-content {
  padding-bottom: $padding-xl;
}

.section-title {
  padding: $padding-lg $padding-md $padding-md;
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  margin: 0;
  background: $white;
}

.quick-contact {
  background: $white;
  margin-bottom: $padding-lg;
  
  .contact-methods {
    display: flex;
    padding: $padding-md;
    gap: $padding-md;
  }
  
  .contact-item {
    flex: 1;
    text-align: center;
    padding: $padding-lg;
    border: 1px solid $border-color;
    border-radius: $border-radius-lg;
    cursor: pointer;
    
    &:hover {
      background: $background-color;
    }
    
    span {
      display: block;
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-color;
      margin: $padding-sm 0;
    }
    
    p {
      font-size: $font-size-sm;
      color: $text-color-3;
      margin: 0;
    }
  }
}

.faq-section {
  background: $white;
  margin-bottom: $padding-lg;
  
  .faq-answer {
    padding: $padding-md;
    color: $text-color-2;
    line-height: 1.6;
  }
}

.help-categories {
  background: $white;
  margin-bottom: $padding-lg;
}

.feedback-section {
  background: $white;
}

// 聊天弹窗样式
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $padding-md;
  border-bottom: 1px solid $border-color;
  
  h4 {
    margin: 0;
    font-size: $font-size-lg;
    color: $text-color;
  }
}

.chat-messages {
  flex: 1;
  padding: $padding-md;
  overflow-y: auto;
}

.message {
  margin-bottom: $padding-md;
  
  &.user {
    text-align: right;
    
    .message-content {
      background: $primary-color;
      color: $white;
      margin-left: 20%;
    }
  }
  
  &.service {
    text-align: left;
    
    .message-content {
      background: $gray-1;
      color: $text-color;
      margin-right: 20%;
    }
  }
  
  .message-content {
    display: inline-block;
    padding: $padding-sm $padding-md;
    border-radius: $border-radius-lg;
    max-width: 80%;
    word-wrap: break-word;
  }
  
  .message-time {
    font-size: $font-size-xs;
    color: $text-color-3;
    margin-top: $padding-xs;
  }
}

.chat-input {
  padding: $padding-md;
  border-top: 1px solid $border-color;
}

:deep(.van-collapse-item__title) {
  font-size: $font-size-md;
}

:deep(.van-grid-item__content) {
  padding: $padding-lg $padding-md;
}
</style>
