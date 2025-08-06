import { defineStore } from 'pinia'

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  detail: string
  isDefault: boolean
  tag?: string
  latitude?: number
  longitude?: number
}

interface AddressState {
  addresses: Address[]
  currentAddress: Address | null
}

export const useAddressStore = defineStore('address', {
  state: (): AddressState => ({
    addresses: [],
    currentAddress: null
  }),

  getters: {
    // 默认地址
    defaultAddress: (state) => {
      return state.addresses.find(addr => addr.isDefault) || state.addresses[0] || null
    },

    // 地址数量
    addressCount: (state) => state.addresses.length,

    // 完整地址
    getFullAddress: () => (address: Address) => {
      return `${address.province}${address.city}${address.district}${address.address}${address.detail}`
    }
  },

  actions: {
    // 设置地址列表
    setAddresses(addresses: Address[]) {
      this.addresses = addresses
    },

    // 添加地址
    addAddress(address: Address) {
      // 如果是第一个地址或者设置为默认地址，则设为默认
      if (this.addresses.length === 0 || address.isDefault) {
        this.clearDefaultAddress()
        address.isDefault = true
      }
      
      this.addresses.push(address)
    },

    // 更新地址
    updateAddress(addressId: string, updates: Partial<Address>) {
      const index = this.addresses.findIndex(addr => addr.id === addressId)
      if (index > -1) {
        // 如果设置为默认地址，先清除其他默认地址
        if (updates.isDefault) {
          this.clearDefaultAddress()
        }
        
        this.addresses[index] = { ...this.addresses[index], ...updates }
      }
    },

    // 删除地址
    deleteAddress(addressId: string) {
      const index = this.addresses.findIndex(addr => addr.id === addressId)
      if (index > -1) {
        const deletedAddress = this.addresses[index]
        this.addresses.splice(index, 1)
        
        // 如果删除的是默认地址，设置第一个地址为默认
        if (deletedAddress.isDefault && this.addresses.length > 0) {
          this.addresses[0].isDefault = true
        }
      }
    },

    // 设置默认地址
    setDefaultAddress(addressId: string) {
      this.clearDefaultAddress()
      const address = this.addresses.find(addr => addr.id === addressId)
      if (address) {
        address.isDefault = true
      }
    },

    // 清除默认地址标记
    clearDefaultAddress() {
      this.addresses.forEach(addr => {
        addr.isDefault = false
      })
    },

    // 设置当前选中地址
    setCurrentAddress(address: Address | null) {
      this.currentAddress = address
    },

    // 根据ID获取地址
    getAddressById(addressId: string) {
      return this.addresses.find(addr => addr.id === addressId) || null
    },

    // 清空地址列表
    clearAddresses() {
      this.addresses = []
      this.currentAddress = null
    }
  },

  persist: {
    key: 'address-store'
  }
})
