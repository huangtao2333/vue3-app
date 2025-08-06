<template>
  <div class="address-page">
    <NavBar title="收货地址" left-arrow>
      <template #right>
        <van-button type="primary" size="small" @click="addAddress">
          新增
        </van-button>
      </template>
    </NavBar>
    
    <div class="address-list">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="address-item"
        @click="selectAddress(address)"
      >
        <div class="address-info">
          <div class="address-header">
            <span class="contact-name">{{ address.name }}</span>
            <span class="contact-phone">{{ address.phone }}</span>
            <span v-if="address.isDefault" class="default-tag">默认</span>
          </div>
          
          <div class="address-detail">
            {{ getFullAddress(address) }}
          </div>
          
          <div v-if="address.tag" class="address-tag">
            {{ address.tag }}
          </div>
        </div>
        
        <div class="address-actions">
          <van-button
            type="primary"
            size="mini"
            @click.stop="editAddress(address)"
          >
            编辑
          </van-button>
          <van-button
            type="danger"
            size="mini"
            @click.stop="deleteAddress(address.id)"
          >
            删除
          </van-button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <Empty
        v-if="addresses.length === 0"
        description="暂无收货地址"
        button-text="添加地址"
        @button-click="addAddress"
      />
    </div>
    
    <!-- 地址编辑弹窗 -->
    <van-popup
      v-model:show="showAddressForm"
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="address-form">
        <div class="form-header">
          <h3>{{ editingAddress ? '编辑地址' : '新增地址' }}</h3>
          <van-button type="primary" size="small" @click="saveAddress">
            保存
          </van-button>
        </div>
        
        <van-form ref="formRef">
          <van-field
            v-model="addressForm.name"
            label="联系人"
            placeholder="请输入联系人姓名"
            :rules="[{ required: true, message: '请输入联系人姓名' }]"
          />
          
          <van-field
            v-model="addressForm.phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          />
          
          <van-field
            v-model="addressForm.region"
            label="所在地区"
            placeholder="请选择省市区"
            readonly
            is-link
            @click="showAreaPicker = true"
            :rules="[{ required: true, message: '请选择所在地区' }]"
          />
          
          <van-field
            v-model="addressForm.address"
            label="详细地址"
            placeholder="街道、楼牌号等"
            :rules="[{ required: true, message: '请输入详细地址' }]"
          />
          
          <van-field
            v-model="addressForm.detail"
            label="门牌号"
            placeholder="如：5号楼3单元101室"
          />
          
          <van-field
            v-model="addressForm.tag"
            label="地址标签"
            placeholder="如：家、公司等"
          />
          
          <van-cell>
            <template #title>
              <span>设为默认地址</span>
            </template>
            <template #right-icon>
              <van-switch v-model="addressForm.isDefault" />
            </template>
          </van-cell>
        </van-form>
      </div>
    </van-popup>
    
    <!-- 地区选择器 -->
    <van-popup v-model:show="showAreaPicker" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAddressStore } from '@/stores/address'
import NavBar from '@/components/Layout/NavBar.vue'
import Empty from '@/components/Common/Empty.vue'
import { showConfirmDialog, showToast } from 'vant'
import { getAddressList } from '@/api/address'

// 地址类型定义
interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  detail: string
  tag?: string
  isDefault: boolean
}

const router = useRouter()
const addressStore = useAddressStore()

// 响应式数据
const addresses = ref<Address[]>([])
const showAddressForm = ref(false)
const showAreaPicker = ref(false)
const editingAddress = ref<Address | null>(null)

// 表单数据
const addressForm = reactive({
  name: '',
  phone: '',
  region: '',
  province: '',
  city: '',
  district: '',
  address: '',
  detail: '',
  tag: '',
  isDefault: false
})

// 地区数据（简化版）
const areaList = {
  province_list: {
    110000: '北京市',
    120000: '天津市',
    310000: '上海市',
    440000: '广东省'
  },
  city_list: {
    110100: '北京市',
    120100: '天津市',
    310100: '上海市',
    440100: '广州市',
    440300: '深圳市'
  },
  county_list: {
    110101: '东城区',
    110102: '西城区',
    110105: '朝阳区',
    110106: '丰台区',
    440103: '荔湾区',
    440104: '越秀区',
    440305: '南山区',
    440306: '宝安区'
  }
}

// 获取完整地址
const getFullAddress = (address: any) => {
  return `${address.province}${address.city}${address.district}${address.address}${address.detail}`
}

// 获取地址列表
const fetchAddresses = async () => {
  try {
    const data = await getAddressList()
    addresses.value = data
    addressStore.setAddresses(data)
  } catch (error) {
    console.error('获取地址列表失败:', error)
  }
}

// 选择地址
const selectAddress = (address: any) => {
  addressStore.setCurrentAddress(address)
  router.back()
}

// 新增地址
const addAddress = () => {
  editingAddress.value = null
  resetForm()
  showAddressForm.value = true
}

// 编辑地址
const editAddress = (address: any) => {
  editingAddress.value = address
  Object.assign(addressForm, {
    name: address.name,
    phone: address.phone,
    region: `${address.province} ${address.city} ${address.district}`,
    province: address.province,
    city: address.city,
    district: address.district,
    address: address.address,
    detail: address.detail,
    tag: address.tag || '',
    isDefault: address.isDefault
  })
  showAddressForm.value = true
}

// 删除地址
const deleteAddress = async (addressId: string) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个地址吗？'
    })
    
    // TODO: 调用删除地址API
    console.log('删除地址:', addressId)
    
    // 从列表中移除
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index > -1) {
      addresses.value.splice(index, 1)
    }
    
    showToast('删除成功')
  } catch {
    // 用户取消
  }
}

// 保存地址
const saveAddress = async () => {
  try {
    // TODO: 表单验证
    if (!addressForm.name || !addressForm.phone || !addressForm.region || !addressForm.address) {
      showToast('请填写完整信息')
      return
    }
    
    const addressData = {
      name: addressForm.name,
      phone: addressForm.phone,
      province: addressForm.province,
      city: addressForm.city,
      district: addressForm.district,
      address: addressForm.address,
      detail: addressForm.detail,
      tag: addressForm.tag,
      isDefault: addressForm.isDefault
    }
    
    if (editingAddress.value) {
      // 编辑地址
      console.log('编辑地址:', addressData)
      // TODO: 调用编辑地址API
    } else {
      // 新增地址
      console.log('新增地址:', addressData)
      // TODO: 调用新增地址API
    }
    
    showAddressForm.value = false
    showToast('保存成功')
    fetchAddresses()
  } catch (error) {
    console.error('保存地址失败:', error)
  }
}

// 地区选择确认
const onAreaConfirm = ({ selectedValues, selectedOptions }: any) => {
  addressForm.province = selectedOptions[0]?.text || ''
  addressForm.city = selectedOptions[1]?.text || ''
  addressForm.district = selectedOptions[2]?.text || ''
  addressForm.region = `${addressForm.province} ${addressForm.city} ${addressForm.district}`
  showAreaPicker.value = false
}

// 重置表单
const resetForm = () => {
  Object.assign(addressForm, {
    name: '',
    phone: '',
    region: '',
    province: '',
    city: '',
    district: '',
    address: '',
    detail: '',
    tag: '',
    isDefault: false
  })
}

// 生命周期
onMounted(() => {
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background-color: $background-color;
}

.address-list {
  padding: $padding-sm;
}

.address-item {
  display: flex;
  background-color: $white;
  padding: $padding-md;
  margin-bottom: $padding-sm;
  border-radius: $border-radius-lg;
  cursor: pointer;
  
  &:hover {
    background-color: $gray-1;
  }
  
  .address-info {
    flex: 1;
    
    .address-header {
      display: flex;
      align-items: center;
      margin-bottom: $padding-xs;
      
      .contact-name {
        font-size: $font-size-md;
        font-weight: 500;
        color: $text-color;
        margin-right: $padding-md;
      }
      
      .contact-phone {
        font-size: $font-size-sm;
        color: $text-color-2;
        margin-right: $padding-sm;
      }
      
      .default-tag {
        background-color: $primary-color;
        color: $white;
        font-size: $font-size-xs;
        padding: 2px $padding-xs;
        border-radius: $border-radius-sm;
      }
    }
    
    .address-detail {
      font-size: $font-size-sm;
      color: $text-color-2;
      line-height: 1.4;
      margin-bottom: $padding-xs;
    }
    
    .address-tag {
      display: inline-block;
      background-color: $gray-2;
      color: $text-color-3;
      font-size: $font-size-xs;
      padding: 2px $padding-xs;
      border-radius: $border-radius-sm;
    }
  }
  
  .address-actions {
    display: flex;
    flex-direction: column;
    gap: $padding-xs;
    margin-left: $padding-md;
  }
}

.address-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-md;
    border-bottom: 1px solid $border-color;
    
    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
    }
  }
  
  :deep(.van-form) {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
