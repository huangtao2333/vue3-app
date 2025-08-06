<template>
  <div class="search-bar">
    <van-search
      v-model="searchValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :show-action="showAction"
      :action-text="actionText"
      :left-icon="leftIcon"
      :right-icon="rightIcon"
      @search="onSearch"
      @cancel="onCancel"
      @click="onClick"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
      @click-input="onClickInput"
      @click-left-icon="onClickLeftIcon"
      @click-right-icon="onClickRightIcon"
    >
      <template #left-icon v-if="$slots.leftIcon">
        <slot name="left-icon" />
      </template>
      
      <template #right-icon v-if="$slots.rightIcon">
        <slot name="right-icon" />
      </template>
      
      <template #action v-if="$slots.action">
        <slot name="action" />
      </template>
    </van-search>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showAction?: boolean
  actionText?: string
  leftIcon?: string
  rightIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索关键词',
  disabled: false,
  readonly: false,
  clearable: true,
  showAction: false,
  actionText: '搜索',
  leftIcon: 'search',
  rightIcon: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  cancel: []
  click: [event: Event]
  focus: [event: Event]
  blur: [event: Event]
  clear: [event: Event]
  clickInput: [event: Event]
  clickLeftIcon: [event: Event]
  clickRightIcon: [event: Event]
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const onSearch = (value: string) => {
  emit('search', value)
}

const onCancel = () => {
  emit('cancel')
}

const onClick = (event: Event) => {
  emit('click', event)
}

const onFocus = (event: Event) => {
  emit('focus', event)
}

const onBlur = (event: Event) => {
  emit('blur', event)
}

const onClear = (event: Event) => {
  emit('clear', event)
}

const onClickInput = (event: Event) => {
  emit('clickInput', event)
}

const onClickLeftIcon = (event: Event) => {
  emit('clickLeftIcon', event)
}

const onClickRightIcon = (event: Event) => {
  emit('clickRightIcon', event)
}
</script>

<style lang="scss" scoped>
.search-bar {
  background-color: $white;
  
  :deep(.van-search) {
    padding: $padding-sm $padding-md;
    
    .van-search__content {
      background-color: $gray-1;
      border-radius: $border-radius-lg;
    }
    
    .van-field__control {
      color: $text-color;
      
      &::placeholder {
        color: $text-color-3;
      }
    }
  }
}
</style>
