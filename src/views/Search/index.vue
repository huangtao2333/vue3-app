<template>
  <div class="search-page">
    <!-- 搜索栏 -->
    <div class="search-header">
      <SearchBar
        v-model="searchKeyword"
        placeholder="搜索商家、商品"
        show-action
        action-text="搜索"
        @search="handleSearch"
        @cancel="goBack"
      />
    </div>
    
    <!-- 搜索历史 -->
    <div v-if="!searchKeyword && searchHistory.length > 0" class="search-history">
      <div class="section-header">
        <h3>搜索历史</h3>
        <van-button type="primary" size="mini" @click="clearHistory">
          清空
        </van-button>
      </div>
      
      <div class="history-tags">
        <van-tag
          v-for="(item, index) in searchHistory"
          :key="index"
          type="default"
          size="medium"
          @click="searchKeyword = item"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>
    
    <!-- 热门搜索 -->
    <div v-if="!searchKeyword" class="hot-search">
      <div class="section-header">
        <h3>热门搜索</h3>
      </div>
      
      <div class="hot-tags">
        <van-tag
          v-for="(item, index) in hotSearchList"
          :key="index"
          type="primary"
          size="medium"
          @click="searchKeyword = item"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>
    
    <!-- 搜索结果 -->
    <div v-if="searchKeyword" class="search-results">
      <!-- 搜索建议 -->
      <div v-if="!hasSearched && suggestions.length > 0" class="suggestions">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          <van-icon name="search" />
          <span>{{ suggestion }}</span>
        </div>
      </div>
      
      <!-- 搜索结果内容 -->
      <div v-if="hasSearched" class="result-content">
        <!-- 结果统计 -->
        <div class="result-stats">
          找到 {{ totalResults }} 个相关结果
        </div>
        
        <!-- 结果分类 -->
        <van-tabs v-model:active="activeTab" @change="onTabChange">
          <van-tab title="商家" name="shop">
            <div class="shop-results">
              <ShopCard
                v-for="shop in shopResults"
                :key="shop.id"
                :shop="shop"
                @click="goToShop(shop.id)"
              />
              
              <Loading v-if="loading" />
              
              <Empty
                v-if="!loading && shopResults.length === 0"
                description="没有找到相关商家"
              />
            </div>
          </van-tab>
          
          <van-tab title="商品" name="product">
            <div class="product-results">
              <div
                v-for="product in productResults"
                :key="product.id"
                class="product-item"
                @click="goToProduct(product)"
              >
                <div class="product-image">
                  <img :src="product.image" :alt="product.name" />
                </div>
                
                <div class="product-info">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="shop-name">{{ product.shopName }}</p>
                  <div class="product-price">¥{{ product.price }}</div>
                </div>
              </div>
              
              <Loading v-if="loading" />
              
              <Empty
                v-if="!loading && productResults.length === 0"
                description="没有找到相关商品"
              />
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/Common/SearchBar.vue'
import ShopCard from '@/components/Shop/ShopCard.vue'
import Loading from '@/components/Common/Loading.vue'
import Empty from '@/components/Common/Empty.vue'
import { searchShops, searchProducts, getSearchSuggestions } from '@/api/search'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const hasSearched = ref(false)
const activeTab = ref('shop')
const loading = ref(false)
const totalResults = ref(0)

// 搜索历史
const searchHistory = ref<string[]>([])

// 热门搜索
const hotSearchList = ref([
  '汉堡王',
  '麦当劳',
  '肯德基',
  '星巴克',
  '奶茶',
  '火锅',
  '烧烤',
  '日料'
])

// 搜索建议
const suggestions = ref<string[]>([])

// 搜索结果
const shopResults = ref([])
const productResults = ref([])

// 监听搜索关键词变化
watch(searchKeyword, async (newKeyword) => {
  if (newKeyword.trim()) {
    // 获取搜索建议
    try {
      suggestions.value = await getSearchSuggestions(newKeyword)
    } catch (error) {
      console.error('获取搜索建议失败:', error)
    }
  } else {
    suggestions.value = []
    hasSearched.value = false
  }
})

// 执行搜索
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return
  
  hasSearched.value = true
  loading.value = true
  
  try {
    // 添加到搜索历史
    addToHistory(searchKeyword.value)
    
    // 搜索商家和商品
    const [shopData, productData] = await Promise.all([
      searchShops(searchKeyword.value),
      searchProducts(searchKeyword.value)
    ])
    
    shopResults.value = shopData.list
    productResults.value = productData.list
    totalResults.value = shopData.total + productData.total
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择搜索建议
const selectSuggestion = (suggestion: string) => {
  searchKeyword.value = suggestion
  handleSearch()
}

// 添加到搜索历史
const addToHistory = (keyword: string) => {
  const history = [...searchHistory.value]
  const index = history.indexOf(keyword)
  
  if (index > -1) {
    history.splice(index, 1)
  }
  
  history.unshift(keyword)
  
  // 最多保存10条历史记录
  if (history.length > 10) {
    history.pop()
  }
  
  searchHistory.value = history
  localStorage.setItem('searchHistory', JSON.stringify(history))
}

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 切换标签
const onTabChange = () => {
  // 可以在这里处理标签切换逻辑
}

// 跳转到商家详情
const goToShop = (shopId: string) => {
  router.push(`/shop/${shopId}`)
}

// 跳转到商品详情
const goToProduct = (product: any) => {
  router.push(`/shop/${product.shopId}`)
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  // 加载搜索历史
  const history = localStorage.getItem('searchHistory')
  if (history) {
    try {
      searchHistory.value = JSON.parse(history)
    } catch (error) {
      console.error('解析搜索历史失败:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
}

.search-header {
  background-color: $white;
  border-bottom: 1px solid $border-color;
}

.search-history,
.hot-search {
  background-color: $white;
  margin-top: $padding-sm;
  padding: $padding-md;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $padding-md;
    
    h3 {
      font-size: $font-size-md;
      font-weight: 500;
      color: $text-color;
    }
  }
  
  .history-tags,
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $padding-sm;
    
    :deep(.van-tag) {
      cursor: pointer;
    }
  }
}

.search-results {
  flex: 1;
  overflow: hidden;
  
  .suggestions {
    background-color: $white;
    
    .suggestion-item {
      display: flex;
      align-items: center;
      padding: $padding-md;
      border-bottom: 1px solid $border-color-light;
      cursor: pointer;
      
      &:hover {
        background-color: $gray-1;
      }
      
      span {
        margin-left: $padding-sm;
        color: $text-color;
      }
    }
  }
  
  .result-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .result-stats {
      background-color: $white;
      padding: $padding-sm $padding-md;
      font-size: $font-size-sm;
      color: $text-color-3;
      border-bottom: 1px solid $border-color;
    }
    
    :deep(.van-tabs) {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .van-tabs__content {
        flex: 1;
        overflow: hidden;
      }
      
      .van-tab-panel {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}

.shop-results {
  background-color: $white;
}

.product-results {
  background-color: $white;
  padding: $padding-sm;
  
  .product-item {
    display: flex;
    padding: $padding-md;
    border-bottom: 1px solid $border-color-light;
    cursor: pointer;
    
    &:hover {
      background-color: $gray-1;
    }
    
    .product-image {
      width: 60px;
      height: 60px;
      margin-right: $padding-md;
      border-radius: $border-radius-md;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        font-size: $font-size-md;
        color: $text-color;
        margin-bottom: $padding-xs;
        @include ellipsis;
      }
      
      .shop-name {
        font-size: $font-size-sm;
        color: $text-color-3;
        margin-bottom: $padding-xs;
      }
      
      .product-price {
        font-size: $font-size-lg;
        color: $danger-color;
        font-weight: 600;
      }
    }
  }
}
</style>
