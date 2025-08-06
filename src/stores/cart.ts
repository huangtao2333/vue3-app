import { defineStore } from 'pinia'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  shopId: string
  shopName: string
  specs?: string[]
}

interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [
      // 添加一些测试数据
      {
        id: '1',
        name: '宫保鸡丁',
        price: 28,
        quantity: 1,
        image: '/banner1.jpg',
        shopId: '1',
        shopName: '美味餐厅',
        specs: ['微辣', '大份']
      },
      {
        id: '2',
        name: '麻婆豆腐',
        price: 18,
        quantity: 2,
        image: '/banner2.webp',
        shopId: '1',
        shopName: '美味餐厅',
        specs: ['中辣']
      },
      {
        id: '3',
        name: '红烧肉',
        price: 35,
        quantity: 1,
        image: '/banner3.webp',
        shopId: '2',
        shopName: '家常菜馆',
        specs: ['正常甜度']
      }
    ]
  }),

  getters: {
    // 购物车商品总数
    totalCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // 购物车总金额
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    // 按商家分组的购物车商品
    groupedByShop: (state) => {
      const groups: Record<string, CartItem[]> = {}
      state.items.forEach(item => {
        if (!groups[item.shopId]) {
          groups[item.shopId] = []
        }
        groups[item.shopId].push(item)
      })
      return groups
    },

    // 购物车是否为空
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    // 添加商品到购物车
    addToCart(product: Omit<CartItem, 'quantity'>) {
      const existingItem = this.items.find(item => 
        item.id === product.id && 
        JSON.stringify(item.specs) === JSON.stringify(product.specs)
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
    },

    // 减少商品数量
    decreaseQuantity(itemId: string, specs?: string[]) {
      const item = this.items.find(item => 
        item.id === itemId && 
        JSON.stringify(item.specs) === JSON.stringify(specs)
      )

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          this.removeFromCart(itemId, specs)
        }
      }
    },

    // 增加商品数量
    increaseQuantity(itemId: string, specs?: string[]) {
      const item = this.items.find(item => 
        item.id === itemId && 
        JSON.stringify(item.specs) === JSON.stringify(specs)
      )

      if (item) {
        item.quantity += 1
      }
    },

    // 从购物车移除商品
    removeFromCart(itemId: string, specs?: string[]) {
      const index = this.items.findIndex(item => 
        item.id === itemId && 
        JSON.stringify(item.specs) === JSON.stringify(specs)
      )

      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    // 清空购物车
    clearCart() {
      this.items = []
    },

    // 清空指定商家的商品
    clearShopItems(shopId: string) {
      this.items = this.items.filter(item => item.shopId !== shopId)
    },

    // 获取商品在购物车中的数量
    getItemQuantity(itemId: string, specs?: string[]) {
      const item = this.items.find(item => 
        item.id === itemId && 
        JSON.stringify(item.specs) === JSON.stringify(specs)
      )
      return item ? item.quantity : 0
    }
  },

  persist: {
    key: 'cart-store'
  }
})
