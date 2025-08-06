import { ref, readonly, computed, onMounted, onUnmounted } from 'vue'

// 网络状态管理
class NetworkManager {
  private listeners: Set<(online: boolean) => void> = new Set()
  private _isOnline = navigator.onLine

  constructor() {
    this.init()
  }

  private init() {
    // 监听网络状态变化
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
    
    // 定期检查网络连接
    this.startPeriodicCheck()
  }

  private handleOnline = () => {
    this._isOnline = true
    this.notifyListeners(true)
    console.log('网络已连接')
  }

  private handleOffline = () => {
    this._isOnline = false
    this.notifyListeners(false)
    console.log('网络已断开')
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(online)
      } catch (error) {
        console.error('Network listener error:', error)
      }
    })
  }

  // 定期检查网络连接（通过发送请求）
  private startPeriodicCheck() {
    setInterval(async () => {
      const isOnline = await this.checkConnection()
      if (isOnline !== this._isOnline) {
        this._isOnline = isOnline
        this.notifyListeners(isOnline)
      }
    }, 30000) // 每30秒检查一次
  }

  // 检查网络连接
  async checkConnection(): Promise<boolean> {
    try {
      // 发送一个小的请求来检查连接
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5秒超时
      })
      return response.ok
    } catch {
      return false
    }
  }

  // 获取当前网络状态
  get isOnline(): boolean {
    return this._isOnline
  }

  // 添加网络状态监听器
  addListener(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      this.listeners.delete(listener)
    }
  }

  // 获取网络连接信息
  getConnectionInfo(): {
    type: string
    effectiveType: string
    downlink: number
    rtt: number
    saveData: boolean
  } | null {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (!connection) return null

    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    }
  }

  // 检查是否为慢速网络
  isSlowConnection(): boolean {
    const connection = this.getConnectionInfo()
    if (!connection) return false

    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.saveData
  }

  // 销毁
  destroy() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    this.listeners.clear()
  }
}

// 创建网络管理器实例
export const networkManager = new NetworkManager()

// 网络状态 Hook
export function useNetwork() {
  const isOnline = ref(networkManager.isOnline)
  const connectionInfo = ref(networkManager.getConnectionInfo())

  onMounted(() => {
    const unsubscribe = networkManager.addListener((online) => {
      isOnline.value = online
      connectionInfo.value = networkManager.getConnectionInfo()
    })

    onUnmounted(() => {
      unsubscribe()
    })
  })

  return {
    isOnline: readonly(isOnline),
    connectionInfo: readonly(connectionInfo),
    isSlowConnection: computed(() => networkManager.isSlowConnection())
  }
}

// 离线存储管理
class OfflineStorage {
  private dbName = 'eleme_offline'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建存储对象
        if (!db.objectStoreNames.contains('requests')) {
          const requestStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true })
          requestStore.createIndex('url', 'url', { unique: false })
          requestStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('expiry', 'expiry', { unique: false })
        }
      }
    })
  }

  // 存储离线请求
  async storeOfflineRequest(request: {
    url: string
    method: string
    headers: Record<string, string>
    body?: any
    timestamp: number
  }): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite')
      const store = transaction.objectStore('requests')
      const request_op = store.add(request)

      request_op.onerror = () => reject(request_op.error)
      request_op.onsuccess = () => resolve()
    })
  }

  // 获取离线请求
  async getOfflineRequests(): Promise<any[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readonly')
      const store = transaction.objectStore('requests')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // 删除离线请求
  async deleteOfflineRequest(id: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['requests'], 'readwrite')
      const store = transaction.objectStore('requests')
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // 存储缓存数据
  async setCache(key: string, data: any, expiry: number): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.put({ key, data, expiry })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // 获取缓存数据
  async getCache(key: string): Promise<any | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        if (!result) {
          resolve(null)
          return
        }

        // 检查是否过期
        if (Date.now() > result.expiry) {
          this.deleteCache(key)
          resolve(null)
          return
        }

        resolve(result.data)
      }
    })
  }

  // 删除缓存数据
  async deleteCache(key: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // 清理过期缓存
  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('expiry')
      const range = IDBKeyRange.upperBound(Date.now())
      const request = index.openCursor(range)

      request.onerror = () => reject(request.error)
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }
}

// 创建离线存储实例
export const offlineStorage = new OfflineStorage()

// 离线请求队列管理
class OfflineRequestQueue {
  private processing = false

  // 添加离线请求
  async addRequest(url: string, options: RequestInit): Promise<void> {
    const request = {
      url,
      method: options.method || 'GET',
      headers: this.serializeHeaders(options.headers),
      body: options.body ? JSON.stringify(options.body) : undefined,
      timestamp: Date.now()
    }

    await offlineStorage.storeOfflineRequest(request)
    console.log('离线请求已保存:', url)
  }

  // 处理离线请求队列
  async processQueue(): Promise<void> {
    if (this.processing || !networkManager.isOnline) {
      return
    }

    this.processing = true

    try {
      const requests = await offlineStorage.getOfflineRequests()
      
      for (const request of requests) {
        try {
          const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body
          })

          if (response.ok) {
            await offlineStorage.deleteOfflineRequest(request.id)
            console.log('离线请求已同步:', request.url)
          }
        } catch (error) {
          console.error('离线请求同步失败:', request.url, error)
        }
      }
    } finally {
      this.processing = false
    }
  }

  private serializeHeaders(headers?: HeadersInit): Record<string, string> {
    const result: Record<string, string> = {}
    
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        result[key] = value
      })
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        result[key] = value
      })
    } else if (headers) {
      Object.assign(result, headers)
    }
    
    return result
  }
}

// 创建离线请求队列实例
export const offlineRequestQueue = new OfflineRequestQueue()

// 监听网络状态，自动处理离线请求
networkManager.addListener((online) => {
  if (online) {
    offlineRequestQueue.processQueue()
  }
})

export default networkManager
