import request from '@/utils/request'

// 首页数据接口
export interface HomeData {
  banners: Banner[]
  quickEntries: QuickEntry[]
}

export interface Banner {
  id: string
  title: string
  image: string
  link?: string
}

export interface QuickEntry {
  id: string
  name: string
  icon: string
  link?: string
}

// 商家列表接口
export interface ShopListParams {
  page: number
  pageSize: number
  latitude?: number
  longitude?: number
  categoryId?: string
  keyword?: string
  sortType?: 'default' | 'distance' | 'rating' | 'sales'
}

export interface Shop {
  id: string
  name: string
  image: string
  rating: number
  tags: string[]
  deliveryFee: number
  deliveryTime: number
  distance: number
  deliveryTag?: string
  promotions?: Promotion[]
}

export interface Promotion {
  id: string
  type: string
  text: string
}

export interface ShopListResponse {
  list: Shop[]
  total: number
  hasMore: boolean
}

// 获取首页数据
export const getHomeData = (): Promise<HomeData> => {
  // 模拟数据，实际项目中应该调用真实API
  return Promise.resolve({
    banners: [
      {
        id: '1',
        title: '美食节活动',
        image: '/banner1.jpg'
      },
      {
        id: '2',
        title: '新用户优惠',
        image: '/banner2.webp'
      },
      {
        id: '3',
        title: '限时特惠',
        image: '/banner3.webp'
      },
      {
        id: '4',
        title: '特色推荐',
        image: '/banner4.webp'
      }
    ],
    quickEntries: [
      {
        id: '1',
        name: '美食',
        icon: '/banner1.jpg'
      },
      {
        id: '2',
        name: '超市',
        icon: '/banner2.webp'
      },
      {
        id: '3',
        name: '水果',
        icon: '/banner3.webp'
      },
      {
        id: '4',
        name: '药品',
        icon: '/banner4.webp'
      },
      {
        id: '5',
        name: '鲜花',
        icon: '/banner1.jpg'
      },
      {
        id: '6',
        name: '跑腿',
        icon: '/banner2.webp'
      },
      {
        id: '7',
        name: '汉堡',
        icon: '/banner3.webp'
      },
      {
        id: '8',
        name: '更多',
        icon: '/banner4.webp'
      }
    ]
  })
}

// 获取商家列表
export const getShopList = (params: ShopListParams): Promise<ShopListResponse> => {
  // 模拟数据，实际项目中应该调用真实API
  const mockShops: Shop[] = Array.from({ length: params.pageSize }, (_, index) => {
    const id = (params.page - 1) * params.pageSize + index + 1
    return {
      id: id.toString(),
      name: `美味餐厅${id}`,
      image: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
      rating: Number((4 + Math.random()).toFixed(1)),
      tags: ['快餐', '汉堡', '炸鸡'].slice(0, Math.floor(Math.random() * 3) + 1),
      deliveryFee: Math.floor(Math.random() * 5) + 2,
      deliveryTime: Math.floor(Math.random() * 20) + 20,
      distance: Number((Math.random() * 3).toFixed(1)),
      deliveryTag: Math.random() > 0.5 ? '蜂鸟专送' : undefined,
      promotions: Math.random() > 0.3 ? [
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
      ] : undefined
    }
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: mockShops,
        total: 100,
        hasMore: params.page < 10
      })
    }, 500)
  })
}

// 获取商家详情
export const getShopDetail = (shopId: string) => {
  return request.get(`/shops/${shopId}`)
}

// 获取商家商品列表
export const getShopProducts = (shopId: string, categoryId?: string) => {
  return request.get(`/shops/${shopId}/products`, {
    params: { categoryId }
  })
}
