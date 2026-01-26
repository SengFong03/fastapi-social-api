# 1. 使用 Node 镜像 (开发环境用)
FROM node:22-alpine

# 2. 设置工作目录
WORKDIR /app

# 3. 先复制依赖清单 (为了利用 Docker 缓存加速)
COPY package.json .

# 4. 安装依赖
RUN npm install

# 5. 复制所有代码
COPY . .

# 6. 暴露端口 (Vite 默认是 5173，如果是 Create-React-App 则是 3000)
EXPOSE 5173

# 7. 启动命令
# 注意：一定要加 --host，不然 Docker 外部访问不到！
CMD ["npm", "run", "dev", "--", "--host"]