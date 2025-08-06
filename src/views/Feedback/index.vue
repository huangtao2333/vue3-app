<template>
  <div class="feedback-page">
    <NavBar title="意见反馈" left-arrow @click-left="$router.back()" />
    
    <div class="feedback-content">
      <van-form @submit="submitFeedback">
        <!-- 反馈类型 -->
        <van-field
          v-model="form.type"
          name="type"
          label="反馈类型"
          placeholder="请选择反馈类型"
          readonly
          is-link
          @click="showTypePicker = true"
          :rules="[{ required: true, message: '请选择反馈类型' }]"
        />
        
        <!-- 问题描述 -->
        <van-field
          v-model="form.content"
          name="content"
          label="问题描述"
          type="textarea"
          placeholder="请详细描述您遇到的问题或建议"
          rows="4"
          maxlength="500"
          show-word-limit
          :rules="[{ required: true, message: '请输入问题描述' }]"
        />
        
        <!-- 联系方式 -->
        <van-field
          v-model="form.contact"
          name="contact"
          label="联系方式"
          placeholder="请输入手机号或邮箱（选填）"
        />
        
        <!-- 图片上传 -->
        <van-field name="images" label="相关图片">
          <template #input>
            <van-uploader
              v-model="form.images"
              multiple
              :max-count="3"
              :after-read="afterRead"
            />
          </template>
        </van-field>
        
        <!-- 提交按钮 -->
        <div class="submit-section">
          <van-button
            type="primary"
            native-type="submit"
            block
            :loading="submitting"
          >
            提交反馈
          </van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 反馈类型选择器 -->
    <van-popup v-model:show="showTypePicker" position="bottom">
      <van-picker
        :columns="typeOptions"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import NavBar from '@/components/Layout/NavBar.vue'

const router = useRouter()

// 表单数据
const form = ref({
  type: '',
  content: '',
  contact: '',
  images: []
})

// 提交状态
const submitting = ref(false)

// 类型选择器
const showTypePicker = ref(false)
const typeOptions = [
  '功能异常',
  '界面问题',
  '性能问题',
  '功能建议',
  '其他问题'
]

// 确认选择类型
const onTypeConfirm = ({ selectedValues }: any) => {
  form.value.type = selectedValues[0]
  showTypePicker.value = false
}

// 图片上传后处理
const afterRead = (file: any) => {
  console.log('上传图片:', file)
  // 这里可以处理图片上传逻辑
}

// 提交反馈
const submitFeedback = async () => {
  submitting.value = true
  
  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showToast('反馈提交成功，我们会尽快处理')
    
    // 清空表单
    form.value = {
      type: '',
      content: '',
      contact: '',
      images: []
    }
    
    // 返回上一页
    setTimeout(() => {
      router.back()
    }, 1500)
    
  } catch (error) {
    showToast('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.feedback-page {
  min-height: 100vh;
  background-color: $background-color;
}

.feedback-content {
  padding: $padding-md;
}

.submit-section {
  padding: $padding-xl $padding-md;
}

:deep(.van-field__label) {
  width: 80px;
}

:deep(.van-uploader) {
  .van-uploader__upload {
    margin: 0;
  }
}
</style>
