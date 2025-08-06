import request from '@/utils/request'

// 商家详情接口
export interface ShopDetail {
  id: string
  name: string
  banner: string
  rating: number
  monthlySales: number
  deliveryTime: number
  deliveryFee: number
  promotions?: Array<{
    id: string
    type: string
    text: string
  }>
}

// 商品分类接口
export interface ProductCategory {
  id: string
  name: string
  sort: number
}

// 商品接口
export interface Product {
  id: string
  name: string
  description?: string
  image: string
  price: number
  originalPrice?: number
  categoryId: string
  tags?: string[]
  specs?: Array<{
    name: string
    options: string[]
  }>
}

// 获取商家详情
export const getShopDetail = (shopId: string): Promise<ShopDetail> => {
  // 模拟数据
  return Promise.resolve({
    id: shopId,
    name: `美味餐厅${shopId}`,
    banner: `/banner${((parseInt(shopId) - 1) % 4) + 1}.${((parseInt(shopId) - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
    rating: Number((4 + Math.random()).toFixed(1)),
    monthlySales: Math.floor(Math.random() * 1000) + 100,
    deliveryTime: Math.floor(Math.random() * 20) + 20,
    deliveryFee: Math.floor(Math.random() * 5) + 2,
    promotions: [
      {
        id: '1',
        type: 'discount',
        text: '满30减5'
      },
      {
        id: '2',
        type: 'new-user',
        text: '新用户立减8元'
      }
    ]
  })
}

// 获取商家商品分类
export const getShopCategories = (shopId: string): Promise<ProductCategory[]> => {
  // 模拟数据
  return Promise.resolve([
    {
      id: '1',
      name: '热销推荐',
      sort: 1
    },
    {
      id: '2',
      name: '主食',
      sort: 2
    },
    {
      id: '3',
      name: '小食',
      sort: 3
    },
    {
      id: '4',
      name: '饮品',
      sort: 4
    },
    {
      id: '5',
      name: '套餐',
      sort: 5
    }
  ])
}

// 获取商家商品列表
export const getShopProducts = (shopId: string, categoryId?: string): Promise<Product[]> => {
  // 模拟数据
  const categories = ['1', '2', '3', '4', '5']
  const products: Product[] = []
  
  categories.forEach(catId => {
    const categoryProducts = Array.from({ length: 5 }, (_, index) => {
      const id = `${catId}-${index + 1}`
      return {
        id,
        name: `${getCategoryName(catId)}商品${index + 1}`,
        description: `这是一个美味的${getCategoryName(catId)}商品，口感丰富，营养健康。`,
        image: `/banner${((parseInt(id.split('-')[1]) - 1) % 4) + 1}.${((parseInt(id.split('-')[1]) - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
        price: Number((Math.random() * 50 + 10).toFixed(2)),
        originalPrice: Math.random() > 0.5 ? Number((Math.random() * 20 + 60).toFixed(2)) : undefined,
        categoryId: catId,
        tags: getProductTags(catId),
        specs: Math.random() > 0.7 ? [
          {
            name: '规格',
            options: ['小份', '中份', '大份']
          },
          {
            name: '口味',
            options: ['微辣', '中辣', '特辣']
          }
        ] : undefined
      }
    })
    products.push(...categoryProducts)
  })
  
  return Promise.resolve(categoryId ? products.filter(p => p.categoryId === categoryId) : products)
}

// 根据分类ID获取分类名称
const getCategoryName = (categoryId: string) => {
  const categoryMap: Record<string, string> = {
    '1': '热销',
    '2': '主食',
    '3': '小食',
    '4': '饮品',
    '5': '套餐'
  }
  return categoryMap[categoryId] || '商品'
}

// 根据分类获取商品标签
const getProductTags = (categoryId: string) => {
  const tagMap: Record<string, string[]> = {
    '1': ['热销', '推荐'],
    '2': ['主食', '饱腹'],
    '3': ['小食', '零食'],
    '4': ['饮品', '解腻'],
    '5': ['套餐', '实惠']
  }
  return tagMap[categoryId] || []
}
