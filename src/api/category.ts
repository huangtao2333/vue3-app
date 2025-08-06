import request from '@/utils/request'

// 分类接口
export interface Category {
  id: string
  name: string
  icon: string
  sort: number
}

// 分类商家列表参数
export interface CategoryShopParams {
  categoryId: string
  sortType?: 'default' | 'distance' | 'rating' | 'sales'
  page?: number
  pageSize?: number
}

// 获取分类列表
export const getCategoryList = (): Promise<Category[]> => {
  // 模拟数据
  return Promise.resolve([
    {
      id: '1',
      name: '美食',
      icon: '/banner1.jpg',
      sort: 1
    },
    {
      id: '2',
      name: '超市',
      icon: '/banner2.webp',
      sort: 2
    },
    {
      id: '3',
      name: '水果',
      icon: '/banner3.webp',
      sort: 3
    },
    {
      id: '4',
      name: '药品',
      icon: '/banner4.webp',
      sort: 4
    },
    {
      id: '5',
      name: '鲜花',
      icon: '/banner1.jpg',
      sort: 5
    },
    {
      id: '6',
      name: '跑腿',
      icon: '/banner2.webp',
      sort: 6
    },
    {
      id: '7',
      name: '汉堡',
      icon: '/banner3.webp',
      sort: 7
    },
    {
      id: '8',
      name: '奶茶',
      icon: '/banner4.webp',
      sort: 8
    }
  ])
}

// 获取分类下的商家列表
export const getShopsByCategory = (params: CategoryShopParams) => {
  // 模拟数据
  const mockShops = Array.from({ length: 20 }, (_, index) => {
    const id = index + 1
    return {
      id: id.toString(),
      name: `${getCategoryName(params.categoryId)}店铺${id}`,
      image: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
      rating: Number((4 + Math.random()).toFixed(1)),
      tags: getTagsByCategory(params.categoryId),
      deliveryFee: Math.floor(Math.random() * 5) + 2,
      deliveryTime: Math.floor(Math.random() * 20) + 20,
      distance: Number((Math.random() * 3).toFixed(1)),
      deliveryTag: Math.random() > 0.5 ? '蜂鸟专送' : undefined,
      promotions: Math.random() > 0.3 ? [
        {
          id: '1',
          type: 'discount',
          text: '满30减5'
        }
      ] : undefined
    }
  })

  return Promise.resolve({
    list: mockShops,
    total: 100,
    hasMore: true
  })
}

// 根据分类ID获取分类名称
const getCategoryName = (categoryId: string) => {
  const categoryMap: Record<string, string> = {
    '1': '美食',
    '2': '超市',
    '3': '水果',
    '4': '药品',
    '5': '鲜花',
    '6': '跑腿',
    '7': '汉堡',
    '8': '奶茶'
  }
  return categoryMap[categoryId] || '商家'
}

// 根据分类获取标签
const getTagsByCategory = (categoryId: string) => {
  const tagMap: Record<string, string[]> = {
    '1': ['快餐', '中式', '西式'],
    '2': ['生鲜', '日用', '零食'],
    '3': ['新鲜', '进口', '有机'],
    '4': ['处方药', '非处方药', '保健品'],
    '5': ['鲜花', '绿植', '花束'],
    '6': ['代买', '代送', '帮办'],
    '7': ['汉堡', '炸鸡', '薯条'],
    '8': ['奶茶', '果茶', '咖啡']
  }
  return tagMap[categoryId] || ['商品']
}
