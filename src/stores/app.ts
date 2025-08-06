import { defineStore } from 'pinia'

interface AppState {
  loading: boolean
  userInfo: any
  location: {
    latitude: number
    longitude: number
    address: string
  }
  theme: 'light' | 'dark'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    userInfo: null,
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    theme: 'light'
  }),

  getters: {
    isLoggedIn: (state) => !!state.userInfo,
    hasLocation: (state) => state.location.latitude !== 0 && state.location.longitude !== 0
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },

    setLocation(location: Partial<AppState['location']>) {
      this.location = { ...this.location, ...location }
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
    },

    logout() {
      this.userInfo = null
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    // 获取用户位置
    async getCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('浏览器不支持地理位置'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            this.setLocation({ latitude, longitude })
            resolve({ latitude, longitude })
          },
          (error) => {
            reject(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      })
    }
  },

  persist: {
    key: 'app-store',
    paths: ['userInfo', 'location', 'theme']
  }
})
