// 性能监控工具类
class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number> = new Map()

  // 标记时间点
  mark(name: string): void {
    this.marks.set(name, performance.now())
    
    if (performance.mark) {
      performance.mark(name)
    }
  }

  // 测量时间间隔
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark)
    const endTime = endMark ? this.marks.get(endMark) : performance.now()
    
    if (startTime === undefined) {
      console.warn(`Start mark "${startMark}" not found`)
      return 0
    }
    
    const duration = (endTime || performance.now()) - startTime
    this.measures.set(name, duration)
    
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
      } catch (error) {
        console.warn('Performance measure failed:', error)
      }
    }
    
    return duration
  }

  // 获取测量结果
  getMeasure(name: string): number | undefined {
    return this.measures.get(name)
  }

  // 清除标记
  clearMarks(): void {
    this.marks.clear()
    
    if (performance.clearMarks) {
      performance.clearMarks()
    }
  }

  // 清除测量
  clearMeasures(): void {
    this.measures.clear()
    
    if (performance.clearMeasures) {
      performance.clearMeasures()
    }
  }

  // 获取页面加载性能指标
  getPageLoadMetrics(): Record<string, number> {
    if (!performance.timing) {
      return {}
    }

    const timing = performance.timing
    const metrics = {
      // DNS 查询时间
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      // TCP 连接时间
      tcpConnect: timing.connectEnd - timing.connectStart,
      // 请求响应时间
      request: timing.responseEnd - timing.requestStart,
      // DOM 解析时间
      domParse: timing.domContentLoadedEventEnd - timing.domLoading,
      // 页面完全加载时间
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      // 首次渲染时间
      firstPaint: 0,
      // 首次内容渲染时间
      firstContentfulPaint: 0
    }

    // 获取 Paint Timing API 数据
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint')
      paintEntries.forEach((entry: any) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime
        }
      })
    }

    return metrics
  }

  // 监控资源加载性能
  getResourceMetrics(): Array<{
    name: string
    type: string
    duration: number
    size: number
  }> {
    if (!performance.getEntriesByType) {
      return []
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    return resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      duration: resource.responseEnd - resource.startTime,
      size: resource.transferSize || 0
    }))
  }

  // 监控长任务
  observeLongTasks(callback: (entries: PerformanceEntry[]) => void): PerformanceObserver | null {
    if (!window.PerformanceObserver) {
      return null
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      return observer
    } catch (error) {
      console.warn('Long task observer not supported:', error)
      return null
    }
  }

  // 监控内存使用情况
  getMemoryInfo(): Record<string, number> {
    const memory = (performance as any).memory
    
    if (!memory) {
      return {}
    }

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    }
  }

  // 计算 FPS
  measureFPS(duration = 1000): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0
      const startTime = performance.now()
      
      const countFrame = () => {
        frames++
        const currentTime = performance.now()
        
        if (currentTime - startTime < duration) {
          requestAnimationFrame(countFrame)
        } else {
          const fps = Math.round((frames * 1000) / (currentTime - startTime))
          resolve(fps)
        }
      }
      
      requestAnimationFrame(countFrame)
    })
  }

  // 报告性能数据
  report(): void {
    const pageMetrics = this.getPageLoadMetrics()
    const resourceMetrics = this.getResourceMetrics()
    const memoryInfo = this.getMemoryInfo()
    
    console.group('Performance Report')
    console.table(pageMetrics)
    console.table(resourceMetrics)
    console.table(memoryInfo)
    console.groupEnd()
  }
}

// 创建性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 性能装饰器
export function measurePerformance(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const measureName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      const startMark = `${measureName}-start`
      const endMark = `${measureName}-end`
      
      performanceMonitor.mark(startMark)
      
      try {
        const result = await originalMethod.apply(this, args)
        performanceMonitor.mark(endMark)
        
        const duration = performanceMonitor.measure(measureName, startMark, endMark)
        console.log(`${measureName} took ${duration.toFixed(2)}ms`)
        
        return result
      } catch (error) {
        performanceMonitor.mark(endMark)
        performanceMonitor.measure(measureName, startMark, endMark)
        throw error
      }
    }

    return descriptor
  }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func.apply(this, args)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}

// 空闲时执行
export function requestIdleCallback(callback: () => void, timeout = 5000): void {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback, { timeout })
  } else {
    setTimeout(callback, 1)
  }
}

export default performanceMonitor
