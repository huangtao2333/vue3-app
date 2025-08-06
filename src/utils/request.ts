import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showError?: boolean
}

// 响应数据接口
interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

class Request {
  private instance: AxiosInstance
  private loadingCount = 0

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 显示加载提示
        if (config.showLoading !== false) {
          this.showLoading()
        }

        return config
      },
      (error) => {
        this.hideLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        this.hideLoading()

        const { data } = response
        
        // 请求成功
        if (data.code === 200) {
          return data.data
        }

        // 业务错误
        if ((response.config as any).showError !== false) {
          showToast(data.message || '请求失败')
        }

        return Promise.reject(new Error(data.message || '请求失败'))
      },
      (error) => {
        this.hideLoading()

        let message = '网络错误'

        if (error.response) {
          const { status, data } = error.response
          
          switch (status) {
            case 401:
              message = '登录已过期，请重新登录'
              // 清除token并跳转到登录页
              localStorage.removeItem('token')
              localStorage.removeItem('userInfo')
              window.location.href = '/login'
              break
            case 403:
              message = '没有权限访问'
              break
            case 404:
              message = '请求的资源不存在'
              break
            case 500:
              message = '服务器内部错误'
              break
            default:
              message = data?.message || `请求失败 (${status})`
          }
        } else if (error.code === 'ECONNABORTED') {
          message = '请求超时'
        } else if (error.message === 'Network Error') {
          message = '网络连接失败'
        }

        if (error.config?.showError !== false) {
          showToast(message)
        }

        return Promise.reject(error)
      }
    )
  }

  private showLoading() {
    if (this.loadingCount === 0) {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    }
    this.loadingCount++
  }

  private hideLoading() {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      closeToast()
    }
  }

  // GET请求
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  // POST请求
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // PUT请求
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  // DELETE请求
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  // 上传文件
  upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const request = new Request()
export default request
