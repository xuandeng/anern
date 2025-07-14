# CMS 系统安装指南

本文档将指导您完成 CMS 系统的完整安装过程。

## 系统要求

### 最低要求
- **操作系统**: Windows 10/macOS 10.15/Ubuntu 18.04 或更高版本
- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **内存**: 2GB RAM
- **磁盘空间**: 1GB 可用空间

### 推荐配置
- **Node.js**: 20.x LTS
- **npm**: 10.x
- **内存**: 4GB RAM 或更高
- **磁盘空间**: 5GB 可用空间

## 安装步骤

### 1. 环境准备

#### 1.1 安装 Node.js

**Windows/macOS:**
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 LTS 版本
3. 验证安装：
   ```bash
   node --version
   npm --version
   ```

**Ubuntu/Debian:**
```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

**CentOS/RHEL:**
```bash
# 使用 NodeSource 仓库
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version
```

#### 1.2 安装 PM2 (生产环境)

```bash
npm install -g pm2
pm2 --version
```

### 2. 获取源码

#### 2.1 从 Git 仓库克隆

```bash
git clone https://github.com/your-username/cms-system.git
cd cms-system
```

#### 2.2 或下载源码包

```bash
wget https://github.com/your-username/cms-system/archive/main.zip
unzip main.zip
cd cms-system-main
```

### 3. 安装依赖

```bash
# 安装项目依赖
npm install

# 如果遇到权限问题 (Linux/macOS)
sudo npm install

# 如果使用 yarn
yarn install
```

### 4. 环境配置

#### 4.1 创建环境配置文件

```bash
# 复制示例配置文件
cp .env.local .env.local
```

#### 4.2 编辑环境配置

编辑 `.env.local` 文件：

```env
# 基本配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-secure-secret-key-here

# 数据库配置
DATABASE_PATH=./data/cms.db

# 文件上传配置
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760

# 主题配置
DEFAULT_THEME=default

# 环境设置
NODE_ENV=development
```

**重要配置说明：**

- `NEXTAUTH_SECRET`: 必须设置为复杂的随机字符串
- `DATABASE_PATH`: 数据库文件路径，确保目录可写
- `UPLOAD_DIR`: 上传文件目录，确保 Web 服务器可访问
- `MAX_FILE_SIZE`: 最大文件上传大小（字节）

#### 4.3 生成安全密钥

```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

将生成的密钥设置为 `NEXTAUTH_SECRET` 的值。

### 5. 数据库初始化

```bash
# 初始化数据库和创建默认用户
npm run db:init
```

执行成功后，您将看到：
```
正在初始化数据库...
创建默认管理员用户...
默认管理员用户创建成功:
邮箱: admin@cms.com
密码: admin123
请尽快登录后台修改密码!
创建示例数据...
示例文章创建成功
数据库初始化完成！
```

### 6. 项目构建

#### 6.1 开发环境

```bash
# 启动开发服务器
npm run dev
```

#### 6.2 生产环境

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 7. 验证安装

#### 7.1 访问应用

打开浏览器访问：
- **前台首页**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin

#### 7.2 登录管理后台

使用默认管理员账户登录：
- **邮箱**: admin@cms.com
- **密码**: admin123

**⚠️ 重要：首次登录后请立即修改密码！**

## 生产环境部署

### 1. 使用 PM2 部署

#### 1.1 配置生产环境变量

创建 `.env.production` 文件：

```env
# 生产环境配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key

# 数据库配置
DATABASE_PATH=/path/to/production/cms.db

# 上传配置
UPLOAD_DIR=/path/to/production/uploads
MAX_FILE_SIZE=10485760

# 环境设置
NODE_ENV=production
```

#### 1.2 启动应用

```bash
# 构建项目
npm run build

# 使用 PM2 启动
npm run pm2:start

# 查看状态
npm run pm2:status

# 查看日志
npm run pm2:logs
```

#### 1.3 设置开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机启动脚本
pm2 startup

# 按照提示执行命令 (通常需要 sudo)
```

### 2. 使用 Docker 部署

#### 2.1 创建 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源码
COPY . .

# 构建应用
RUN npm run build

# 创建必要目录
RUN mkdir -p data uploads logs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

#### 2.2 构建和运行

```bash
# 构建镜像
docker build -t cms-system .

# 运行容器
docker run -d \
  --name cms-system \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  cms-system
```

#### 2.3 使用 Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  cms:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=your-production-secret
    restart: unless-stopped
```

启动服务：

```bash
docker-compose up -d
```

### 3. 使用 Nginx 反向代理

#### 3.1 安装 Nginx

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install nginx
```

**CentOS/RHEL:**
```bash
sudo yum install nginx
```

#### 3.2 配置 Nginx

创建 `/etc/nginx/sites-available/cms-system`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # 反向代理到 Next.js 应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /uploads/ {
        alias /path/to/your/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3.3 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/cms-system /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

## 故障排除

### 常见问题及解决方案

#### 1. 数据库连接失败

**错误信息**: `Database initialization failed`

**解决方案**:
```bash
# 检查目录权限
ls -la data/
chmod 755 data/
chmod 644 data/cms.db  # 如果文件已存在

# 重新初始化数据库
npm run db:init
```

#### 2. 文件上传失败

**错误信息**: `ENOENT: no such file or directory`

**解决方案**:
```bash
# 创建上传目录
mkdir -p public/uploads
chmod 755 public/uploads

# 检查环境变量
echo $UPLOAD_DIR
```

#### 3. 端口被占用

**错误信息**: `EADDRINUSE: address already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000
# 或者
netstat -nlp | grep :3000

# 终止进程
kill -9 <PID>

# 或者使用不同端口
PORT=3001 npm start
```

#### 4. 权限问题

**错误信息**: `EACCES: permission denied`

**解决方案**:
```bash
# 修改文件所有者
sudo chown -R $USER:$USER .

# 或使用 npm 配置
npm config set unsafe-perm true
```

#### 5. 内存不足

**错误信息**: `JavaScript heap out of memory`

**解决方案**:
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### 日志查看

#### 1. 应用日志

```bash
# PM2 日志
npm run pm2:logs

# 或者直接查看
pm2 logs cms-system

# 查看错误日志
pm2 logs cms-system --err
```

#### 2. 系统日志

```bash
# Ubuntu/Debian
sudo journalctl -u nginx
sudo journalctl -f

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## 维护和更新

### 1. 数据备份

```bash
# 手动备份数据库
npm run db:backup

# 设置定时备份 (crontab)
crontab -e
# 添加以下行 (每天凌晨 2 点备份)
0 2 * * * cd /path/to/cms-system && npm run db:backup
```

### 2. 系统更新

```bash
# 停止应用
npm run pm2:stop

# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 启动应用
npm run pm2:start
```

### 3. 性能监控

```bash
# PM2 监控
pm2 monit

# 系统资源监控
htop
# 或
top
```

## 安全建议

1. **立即修改默认密码**
2. **使用强密码和复杂的 NEXTAUTH_SECRET**
3. **定期更新系统和依赖**
4. **配置防火墙规则**
5. **启用 HTTPS**
6. **定期备份数据**
7. **监控系统日志**

## 获取帮助

如果在安装过程中遇到问题：

1. 查看本文档的故障排除部分
2. 检查项目的 [GitHub Issues](https://github.com/your-username/cms-system/issues)
3. 创建新的 Issue 描述您的问题
4. 加入我们的社区讨论

---

安装完成后，您就可以开始使用 CMS 系统了！建议先阅读用户手册了解各项功能的使用方法。