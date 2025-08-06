<template>
  <div class="login-page">
    <NavBar title="登录" left-arrow />
    
    <div class="login-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">🍔</div>
        <h1 class="app-name">Vue3饿了吗</h1>
        <p class="app-desc">美食就在身边</p>
      </div>
      
      <!-- 登录表单 -->
      <div class="login-form">
        <van-form @submit="handleLogin">
          <van-field
            v-model="form.phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="phoneRules"
            maxlength="11"
            clearable
          />
          
          <van-field
            v-if="loginType === 'password'"
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="passwordRules"
            clearable
          />
          
          <van-field
            v-if="loginType === 'sms'"
            v-model="form.smsCode"
            label="验证码"
            placeholder="请输入验证码"
            :rules="smsCodeRules"
            clearable
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="smsCountdown > 0"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '发送验证码' }}
              </van-button>
            </template>
          </van-field>
          
          <div class="login-type-switch">
            <van-button
              type="primary"
              plain
              size="small"
              @click="switchLoginType"
            >
              {{ loginType === 'password' ? '短信验证码登录' : '密码登录' }}
            </van-button>
          </div>
          
          <van-button
            type="primary"
            size="large"
            block
            :loading="loading"
            native-type="submit"
            class="login-button"
          >
            登录
          </van-button>
        </van-form>
        
        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          
          <div class="third-party-buttons">
            <van-button
              icon="wechat"
              type="success"
              size="large"
              @click="wechatLogin"
            >
              微信登录
            </van-button>
          </div>
        </div>
        
        <!-- 协议 -->
        <div class="agreement">
          <van-checkbox v-model="agreeTerms">
            我已阅读并同意
            <span class="link" @click="showTerms">《用户协议》</span>
            和
            <span class="link" @click="showPrivacy">《隐私政策》</span>
          </van-checkbox>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          <span>还没有账号？</span>
          <span class="link" @click="goToRegister">立即注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import NavBar from '@/components/Layout/NavBar.vue'
import { showToast } from 'vant'

const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const loginType = ref<'password' | 'sms'>('password')
const loading = ref(false)
const agreeTerms = ref(false)
const smsCountdown = ref(0)

// 表单数据
const form = reactive({
  phone: '',
  password: '',
  smsCode: ''
})

// 表单验证规则
const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码至少6位' }
]

const smsCodeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
]

// 切换登录方式
const switchLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'sms' : 'password'
  // 清空相关字段
  if (loginType.value === 'password') {
    form.smsCode = ''
  } else {
    form.password = ''
  }
}

// 发送短信验证码
const sendSmsCode = async () => {
  if (!form.phone) {
    showToast('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  try {
    // TODO: 调用发送短信验证码API
    console.log('发送短信验证码:', form.phone)
    
    // 开始倒计时
    smsCountdown.value = 60
    const timer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    showToast('验证码已发送')
  } catch (error) {
    console.error('发送短信验证码失败:', error)
  }
}

// 处理登录
const handleLogin = async () => {
  if (!agreeTerms.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }
  
  loading.value = true
  
  try {
    // TODO: 调用登录API
    const loginData = {
      phone: form.phone,
      type: loginType.value,
      ...(loginType.value === 'password' 
        ? { password: form.password }
        : { smsCode: form.smsCode }
      )
    }
    
    console.log('登录数据:', loginData)
    
    // 模拟登录成功
    const userInfo = {
      id: '1',
      phone: form.phone,
      nickname: '用户' + form.phone.slice(-4),
      avatar: '/banner1.jpg'
    }
    
    // 保存用户信息
    appStore.setUserInfo(userInfo)
    
    showToast('登录成功')
    
    // 跳转到首页或返回上一页
    router.replace('/home')
  } catch (error) {
    console.error('登录失败:', error)
    showToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 微信登录
const wechatLogin = () => {
  if (!agreeTerms.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }
  
  // TODO: 实现微信登录
  console.log('微信登录')
}

// 显示用户协议
const showTerms = () => {
  router.push('/user-agreement')
}

// 显示隐私政策
const showPrivacy = () => {
  router.push('/privacy-policy')
}

// 跳转到注册
const goToRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color, #40a9ff);
}

.login-content {
  padding: $padding-xl;
}

.logo-section {
  text-align: center;
  padding: $padding-xl 0;
  color: $white;
  
  .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: $padding-md;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .app-name {
    font-size: $font-size-xl * 1.5;
    font-weight: 600;
    margin-bottom: $padding-xs;
  }
  
  .app-desc {
    font-size: $font-size-md;
    opacity: 0.8;
  }
}

.login-form {
  background-color: $white;
  border-radius: $border-radius-xl;
  padding: $padding-xl;
  
  .login-type-switch {
    text-align: center;
    margin: $padding-lg 0;
  }
  
  .login-button {
    margin-top: $padding-lg;
  }
}

.third-party-login {
  margin-top: $padding-xl;
  
  .divider {
    position: relative;
    text-align: center;
    margin: $padding-lg 0;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: $border-color;
    }
    
    span {
      background-color: $white;
      padding: 0 $padding-md;
      font-size: $font-size-sm;
      color: $text-color-3;
    }
  }
  
  .third-party-buttons {
    display: flex;
    justify-content: center;
  }
}

.agreement {
  margin-top: $padding-lg;
  text-align: center;
  
  :deep(.van-checkbox) {
    justify-content: center;
    
    .van-checkbox__label {
      font-size: $font-size-sm;
      color: $text-color-3;
    }
  }
  
  .link {
    color: $primary-color;
    cursor: pointer;
  }
}

.register-link {
  text-align: center;
  margin-top: $padding-lg;
  color: $text-color-2;

  .link {
    color: $primary-color;
    font-weight: 600;
    cursor: pointer;
    margin-left: $padding-xs;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
