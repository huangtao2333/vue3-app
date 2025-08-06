import { defineStore } from 'pinia'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  specs?: string[]
}

export interface Order {
  id: string
  orderNo: string
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled'
  shopId: string
  shopName: string
  shopImage: string
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  packagingFee: number
  discountAmount: number
  actualAmount: number
  deliveryAddress: {
    name: string
    phone: string
    address: string
    detail: string
  }
  deliveryTime: string
  estimatedTime: number
  createTime: string
  payTime?: string
  completeTime?: string
  remark?: string
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null
  }),

  getters: {
    // 根据状态获取订单
    getOrdersByStatus: (state) => (status: string) => {
      return state.orders.filter(order => order.status === status)
    },

    // 待付款订单数量
    pendingOrderCount: (state) => {
      return state.orders.filter(order => order.status === 'pending').length
    },

    // 进行中订单数量
    activeOrderCount: (state) => {
      return state.orders.filter(order => 
        ['confirmed', 'preparing', 'delivering'].includes(order.status)
      ).length
    },

    // 已完成订单数量
    completedOrderCount: (state) => {
      return state.orders.filter(order => order.status === 'completed').length
    }
  },

  actions: {
    // 设置订单列表
    setOrders(orders: Order[]) {
      this.orders = orders
    },

    // 添加订单
    addOrder(order: Order) {
      this.orders.unshift(order)
    },

    // 更新订单状态
    updateOrderStatus(orderId: string, status: Order['status']) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        
        // 更新相关时间
        const now = new Date().toISOString()
        switch (status) {
          case 'confirmed':
            order.payTime = now
            break
          case 'completed':
            order.completeTime = now
            break
        }
      }
    },

    // 设置当前订单
    setCurrentOrder(order: Order | null) {
      this.currentOrder = order
    },

    // 取消订单
    cancelOrder(orderId: string) {
      this.updateOrderStatus(orderId, 'cancelled')
    },

    // 删除订单
    deleteOrder(orderId: string) {
      const index = this.orders.findIndex(o => o.id === orderId)
      if (index > -1) {
        this.orders.splice(index, 1)
      }
    },

    // 创建订单
    createOrder(orderData: Partial<Order>): Order {
      const order: Order = {
        id: Date.now().toString(),
        orderNo: `ELM${Date.now()}`,
        status: 'pending',
        shopId: '',
        shopName: '',
        shopImage: '',
        items: [],
        totalAmount: 0,
        deliveryFee: 0,
        packagingFee: 2,
        discountAmount: 0,
        actualAmount: 0,
        deliveryAddress: {
          name: '',
          phone: '',
          address: '',
          detail: ''
        },
        deliveryTime: '',
        estimatedTime: 30,
        createTime: new Date().toISOString(),
        ...orderData
      }

      // 计算实际金额
      order.actualAmount = order.totalAmount + order.deliveryFee + order.packagingFee - order.discountAmount

      this.addOrder(order)
      return order
    },

    // 清空订单列表
    clearOrders() {
      this.orders = []
    }
  },

  persist: {
    key: 'order-store',
    paths: ['orders']
  }
})
