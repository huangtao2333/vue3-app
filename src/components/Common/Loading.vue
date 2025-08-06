<template>
  <div class="loading-wrapper" :class="{ 'full-screen': fullScreen }">
    <van-loading
      :type="type"
      :color="color"
      :size="size"
      :text-size="textSize"
    >
      {{ text }}
    </van-loading>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'circular' | 'spinner'
  color?: string
  size?: string | number
  textSize?: string | number
  text?: string
  fullScreen?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'circular',
  color: '#1989fa',
  size: '30px',
  textSize: '14px',
  text: '加载中...',
  fullScreen: false
})
</script>

<style lang="scss" scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $padding-xl;
  
  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: $z-index-modal;
  }
}
</style>
