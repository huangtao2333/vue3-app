import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { ref, onMounted, onUnmounted, computed, readonly } from 'vue'
import type { Component } from 'vue'

// 创建测试用的 Pinia 实例
export function createTestPinia() {
  return createPinia()
}

// 创建测试用的路由实例
export function createTestRouter(routes: any[] = []) {
  return createRouter({
    history: createWebHistory(),
    routes: routes.length > 0 ? routes : [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/test', component: { template: '<div>Test</div>' } }
    ]
  })
}

// 挂载组件的辅助函数
export function mountComponent(
  component: Component,
  options: {
    props?: Record<string, any>
    slots?: Record<string, any>
    global?: {
      plugins?: any[]
      mocks?: Record<string, any>
      stubs?: Record<string, any>
    }
    router?: any
    pinia?: any
  } = {}
): VueWrapper {
  const pinia = options.pinia || createTestPinia()
  const router = options.router || createTestRouter()
  
  const plugins = [pinia, router, ...(options.global?.plugins || [])]
  
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins
    }
  })
}

// 等待异步操作完成
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// 模拟用户交互
export const userEvent = {
  async click(element: Element) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    element.dispatchEvent(event)
    await flushPromises()
  },
  
  async type(element: HTMLInputElement, text: string) {
    element.focus()
    element.value = text
    const event = new Event('input', { bubbles: true })
    element.dispatchEvent(event)
    await flushPromises()
  },
  
  async clear(element: HTMLInputElement) {
    element.focus()
    element.value = ''
    const event = new Event('input', { bubbles: true })
    element.dispatchEvent(event)
    await flushPromises()
  }
}

// 模拟 API 响应
export function mockApiResponse(data: any, delay = 100) {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}

// 模拟错误响应
export function mockApiError(error: any, delay = 100) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), delay)
  })
}

// 创建模拟的 Store 数据
export function createMockStoreData() {
  return {
    app: {
      loading: false,
      userInfo: null,
      location: {
        latitude: 0,
        longitude: 0,
        address: ''
      },
      theme: 'light'
    },
    cart: {
      items: []
    },
    order: {
      orders: [],
      currentOrder: null
    },
    address: {
      addresses: [],
      currentAddress: null
    }
  }
}

// 断言辅助函数
export const assertions = {
  // 检查元素是否可见
  toBeVisible(element: Element) {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  },
  
  // 检查元素是否包含文本
  toContainText(element: Element, text: string) {
    return element.textContent?.includes(text) || false
  },
  
  // 检查元素是否有特定类名
  toHaveClass(element: Element, className: string) {
    return element.classList.contains(className)
  }
}

// 测试数据生成器
export const testDataGenerator = {
  // 生成用户数据
  createUser(overrides: Partial<any> = {}) {
    return {
      id: '1',
      phone: '13800138000',
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
      ...overrides
    }
  },
  
  // 生成商家数据
  createShop(overrides: Partial<any> = {}) {
    return {
      id: '1',
      name: '测试餐厅',
      image: 'https://example.com/shop.jpg',
      rating: 4.5,
      tags: ['快餐', '外卖'],
      deliveryFee: 3,
      deliveryTime: 30,
      distance: 1.2,
      ...overrides
    }
  },
  
  // 生成商品数据
  createProduct(overrides: Partial<any> = {}) {
    return {
      id: '1',
      name: '测试商品',
      image: 'https://example.com/product.jpg',
      price: 25.8,
      description: '这是一个测试商品',
      categoryId: '1',
      ...overrides
    }
  },
  
  // 生成订单数据
  createOrder(overrides: Partial<any> = {}) {
    return {
      id: '1',
      orderNo: 'ELM123456789',
      status: 'pending',
      shopId: '1',
      shopName: '测试餐厅',
      shopImage: 'https://example.com/shop.jpg',
      items: [testDataGenerator.createProduct()],
      totalAmount: 25.8,
      deliveryFee: 3,
      packagingFee: 2,
      discountAmount: 0,
      actualAmount: 30.8,
      deliveryAddress: {
        name: '张三',
        phone: '13800138000',
        address: '测试地址',
        detail: '详细地址'
      },
      deliveryTime: '立即送达',
      estimatedTime: 30,
      createTime: new Date().toISOString(),
      ...overrides
    }
  },
  
  // 生成地址数据
  createAddress(overrides: Partial<any> = {}) {
    return {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      address: '测试街道',
      detail: '测试小区1号楼',
      isDefault: true,
      tag: '家',
      ...overrides
    }
  }
}
