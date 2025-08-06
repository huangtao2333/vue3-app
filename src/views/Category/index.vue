<template>
  <div class="category-page">
    <NavBar title="分类" />
    
    <div class="category-content">
      <!-- 左侧分类列表 -->
      <div class="category-sidebar">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <img :src="category.icon" :alt="category.name" />
          <span>{{ category.name }}</span>
        </div>
      </div>
      
      <!-- 右侧商家列表 -->
      <div class="shop-list-container">
        <div class="category-header">
          <h3>{{ currentCategoryName }}</h3>
          <div class="sort-options">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="sortType"
                :options="sortOptions"
                @change="onSortChange"
              />
            </van-dropdown-menu>
          </div>
        </div>
        
        <div class="shop-list">
          <ShopCard
            v-for="shop in shops"
            :key="shop.id"
            :shop="shop"
            @click="goToShop(shop.id)"
          />
        </div>
        
        <!-- 加载状态 -->
        <Loading v-if="loading" />
        
        <!-- 空状态 -->
        <Empty
          v-if="!loading && shops.length === 0"
          description="暂无商家"
          button-text="刷新"
          @button-click="refreshShops"
        />
      </div>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/Layout/NavBar.vue'
import TabBar from '@/components/Layout/TabBar.vue'
import ShopCard from '@/components/Shop/ShopCard.vue'
import Loading from '@/components/Common/Loading.vue'
import Empty from '@/components/Common/Empty.vue'
import { getCategoryList, getShopsByCategory } from '@/api/category'

// 类型定义
interface Category {
  id: string
  name: string
  icon: string
}

interface Shop {
  id: string
  name: string
  image: string
  rating: string
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  distance: string
  tags: string[]
}

const router = useRouter()

// 响应式数据
const categories = ref<Category[]>([])
const activeCategory = ref<string>('')
const shops = ref<Shop[]>([])
const loading = ref<boolean>(false)
const sortType = ref<string>('default')

// 排序选项
const sortOptions = [
  { text: '综合排序', value: 'default' },
  { text: '距离最近', value: 'distance' },
  { text: '评分最高', value: 'rating' },
  { text: '销量最高', value: 'sales' }
]

// 计算属性
const currentCategoryName = computed(() => {
  const category = categories.value.find((c: Category) => c.id === activeCategory.value)
  return category?.name || ''
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    const data = await getCategoryList()
    categories.value = data
    if (data.length > 0) {
      activeCategory.value = data[0].id
      fetchShops()
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取商家列表
const fetchShops = async () => {
  if (!activeCategory.value) return
  
  loading.value = true
  
  try {
    const data = await getShopsByCategory({
      categoryId: activeCategory.value,
      sortType: sortType.value
    })
    shops.value = data.list
  } catch (error) {
    console.error('获取商家列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择分类
const selectCategory = (categoryId: string) => {
  if (activeCategory.value !== categoryId) {
    activeCategory.value = categoryId
    fetchShops()
  }
}

// 排序改变
const onSortChange = () => {
  fetchShops()
}

// 刷新商家列表
const refreshShops = () => {
  fetchShops()
}

// 跳转到商家详情
const goToShop = (shopId: string) => {
  router.push(`/shop/${shopId}`)
}

// 生命周期
onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.category-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.category-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-sidebar {
  width: 80px;
  background-color: $gray-1;
  overflow-y: auto;
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $padding-md $padding-xs;
    cursor: pointer;
    
    &.active {
      background-color: $white;
      color: $primary-color;
    }
    
    img {
      width: 32px;
      height: 32px;
      margin-bottom: $padding-xs;
    }
    
    span {
      font-size: $font-size-xs;
      text-align: center;
      line-height: 1.2;
    }
  }
}

.shop-list-container {
  flex: 1;
  background-color: $white;
  display: flex;
  flex-direction: column;
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-md;
    border-bottom: 1px solid $border-color-light;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
  }
  
  .shop-list {
    flex: 1;
    overflow-y: auto;
  }
}

:deep(.van-dropdown-menu) {
  box-shadow: none;
  
  .van-dropdown-menu__bar {
    background-color: transparent;
    box-shadow: none;
  }
  
  .van-dropdown-menu__title {
    font-size: $font-size-sm;
    color: $text-color-2;
  }
}
</style>
