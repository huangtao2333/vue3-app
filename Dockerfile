# 多阶段构建 Dockerfile
# 第一阶段：构建应用
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：生产环境
FROM nginx:alpine AS production

# 安装必要的工具
RUN apk add --no-cache curl

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Service Worker 到正确位置
COPY --from=builder /app/public/sw.js /usr/share/nginx/html/

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置正确的权限
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
