// 缓存管理工具类
class CacheManager {
  private prefix = 'eleme_app_'
  private defaultExpiry = 30 * 60 * 1000 // 30分钟

  // 设置缓存
  set(key: string, value: any, expiry?: number): void {
    const item = {
      value,
      expiry: Date.now() + (expiry || this.defaultExpiry)
    }
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('缓存设置失败:', error)
    }
  }

  // 获取缓存
  get<T = any>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)
      
      // 检查是否过期
      if (Date.now() > item.expiry) {
        this.remove(key)
        return null
      }

      return item.value
    } catch (error) {
      console.warn('缓存获取失败:', error)
      return null
    }
  }

  // 删除缓存
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.warn('缓存删除失败:', error)
    }
  }

  // 清空所有缓存
  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('缓存清空失败:', error)
    }
  }

  // 检查缓存是否存在且未过期
  has(key: string): boolean {
    return this.get(key) !== null
  }

  // 获取缓存大小（字节）
  getSize(): number {
    let size = 0
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          size += localStorage.getItem(key)?.length || 0
        }
      })
    } catch (error) {
      console.warn('获取缓存大小失败:', error)
    }
    return size
  }

  // 清理过期缓存
  clearExpired(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const itemStr = localStorage.getItem(key)
          if (itemStr) {
            try {
              const item = JSON.parse(itemStr)
              if (Date.now() > item.expiry) {
                localStorage.removeItem(key)
              }
            } catch {
              // 解析失败，删除该项
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (error) {
      console.warn('清理过期缓存失败:', error)
    }
  }
}

// 创建缓存实例
export const cache = new CacheManager()

// 内存缓存类（用于临时数据）
class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>()
  private defaultExpiry = 5 * 60 * 1000 // 5分钟

  set(key: string, value: any, expiry?: number): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (expiry || this.defaultExpiry)
    })
  }

  get<T = any>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  remove(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  size(): number {
    return this.cache.size
  }

  // 清理过期缓存
  clearExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

// 创建内存缓存实例
export const memoryCache = new MemoryCache()

// 定期清理过期缓存
setInterval(() => {
  cache.clearExpired()
  memoryCache.clearExpired()
}, 10 * 60 * 1000) // 每10分钟清理一次

// 缓存装饰器
export function cached(expiry?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}_${propertyKey}_${JSON.stringify(args)}`
      
      // 尝试从缓存获取
      const cachedResult = memoryCache.get(cacheKey)
      if (cachedResult !== null) {
        return cachedResult
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args)
      
      // 缓存结果
      memoryCache.set(cacheKey, result, expiry)
      
      return result
    }

    return descriptor
  }
}

export default cache
