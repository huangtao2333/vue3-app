<template>
  <div class="home-page">
    <!-- 顶部搜索栏 -->
    <div class="home-header">
      <div class="location-info" @click="showLocationPicker">
        <van-icon name="location-o" />
        <span class="location-text">{{ currentLocation }}</span>
        <van-icon name="arrow-down" />
      </div>
      
      <SearchBar
        readonly
        placeholder="搜索商家、商品"
        @click-input="goToSearch"
      />
    </div>

    <!-- 轮播图 -->
    <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="banner in banners" :key="banner.id">
        <img :src="banner.image" :alt="banner.title" @click="onBannerClick(banner)" />
      </van-swipe-item>
    </van-swipe>

    <!-- 快捷入口 -->
    <div class="quick-entries">
      <div
        v-for="entry in quickEntries"
        :key="entry.id"
        class="entry-item"
        @click="onEntryClick(entry)"
      >
        <div class="entry-icon">
          <img :src="entry.icon" :alt="entry.name" />
        </div>
        <span class="entry-name">{{ entry.name }}</span>
      </div>
    </div>

    <!-- 商家列表 -->
    <div class="shop-section">
      <div class="section-header">
        <h3>附近商家</h3>
        <van-button type="primary" size="small" @click="goToShopList">
          查看更多
        </van-button>
      </div>
      
      <div class="shop-list">
        <ShopCard
          v-for="shop in shops"
          :key="shop.id"
          :shop="shop"
          @click="goToShop(shop.id)"
        />
      </div>
      
      <!-- 加载更多 -->
      <van-loading v-if="loading" class="loading-more">加载中...</van-loading>
      
      <!-- 没有更多数据 -->
      <div v-if="!hasMore && shops.length > 0" class="no-more">
        没有更多商家了
      </div>
    </div>

    <!-- 底部标签栏 -->
    <TabBar />

    <!-- 位置选择器 -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="locationColumns"
        @confirm="onLocationConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import SearchBar from '@/components/Common/SearchBar.vue'
import ShopCard from '@/components/Shop/ShopCard.vue'
import TabBar from '@/components/Layout/TabBar.vue'
import { getHomeData, getShopList } from '@/api/home'

const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const currentLocation = ref('定位中...')
const banners = ref([])
const quickEntries = ref([])
const shops = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const showPicker = ref(false)

// 位置选择器数据
const locationColumns = [
  '北京市',
  '上海市',
  '广州市',
  '深圳市',
  '杭州市',
  '南京市',
  '武汉市',
  '成都市',
  '西安市',
  '重庆市'
]

// 获取首页数据
const fetchHomeData = async () => {
  try {
    const data = await getHomeData()
    banners.value = data.banners
    quickEntries.value = data.quickEntries
  } catch (error) {
    console.error('获取首页数据失败:', error)
  }
}

// 获取商家列表
const fetchShopList = async (isRefresh = false) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const currentPage = isRefresh ? 1 : page.value
    const data = await getShopList({
      page: currentPage,
      pageSize: 10,
      latitude: appStore.location.latitude,
      longitude: appStore.location.longitude
    })
    
    if (isRefresh) {
      shops.value = data.list
      page.value = 1
    } else {
      shops.value.push(...data.list)
    }
    
    hasMore.value = data.hasMore
    page.value++
  } catch (error) {
    console.error('获取商家列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取当前位置
const getCurrentLocation = async () => {
  try {
    await appStore.getCurrentLocation()
    currentLocation.value = appStore.location.address || '当前位置'
    // 位置获取成功后刷新商家列表
    fetchShopList(true)
  } catch (error) {
    console.error('获取位置失败:', error)
    currentLocation.value = '定位失败'
  }
}

// 滚动加载更多
const onScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  
  if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore.value && !loading.value) {
    fetchShopList()
  }
}

// 事件处理
const showLocationPicker = () => {
  showPicker.value = true
}

const onLocationConfirm = ({ selectedValues }: any) => {
  currentLocation.value = selectedValues[0]
  showPicker.value = false
  // 重新获取商家列表
  fetchShopList(true)
}

const goToSearch = () => {
  router.push('/search')
}

const onBannerClick = (banner: any) => {
  console.log('点击轮播图:', banner)
}

const onEntryClick = (entry: any) => {
  console.log('点击快捷入口:', entry)

  // 根据快捷入口类型进行跳转
  switch (entry.name) {
    case '美食':
    case '分类':
      router.push('/category')
      break
    case '购物车':
      router.push('/cart')
      break
    case '搜索':
      router.push('/search')
      break
    case '我的':
    case '个人中心':
      router.push('/profile')
      break
    case '订单':
      router.push('/order')
      break
    case '地址':
      router.push('/address')
      break
    case '更多':
      // 显示更多选项或跳转到分类页面
      router.push('/category')
      break
    default:
      // 默认跳转到分类页面
      router.push('/category')
      break
  }
}

const goToShopList = () => {
  router.push('/category')
}

const goToShop = (shopId: string) => {
  router.push(`/shop/${shopId}`)
}

// 生命周期
onMounted(() => {
  fetchHomeData()
  getCurrentLocation()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $background-color;
  padding-bottom: 60px;
}

.home-header {
  background-color: $white;
  padding: $padding-md;
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
  
  .location-info {
    display: flex;
    align-items: center;
    margin-bottom: $padding-sm;
    color: $text-color;
    
    .location-text {
      margin: 0 $padding-xs;
      font-size: $font-size-md;
      font-weight: 500;
    }
  }
}

.home-swipe {
  height: 180px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.quick-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $padding-md;
  padding: $padding-lg;
  background-color: $white;
  margin-top: $padding-sm;
  
  .entry-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .entry-icon {
      width: 48px;
      height: 48px;
      margin-bottom: $padding-xs;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .entry-name {
      font-size: $font-size-sm;
      color: $text-color;
    }
  }
}

.shop-section {
  margin-top: $padding-sm;
  background-color: $white;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-lg $padding-md $padding-sm;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
  }
  
  .shop-list {
    padding: 0 $padding-md;
  }
  
  .loading-more {
    padding: $padding-lg;
    text-align: center;
  }
  
  .no-more {
    padding: $padding-lg;
    text-align: center;
    color: $text-color-3;
    font-size: $font-size-sm;
  }
}
</style>
