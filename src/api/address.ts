import request from '@/utils/request'
import type { Address } from '@/stores/address'

// 创建/更新地址参数
export interface AddressParams {
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  detail: string
  isDefault?: boolean
  tag?: string
}

// 获取地址列表
export const getAddressList = (): Promise<Address[]> => {
  // 模拟数据
  return Promise.resolve([
    {
      id: '1',
      name: '张三',
      phone: '138****8888',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      address: '某某街道某某小区',
      detail: '1号楼2单元301室',
      isDefault: true,
      tag: '家',
      latitude: 39.9042,
      longitude: 116.4074
    },
    {
      id: '2',
      name: '李四',
      phone: '139****9999',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      address: '某某路某某大厦',
      detail: '15层1501室',
      isDefault: false,
      tag: '公司',
      latitude: 39.9889,
      longitude: 116.3058
    }
  ])
}

// 获取地址详情
export const getAddressDetail = (addressId: string): Promise<Address> => {
  return request.get(`/addresses/${addressId}`)
}

// 创建地址
export const createAddress = (params: AddressParams): Promise<Address> => {
  return request.post('/addresses', params)
}

// 更新地址
export const updateAddress = (addressId: string, params: AddressParams): Promise<Address> => {
  return request.put(`/addresses/${addressId}`, params)
}

// 删除地址
export const deleteAddress = (addressId: string): Promise<void> => {
  return request.delete(`/addresses/${addressId}`)
}

// 设置默认地址
export const setDefaultAddress = (addressId: string): Promise<void> => {
  return request.post(`/addresses/${addressId}/default`)
}

// 地址搜索
export const searchAddress = (keyword: string): Promise<Array<{
  name: string
  address: string
  latitude: number
  longitude: number
}>> => {
  // 模拟数据
  return Promise.resolve([
    {
      name: '北京朝阳大悦城',
      address: '北京市朝阳区朝阳北路101号',
      latitude: 39.9042,
      longitude: 116.4074
    },
    {
      name: '北京三里屯太古里',
      address: '北京市朝阳区三里屯路19号',
      latitude: 39.9389,
      longitude: 116.4553
    }
  ])
}

// 逆地理编码（根据坐标获取地址）
export const reverseGeocode = (latitude: number, longitude: number): Promise<{
  province: string
  city: string
  district: string
  address: string
  formatted_address: string
}> => {
  // 模拟数据
  return Promise.resolve({
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '某某街道某某小区',
    formatted_address: '北京市朝阳区某某街道某某小区'
  })
}
