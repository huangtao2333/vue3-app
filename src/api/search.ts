import request from '@/utils/request'

// 搜索商家
export const searchShops = (keyword: string) => {
  // 模拟数据
  const mockShops = Array.from({ length: 10 }, (_, index) => {
    const id = index + 1
    return {
      id: id.toString(),
      name: `${keyword}相关店铺${id}`,
      image: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
      rating: Number((4 + Math.random()).toFixed(1)),
      tags: ['快餐', '外卖', '热销'],
      deliveryFee: Math.floor(Math.random() * 5) + 2,
      deliveryTime: Math.floor(Math.random() * 20) + 20,
      distance: Number((Math.random() * 3).toFixed(1)),
      promotions: [
        {
          id: '1',
          type: 'discount',
          text: '满30减5'
        }
      ]
    }
  })

  return Promise.resolve({
    list: mockShops,
    total: 50
  })
}

// 搜索商品
export const searchProducts = (keyword: string) => {
  // 模拟数据
  const mockProducts = Array.from({ length: 15 }, (_, index) => {
    const id = index + 1
    return {
      id: id.toString(),
      name: `${keyword}相关商品${id}`,
      image: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
      price: Number((Math.random() * 50 + 10).toFixed(2)),
      shopId: Math.floor(Math.random() * 10 + 1).toString(),
      shopName: `商家${Math.floor(Math.random() * 10 + 1)}`
    }
  })

  return Promise.resolve({
    list: mockProducts,
    total: 80
  })
}

// 获取搜索建议
export const getSearchSuggestions = (keyword: string): Promise<string[]> => {
  // 模拟数据
  const suggestions = [
    `${keyword}汉堡`,
    `${keyword}奶茶`,
    `${keyword}炸鸡`,
    `${keyword}火锅`,
    `${keyword}烧烤`
  ].filter(item => item !== keyword)

  return Promise.resolve(suggestions.slice(0, 5))
}
