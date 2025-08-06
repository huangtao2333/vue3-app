<template>
  <div class="empty-wrapper">
    <van-empty
      :image="image"
      :image-size="imageSize"
      :description="description"
    >
      <template #image v-if="$slots.image">
        <slot name="image" />
      </template>
      
      <template #description v-if="$slots.description">
        <slot name="description" />
      </template>
      
      <van-button
        v-if="buttonText"
        :type="buttonType"
        :size="buttonSize"
        class="empty-button"
        @click="onButtonClick"
      >
        {{ buttonText }}
      </van-button>
      
      <slot name="default" />
    </van-empty>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image?: string
  imageSize?: string | number
  description?: string
  buttonText?: string
  buttonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  buttonSize?: 'large' | 'normal' | 'small' | 'mini'
}

const props = withDefaults(defineProps<Props>(), {
  image: 'default',
  imageSize: 160,
  description: '暂无数据',
  buttonText: '',
  buttonType: 'primary',
  buttonSize: 'normal'
})

const emit = defineEmits<{
  buttonClick: []
}>()

const onButtonClick = () => {
  emit('buttonClick')
}
</script>

<style lang="scss" scoped>
.empty-wrapper {
  padding: $padding-xl;
  
  .empty-button {
    margin-top: $padding-lg;
  }
}

:deep(.van-empty__description) {
  color: $text-color-3;
  font-size: $font-size-md;
}
</style>
