<template>
  <div
    ref="containerRef"
    class="virtual-list"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- 占位元素，用于撑开滚动条 -->
    <div
      class="virtual-list-phantom"
      :style="{ height: totalHeight + 'px' }"
    ></div>
    
    <!-- 可视区域内容 -->
    <div
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item)"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index" />
      </div>
    </div>
    
    <!-- 加载更多 -->
    <div
      v-if="loading"
      class="virtual-list-loading"
      :style="{ transform: `translateY(${totalHeight}px)` }"
    >
      <slot name="loading">
        <van-loading>加载中...</van-loading>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
  buffer?: number
  loading?: boolean
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  buffer: 5,
  loading: false,
  keyField: 'id'
})

const emit = defineEmits<{
  loadMore: []
  scroll: [scrollTop: number]
}>()

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算可视区域能显示的项目数量
const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))

// 计算开始索引
const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight)
  return Math.max(0, index - props.buffer)
})

// 计算结束索引
const endIndex = computed(() => {
  const index = startIndex.value + visibleCount.value + props.buffer * 2
  return Math.min(props.items.length, index)
})

// 计算偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight)

// 可视区域内的项目
const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    index: startIndex.value + index
  }))
})

// 获取项目的唯一标识
const getItemKey = (item: any) => {
  return item[props.keyField] || item.index
}

// 处理滚动事件
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
  
  emit('scroll', scrollTop.value)
  
  // 检查是否需要加载更多
  const scrollBottom = target.scrollTop + target.clientHeight
  const threshold = target.scrollHeight - props.itemHeight * 3
  
  if (scrollBottom >= threshold && !props.loading) {
    emit('loadMore')
  }
}

// 滚动到指定位置
const scrollTo = (index: number) => {
  if (containerRef.value) {
    const targetScrollTop = index * props.itemHeight
    containerRef.value.scrollTop = targetScrollTop
  }
}

// 滚动到顶部
const scrollToTop = () => {
  scrollTo(0)
}

// 滚动到底部
const scrollToBottom = () => {
  scrollTo(props.items.length - 1)
}

// 监听数据变化，重置滚动位置
watch(() => props.items.length, (newLength, oldLength) => {
  if (newLength < oldLength) {
    // 数据减少时，重置到顶部
    nextTick(() => {
      scrollToTop()
    })
  }
})

// 暴露方法给父组件
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom
})

onMounted(() => {
  // 初始化时确保容器有正确的高度
  if (containerRef.value) {
    containerRef.value.style.height = props.containerHeight + 'px'
  }
})
</script>

<style lang="scss" scoped>
.virtual-list {
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
}

.virtual-list-phantom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-list-item {
  overflow: hidden;
}

.virtual-list-loading {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $padding-md;
  background-color: $white;
}
</style>
