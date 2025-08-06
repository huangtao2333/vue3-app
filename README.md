# Vue3饿了吗高性能App项目实战

一个基于 Vue3 + TypeScript + Vite 构建的高性能移动端外卖应用，仿饿了吗设计。

## ✨ 特性

- 🚀 **现代技术栈**: Vue3 + TypeScript + Vite + Pinia
- 📱 **移动端优化**: 响应式设计，完美适配各种移动设备
- ⚡ **高性能**: 虚拟滚动、图片懒加载、代码分割等优化策略
- 🎨 **UI组件**: 基于 Vant 4 构建的美观界面
- 🔄 **PWA支持**: 离线缓存、桌面安装、推送通知
- 🛡️ **类型安全**: 完整的 TypeScript 类型定义
- 🧪 **测试覆盖**: 单元测试、集成测试
- 📦 **工程化**: ESLint、Prettier、Husky、CI/CD

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript 5.3+
- **构建工具**: Vite 5.0+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **UI组件**: Vant 4.8+
- **样式**: SCSS + PostCSS
- **测试**: Vitest + Vue Test Utils

### 工程化工具
- **代码规范**: ESLint + Prettier
- **Git钩子**: Husky + lint-staged
- **自动化**: GitHub Actions
- **容器化**: Docker + Docker Compose
- **性能监控**: Lighthouse CI

## 📁 项目结构

```
src/
├── api/                    # API接口
├── assets/                 # 静态资源
├── components/             # 公共组件
│   ├── Common/            # 通用组件
│   ├── Layout/            # 布局组件
│   ├── Product/           # 商品相关组件
│   └── Shop/              # 商家相关组件
├── directives/            # 自定义指令
├── router/                # 路由配置
├── stores/                # 状态管理
├── styles/                # 全局样式
├── test/                  # 测试工具
├── utils/                 # 工具函数
├── views/                 # 页面组件
│   ├── Home/             # 首页
│   ├── Category/         # 分类页
│   ├── Cart/             # 购物车
│   ├── Profile/          # 个人中心
│   ├── Shop/             # 商家详情
│   ├── Search/           # 搜索页
│   ├── Order/            # 订单页
│   ├── Address/          # 地址管理
│   └── Login/            # 登录页
├── App.vue               # 根组件
└── main.ts               # 入口文件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 运行测试
```bash
# 单元测试
npm run test

# 测试覆盖率
npm run test:coverage

# 测试UI
npm run test:ui
```

### 代码检查
```bash
# ESLint检查
npm run lint

# 类型检查
npm run type-check
```

## 🐳 Docker 部署

### 构建镜像
```bash
docker build -t vue3-eleme-app .
```

### 运行容器
```bash
docker run -p 3000:80 vue3-eleme-app
```

### 使用 Docker Compose
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📱 功能特性

### 核心功能
- [x] 用户注册/登录
- [x] 首页推荐
- [x] 商家列表
- [x] 商品搜索
- [x] 购物车管理
- [x] 订单管理
- [x] 地址管理
- [x] 个人中心

### 性能优化
- [x] 虚拟滚动列表
- [x] 图片懒加载
- [x] 路由懒加载
- [x] 组件按需加载
- [x] 资源预加载
- [x] 缓存策略

### PWA功能
- [x] Service Worker
- [x] 离线缓存
- [x] 桌面安装
- [x] 推送通知
- [x] 后台同步

### 用户体验
- [x] 加载状态
- [x] 错误处理
- [x] 骨架屏
- [x] 下拉刷新
- [x] 上拉加载
- [x] 手势操作

## 🧪 测试

项目包含完整的测试套件：

- **单元测试**: 组件和工具函数测试
- **集成测试**: 页面和用户流程测试
- **E2E测试**: 端到端用户场景测试
- **性能测试**: Lighthouse性能审计

测试覆盖率目标：
- 语句覆盖率 > 80%
- 分支覆盖率 > 75%
- 函数覆盖率 > 85%
- 行覆盖率 > 80%

## 📊 性能指标

### Lighthouse 评分目标
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90
- PWA: > 90

### 核心性能指标
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

## 🔧 配置说明

### 环境变量
```bash
# .env
VITE_APP_TITLE=Vue3饿了吗App
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development
```

### 浏览器支持
- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 提交规范
使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队

- **项目负责人**: [Your Name]
- **前端开发**: [Developer Names]
- **UI设计**: [Designer Names]
- **测试**: [Tester Names]

## 📞 联系我们

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: [your-email@example.com]

## 🙏 致谢

感谢以下开源项目：
- [Vue.js](https://vuejs.org/)
- [Vant](https://vant-contrib.gitee.io/vant/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
