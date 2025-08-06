<template>
  <van-nav-bar
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    :left-arrow="leftArrow"
    :fixed="fixed"
    :placeholder="placeholder"
    :safe-area-inset-top="safeAreaInsetTop"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left v-if="$slots.left">
      <slot name="left" />
    </template>
    
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>
    
    <template #right v-if="$slots.right">
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  leftText?: string
  rightText?: string
  leftArrow?: boolean
  fixed?: boolean
  placeholder?: boolean
  safeAreaInsetTop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftText: '',
  rightText: '',
  leftArrow: false,
  fixed: true,
  placeholder: true,
  safeAreaInsetTop: true
})

const emit = defineEmits<{
  clickLeft: []
  clickRight: []
}>()

const router = useRouter()

const onClickLeft = () => {
  emit('clickLeft')
  if (props.leftArrow) {
    router.back()
  }
}

const onClickRight = () => {
  emit('clickRight')
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: $white;
  border-bottom: 1px solid $border-color;
  
  .van-nav-bar__title {
    color: $text-color;
    font-weight: 500;
  }
  
  .van-nav-bar__left,
  .van-nav-bar__right {
    color: $text-color;
  }
}
</style>
