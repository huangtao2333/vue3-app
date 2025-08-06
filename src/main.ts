import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'

// Vant UI
import 'vant/lib/index.css'
import {
  Lazyload,
  Picker,
  Popup,
  Button,
  Field,
  Form,
  Cell,
  CellGroup,
  NavBar,
  Icon,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Image as VanImage,
  Loading,
  PullRefresh,
  List,
  Empty,
  Tabbar,
  TabbarItem,
  Tabs,
  Tab,
  Card,
  Tag,
  Rate,
  Stepper,
  Checkbox,
  CheckboxGroup,
  Switch,
  Uploader,
  Dialog,
  Toast,
  Notify,
  Collapse,
  CollapseItem,
  Search
} from 'vant'

// Touch emulator for desktop
import '@vant/touch-emulator'

// Global styles
import './styles/index.scss'

// PWA
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

// Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Router
app.use(router)

// Vant components
const vantComponents = [
  Picker, Popup, Button, Field, Form, Cell, CellGroup, NavBar, Icon,
  Swipe, SwipeItem, Grid, GridItem, VanImage, Loading, PullRefresh,
  List, Empty, Tabbar, TabbarItem, Tabs, Tab, Card, Tag, Rate,
  Stepper, Checkbox, CheckboxGroup, Switch, Uploader, Dialog, Toast,
  Notify, Collapse, CollapseItem, Search
]

vantComponents.forEach(component => {
  app.use(component)
})

// Vant plugins
app.use(Lazyload, {
  loading: '/loading.png',
  error: '/error.png'
})

// PWA service worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  }
})

app.mount('#app')
