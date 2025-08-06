import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty cart', () => {
    const cartStore = useCartStore()
    
    expect(cartStore.items).toEqual([])
    expect(cartStore.totalCount).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
    expect(cartStore.isEmpty).toBe(true)
  })

  it('should add item to cart', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0]).toMatchObject({
      ...product,
      quantity: 1
    })
    expect(cartStore.totalCount).toBe(1)
    expect(cartStore.totalPrice).toBe(25.8)
    expect(cartStore.isEmpty).toBe(false)
  })

  it('should increase quantity when adding same item', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)
    cartStore.addToCart(product)

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(2)
    expect(cartStore.totalCount).toBe(2)
    expect(cartStore.totalPrice).toBe(51.6)
  })

  it('should handle items with different specs separately', () => {
    const cartStore = useCartStore()
    const product1 = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅',
      specs: ['大份']
    }
    const product2 = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅',
      specs: ['小份']
    }

    cartStore.addToCart(product1)
    cartStore.addToCart(product2)

    expect(cartStore.items).toHaveLength(2)
    expect(cartStore.totalCount).toBe(2)
  })

  it('should increase item quantity', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)
    cartStore.increaseQuantity('1')

    expect(cartStore.items[0].quantity).toBe(2)
    expect(cartStore.totalCount).toBe(2)
  })

  it('should decrease item quantity', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)
    cartStore.addToCart(product) // quantity = 2
    cartStore.decreaseQuantity('1')

    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.totalCount).toBe(1)
  })

  it('should remove item when quantity becomes 0', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)
    cartStore.decreaseQuantity('1')

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.isEmpty).toBe(true)
  })

  it('should remove item from cart', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product)
    cartStore.removeFromCart('1')

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.isEmpty).toBe(true)
  })

  it('should clear entire cart', () => {
    const cartStore = useCartStore()
    const product1 = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }
    const product2 = {
      id: '2',
      name: '可乐',
      price: 8.5,
      image: 'cola.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    cartStore.addToCart(product1)
    cartStore.addToCart(product2)
    cartStore.clearCart()

    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.isEmpty).toBe(true)
  })

  it('should clear items from specific shop', () => {
    const cartStore = useCartStore()
    const product1 = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '餐厅1'
    }
    const product2 = {
      id: '2',
      name: '披萨',
      price: 35.8,
      image: 'pizza.jpg',
      shopId: 'shop2',
      shopName: '餐厅2'
    }

    cartStore.addToCart(product1)
    cartStore.addToCart(product2)
    cartStore.clearShopItems('shop1')

    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].shopId).toBe('shop2')
  })

  it('should group items by shop', () => {
    const cartStore = useCartStore()
    const product1 = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '餐厅1'
    }
    const product2 = {
      id: '2',
      name: '可乐',
      price: 8.5,
      image: 'cola.jpg',
      shopId: 'shop1',
      shopName: '餐厅1'
    }
    const product3 = {
      id: '3',
      name: '披萨',
      price: 35.8,
      image: 'pizza.jpg',
      shopId: 'shop2',
      shopName: '餐厅2'
    }

    cartStore.addToCart(product1)
    cartStore.addToCart(product2)
    cartStore.addToCart(product3)

    const grouped = cartStore.groupedByShop

    expect(Object.keys(grouped)).toHaveLength(2)
    expect(grouped['shop1']).toHaveLength(2)
    expect(grouped['shop2']).toHaveLength(1)
  })

  it('should get item quantity', () => {
    const cartStore = useCartStore()
    const product = {
      id: '1',
      name: '汉堡',
      price: 25.8,
      image: 'burger.jpg',
      shopId: 'shop1',
      shopName: '测试餐厅'
    }

    expect(cartStore.getItemQuantity('1')).toBe(0)

    cartStore.addToCart(product)
    cartStore.addToCart(product)

    expect(cartStore.getItemQuantity('1')).toBe(2)
  })
})
