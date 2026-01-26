# 1. 选一个 Python 基础镜像 (比如 Python 3.10)
FROM python:3.10-slim

# 2. 设置容器内的工作目录
WORKDIR /app

# 3. 把这一层需要用到的系统工具装上 (PostgreSQL 的驱动有时候需要 gcc)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. 把依赖清单复制进去
COPY requirements.txt .

# 5. 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 6. 把你所有的代码复制进去
COPY . .

# 7. 暴露端口 8000
EXPOSE 8000

# 8. 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]