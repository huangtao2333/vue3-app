import request from '@/utils/request'
import type { Order } from '@/stores/order'

// 订单列表参数
export interface OrderListParams {
  status?: string
  page?: number
  pageSize?: number
}

// 创建订单参数
export interface CreateOrderParams {
  shopId: string
  items: Array<{
    productId: string
    quantity: number
    specs?: string[]
  }>
  deliveryAddressId: string
  deliveryTime: string
  remark?: string
  couponId?: string
}

// 订单列表响应
export interface OrderListResponse {
  list: Order[]
  total: number
  hasMore: boolean
}

// 获取订单列表
export const getOrderList = (params: OrderListParams): Promise<OrderListResponse> => {
  // 模拟数据
  const mockOrders: Order[] = Array.from({ length: params.pageSize || 10 }, (_, index) => {
    const id = (params.page || 1) * 10 + index + 1
    const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'delivering', 'completed']
    const status = params.status as Order['status'] || statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
      id: id.toString(),
      orderNo: `ELM${Date.now() + index}`,
      status,
      shopId: Math.floor(Math.random() * 10 + 1).toString(),
      shopName: `美味餐厅${Math.floor(Math.random() * 10 + 1)}`,
      shopImage: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`,
      items: [
        {
          id: '1',
          name: '汉堡套餐',
          price: 25.8,
          quantity: 1,
          image: `/banner${((id - 1) % 4) + 1}.${((id - 1) % 4) === 0 ? 'jpg' : 'webp'}`
        },
        {
          id: '2',
          name: '可乐',
          price: 8.5,
          quantity: 2,
          image: `/banner${(id % 4) + 1}.${(id % 4) === 1 ? 'jpg' : 'webp'}`
        }
      ],
      totalAmount: 42.8,
      deliveryFee: 3,
      packagingFee: 2,
      discountAmount: 5,
      actualAmount: 42.8,
      deliveryAddress: {
        name: '张三',
        phone: '138****8888',
        address: '北京市朝阳区',
        detail: '某某小区某某号楼某某单元某某室'
      },
      deliveryTime: '立即送达',
      estimatedTime: 30,
      createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      payTime: status !== 'pending' ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      completeTime: status === 'completed' ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined
    }
  })

  return Promise.resolve({
    list: mockOrders,
    total: 50,
    hasMore: (params.page || 1) < 5
  })
}

// 获取订单详情
export const getOrderDetail = (orderId: string): Promise<Order> => {
  return request.get(`/orders/${orderId}`)
}

// 创建订单
export const createOrder = (params: CreateOrderParams): Promise<Order> => {
  return request.post('/orders', params)
}

// 取消订单
export const cancelOrder = (orderId: string, reason?: string): Promise<void> => {
  return request.post(`/orders/${orderId}/cancel`, { reason })
}

// 确认收货
export const confirmOrder = (orderId: string): Promise<void> => {
  return request.post(`/orders/${orderId}/confirm`)
}

// 删除订单
export const deleteOrder = (orderId: string): Promise<void> => {
  return request.delete(`/orders/${orderId}`)
}

// 重新下单
export const reorder = (orderId: string): Promise<Order> => {
  return request.post(`/orders/${orderId}/reorder`)
}

// 订单评价
export const rateOrder = (orderId: string, rating: {
  shopRating: number
  deliveryRating: number
  comment: string
  images?: string[]
}): Promise<void> => {
  return request.post(`/orders/${orderId}/rate`, rating)
}
