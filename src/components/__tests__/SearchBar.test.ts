import { describe, it, expect, vi } from 'vitest'
import { mountComponent, userEvent, flushPromises } from '@/test/utils'
import SearchBar from '@/components/Common/SearchBar.vue'

describe('SearchBar Component', () => {
  it('should render with default props', () => {
    const wrapper = mountComponent(SearchBar)
    
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入搜索关键词')
  })

  it('should render with custom placeholder', () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        placeholder: '搜索商家、商品'
      }
    })
    
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索商家、商品')
  })

  it('should emit update:modelValue when input changes', async () => {
    const wrapper = mountComponent(SearchBar)
    const input = wrapper.find('input').element as HTMLInputElement
    
    await userEvent.type(input, 'test')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test'])
  })

  it('should emit search event when enter is pressed', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        modelValue: 'test query'
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('keyup.enter')
    
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual(['test query'])
  })

  it('should emit search event when search button is clicked', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        modelValue: 'test query',
        showAction: true
      }
    })
    
    const searchButton = wrapper.find('.van-search__action')
    await searchButton.trigger('click')
    
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual(['test query'])
  })

  it('should emit cancel event when cancel button is clicked', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        showAction: true
      }
    })
    
    // 模拟点击取消按钮
    const cancelButton = wrapper.find('.van-search__action')
    await cancelButton.trigger('click')
    
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('should emit clear event when clear button is clicked', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        modelValue: 'test',
        clearable: true
      }
    })
    
    // 查找清除按钮并点击
    const clearButton = wrapper.find('.van-field__clear')
    if (clearButton.exists()) {
      await clearButton.trigger('click')
      expect(wrapper.emitted('clear')).toBeTruthy()
    }
  })

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        disabled: true
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('should be readonly when readonly prop is true', () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        readonly: true
      }
    })
    
    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
  })

  it('should emit click event when readonly input is clicked', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        readonly: true
      }
    })
    
    const input = wrapper.find('input')
    await input.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should emit focus and blur events', async () => {
    const wrapper = mountComponent(SearchBar)
    const input = wrapper.find('input')
    
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should emit clickInput event when input is clicked', async () => {
    const wrapper = mountComponent(SearchBar)
    const input = wrapper.find('input')
    
    await input.trigger('click')
    expect(wrapper.emitted('clickInput')).toBeTruthy()
  })

  it('should render custom left icon slot', () => {
    const wrapper = mountComponent(SearchBar, {
      slots: {
        leftIcon: '<div class="custom-left-icon">Custom Left</div>'
      }
    })
    
    expect(wrapper.find('.custom-left-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-left-icon').text()).toBe('Custom Left')
  })

  it('should render custom right icon slot', () => {
    const wrapper = mountComponent(SearchBar, {
      slots: {
        rightIcon: '<div class="custom-right-icon">Custom Right</div>'
      }
    })
    
    expect(wrapper.find('.custom-right-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-right-icon').text()).toBe('Custom Right')
  })

  it('should render custom action slot', () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        showAction: true
      },
      slots: {
        action: '<button class="custom-action">Custom Action</button>'
      }
    })
    
    expect(wrapper.find('.custom-action').exists()).toBe(true)
    expect(wrapper.find('.custom-action').text()).toBe('Custom Action')
  })

  it('should handle v-model correctly', async () => {
    const wrapper = mountComponent(SearchBar, {
      props: {
        modelValue: 'initial value'
      }
    })
    
    const input = wrapper.find('input').element as HTMLInputElement
    expect(input.value).toBe('initial value')
    
    await userEvent.clear(input)
    await userEvent.type(input, 'new value')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValues = wrapper.emitted('update:modelValue') as string[][]
    expect(emittedValues[emittedValues.length - 1][0]).toBe('new value')
  })
})
