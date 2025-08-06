<template>
  <div class="register-page">
    <div class="register-header">
      <van-nav-bar
        title="注册"
        left-arrow
        @click-left="$router.back()"
      />
    </div>
    
    <div class="register-content">
      <div class="logo-section">
        <div class="logo">🍔</div>
        <h2>欢迎注册Vue3饿了吗</h2>
        <p>享受便捷的外卖服务</p>
      </div>
      
      <van-form @submit="handleRegister">
        <!-- 手机号 -->
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]"
        />
        
        <!-- 验证码 -->
        <van-field
          v-model="form.code"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="codeDisabled"
              @click="sendCode"
            >
              {{ codeText }}
            </van-button>
          </template>
        </van-field>
        
        <!-- 密码 -->
        <van-field
          v-model="form.password"
          name="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' }
          ]"
        />
        
        <!-- 确认密码 -->
        <van-field
          v-model="form.confirmPassword"
          name="confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validatePassword, message: '两次密码不一致' }
          ]"
        />
        
        <!-- 昵称 -->
        <van-field
          v-model="form.nickname"
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        />
        
        <!-- 协议同意 -->
        <div class="agreement-section">
          <van-checkbox v-model="agreeTerms">
            我已阅读并同意
            <span class="link" @click="showUserAgreement">《用户协议》</span>
            和
            <span class="link" @click="showPrivacyPolicy">《隐私政策》</span>
          </van-checkbox>
        </div>
        
        <!-- 注册按钮 -->
        <div class="register-button">
          <van-button
            type="primary"
            native-type="submit"
            block
            :loading="loading"
            :disabled="!agreeTerms"
          >
            注册
          </van-button>
        </div>
      </van-form>
      
      <!-- 登录链接 -->
      <div class="login-link">
        <span>已有账号？</span>
        <span class="link" @click="goToLogin">立即登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

// 表单数据
const form = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

// 状态
const loading = ref(false)
const agreeTerms = ref(false)
const codeDisabled = ref(false)
const codeText = ref('获取验证码')
const countdown = ref(0)

// 密码确认验证
const validatePassword = (value: string) => {
  return value === form.value.password
}

// 发送验证码
const sendCode = async () => {
  if (!form.value.phone) {
    showToast('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  codeDisabled.value = true
  countdown.value = 60
  
  // 模拟发送验证码
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('验证码已发送')
    
    // 开始倒计时
    const timer = setInterval(() => {
      countdown.value--
      codeText.value = `${countdown.value}s后重发`
      
      if (countdown.value <= 0) {
        clearInterval(timer)
        codeDisabled.value = false
        codeText.value = '获取验证码'
      }
    }, 1000)
    
  } catch (error) {
    showToast('验证码发送失败')
    codeDisabled.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  if (!agreeTerms.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 注册成功，保存用户信息
    const userInfo = {
      id: Date.now().toString(),
      phone: form.value.phone,
      nickname: form.value.nickname,
      avatar: '/banner1.jpg'
    }
    
    appStore.setUserInfo(userInfo)
    showToast('注册成功')
    
    // 跳转到首页
    router.replace('/home')
    
  } catch (error) {
    showToast('注册失败，请重试')
  } finally {
    loading.value = false
  }
}

// 显示用户协议
const showUserAgreement = () => {
  router.push('/user-agreement')
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  router.push('/privacy-policy')
}

// 跳转到登录
const goToLogin = () => {
  router.replace('/login')
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, #40a9ff 100%);
}

.register-header {
  :deep(.van-nav-bar) {
    background: transparent;
    
    .van-nav-bar__title {
      color: $white;
    }
    
    .van-icon {
      color: $white;
    }
  }
}

.register-content {
  padding: $padding-lg;
}

.logo-section {
  text-align: center;
  margin-bottom: $padding-xl;
  
  .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto $padding-lg;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  
  h2 {
    color: $white;
    font-size: $font-size-xl;
    font-weight: 600;
    margin: 0 0 $padding-sm;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: $font-size-md;
    margin: 0;
  }
}

:deep(.van-form) {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $padding-lg;
  margin-bottom: $padding-lg;
}

:deep(.van-field) {
  padding: $padding-md 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
}

.agreement-section {
  padding: $padding-lg 0;
  
  .link {
    color: $primary-color;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.register-button {
  margin-top: $padding-lg;
}

.login-link {
  text-align: center;
  color: $white;
  
  .link {
    color: $white;
    font-weight: 600;
    cursor: pointer;
    margin-left: $padding-xs;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
