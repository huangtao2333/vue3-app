import type { Directive, DirectiveBinding } from 'vue'

// 默认配置
const defaultOptions = {
  loading: '/loading.png',
  error: '/error.png',
  threshold: 0.1,
  rootMargin: '50px'
}

// 图片状态
enum ImageStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

// 图片元素接口
interface LazyImageElement extends HTMLImageElement {
  _lazyload?: {
    src: string
    loading: string
    error: string
    status: ImageStatus
    observer?: IntersectionObserver
  }
}

// 创建 IntersectionObserver
const createObserver = (options: IntersectionObserverInit) => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as LazyImageElement
        loadImage(img)
      }
    })
  }, options)
}

// 加载图片
const loadImage = (img: LazyImageElement) => {
  if (!img._lazyload || img._lazyload.status !== ImageStatus.LOADING) {
    return
  }

  const { src, error } = img._lazyload
  
  // 创建新的图片对象来预加载
  const image = new Image()
  
  image.onload = () => {
    img.src = src
    img._lazyload!.status = ImageStatus.LOADED
    img.classList.add('lazy-loaded')
    img.classList.remove('lazy-loading', 'lazy-error')
    
    // 停止观察
    if (img._lazyload!.observer) {
      img._lazyload!.observer.unobserve(img)
    }
  }
  
  image.onerror = () => {
    img.src = error
    img._lazyload!.status = ImageStatus.ERROR
    img.classList.add('lazy-error')
    img.classList.remove('lazy-loading', 'lazy-loaded')
    
    // 停止观察
    if (img._lazyload!.observer) {
      img._lazyload!.observer.unobserve(img)
    }
  }
  
  image.src = src
}

// 绑定懒加载
const bind = (el: LazyImageElement, binding: DirectiveBinding) => {
  const { value } = binding
  const options = { ...defaultOptions, ...(binding.modifiers || {}) }
  
  // 初始化懒加载数据
  el._lazyload = {
    src: value || el.src,
    loading: options.loading,
    error: options.error,
    status: ImageStatus.LOADING
  }
  
  // 设置初始状态
  el.src = options.loading
  el.classList.add('lazy-loading')
  
  // 如果支持 IntersectionObserver
  if (window.IntersectionObserver) {
    const observer = createObserver({
      threshold: options.threshold,
      rootMargin: options.rootMargin
    })
    
    el._lazyload.observer = observer
    observer.observe(el)
  } else {
    // 降级处理：直接加载图片
    loadImage(el)
  }
}

// 更新懒加载
const update = (el: LazyImageElement, binding: DirectiveBinding) => {
  const { value } = binding
  
  if (el._lazyload && value !== el._lazyload.src) {
    // 停止之前的观察
    if (el._lazyload.observer) {
      el._lazyload.observer.unobserve(el)
    }
    
    // 重新绑定
    bind(el, binding)
  }
}

// 解绑懒加载
const unbind = (el: LazyImageElement) => {
  if (el._lazyload?.observer) {
    el._lazyload.observer.unobserve(el)
    el._lazyload.observer.disconnect()
  }
  
  delete el._lazyload
}

// 懒加载指令
export const lazyload: Directive = {
  mounted: bind,
  updated: update,
  unmounted: unbind
}

// 懒加载插件
export default {
  install(app: any, options = {}) {
    // 合并配置
    Object.assign(defaultOptions, options)
    
    // 注册指令
    app.directive('lazyload', lazyload)
  }
}

// 预加载图片工具函数
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// 批量预加载图片
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(src => preloadImage(src)))
}

// 图片压缩工具
export const compressImage = (
  file: File,
  quality = 0.8,
  maxWidth = 800,
  maxHeight = 600
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to compress image'))
        }
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
