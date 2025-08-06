import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock navigator
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
})

Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
})

// Mock fetch
global.fetch = vi.fn()

// Mock Image
global.Image = class {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload()
      }
    }, 100)
  }
}

// Vue Test Utils 全局配置
config.global.mocks = {
  $t: (key: string) => key,
  $route: {
    path: '/',
    params: {},
    query: {},
    meta: {},
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
}

// Mock Vant components
config.global.stubs = {
  'van-search': {
    template: '<div class="van-search"><input v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
    emits: ['update:modelValue', 'search', 'cancel', 'clear', 'focus', 'blur', 'click-input']
  },
  'van-button': {
    template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
    emits: ['click']
  },
  'van-icon': {
    template: '<i class="van-icon" v-bind="$attrs"><slot /></i>'
  },
  'van-field': {
    template: '<div class="van-field"><input v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
    emits: ['update:modelValue', 'focus', 'blur', 'clear']
  }
}

// 清理函数
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})
