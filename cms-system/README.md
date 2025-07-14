# CMS 系统 - 现代化内容管理系统

基于 Next.js 构建的功能强大、易于使用的内容管理系统，类似 WordPress 但更加现代化。

## 🌟 功能特性

### 核心功能
- 📝 **富文本编辑器** - 支持 Markdown 和 WYSIWYG 编辑
- 🖼️ **媒体管理** - 完整的文件上传和管理系统
- 📄 **页面管理** - 动态页面创建和管理
- 📁 **分类系统** - 层级分类和标签管理
- 👥 **用户管理** - 完整的用户角色和权限系统

### 系统特性
- 🎨 **主题系统** - 支持自定义主题
- 🔌 **插件系统** - 可扩展的插件架构
- 🔐 **身份认证** - 基于 NextAuth.js 的安全认证
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **高性能** - 基于 Next.js 的服务端渲染

### 技术栈
- **前端**: Next.js 15, React 19, Tailwind CSS
- **后端**: Next.js API Routes, SQLite
- **数据库**: Better-SQLite3
- **认证**: NextAuth.js
- **编辑器**: CKEditor 5 / Markdown
- **部署**: PM2, Docker (可选)

## 📦 安装部署

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/cms-system.git
   cd cms-system
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   cp .env.local.example .env.local
   ```
   
   编辑 `.env.local` 文件：
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_PATH=./data/cms.db
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **初始化数据库**
   ```bash
   npm run db:init
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   - 前台: http://localhost:3000
   - 管理后台: http://localhost:3000/admin
   - 默认管理员: admin@cms.com / admin123

### 生产环境部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **使用 PM2 部署**
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动应用
   npm run pm2:start
   
   # 查看状态
   npm run pm2:status
   
   # 查看日志
   npm run pm2:logs
   ```

3. **使用 Docker 部署** (可选)
   ```bash
   # 构建镜像
   docker build -t cms-system .
   
   # 运行容器
   docker run -p 3000:3000 -v $(pwd)/data:/app/data cms-system
   ```

## 🗂️ 项目结构

```
cms-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 管理后台页面
│   │   ├── api/               # API 路由
│   │   ├── posts/             # 文章页面
│   │   └── layout.js          # 根布局
│   ├── components/            # React 组件
│   │   ├── admin/             # 管理后台组件
│   │   ├── frontend/          # 前台组件
│   │   └── ui/                # 通用 UI 组件
│   ├── lib/                   # 核心库
│   │   ├── auth/              # 认证相关
│   │   ├── database/          # 数据库操作
│   │   └── utils/             # 工具函数
│   └── middleware/            # 中间件
├── themes/                    # 主题系统
│   └── default/               # 默认主题
├── plugins/                   # 插件系统
├── data/                      # 数据库文件
├── uploads/                   # 上传文件
├── scripts/                   # 脚本文件
├── ecosystem.config.js        # PM2 配置
└── package.json
```

## 📚 API 文档

### 文章管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/posts` | 获取文章列表 |
| GET | `/api/posts/[id]` | 获取单个文章 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/[id]` | 更新文章 |
| DELETE | `/api/posts/[id]` | 删除文章 |

### 媒体管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/upload` | 获取媒体列表 |
| POST | `/api/upload` | 上传文件 |
| DELETE | `/api/upload/[id]` | 删除文件 |

### 用户管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/users` | 获取用户列表 |
| POST | `/api/users` | 创建用户 |
| PUT | `/api/users/[id]` | 更新用户 |
| DELETE | `/api/users/[id]` | 删除用户 |

## 🎨 主题系统

### 主题结构
```
themes/
└── theme-name/
    ├── templates/          # 模板文件
    │   ├── index.js       # 首页模板
    │   ├── post.js        # 文章页模板
    │   └── page.js        # 页面模板
    ├── styles/            # 样式文件
    │   └── theme.css      # 主题样式
    ├── assets/            # 静态资源
    └── theme.json         # 主题配置
```

### 创建自定义主题

1. **复制默认主题**
   ```bash
   cp -r themes/default themes/my-theme
   ```

2. **修改主题配置**
   ```json
   {
     "name": "my-theme",
     "displayName": "我的主题",
     "version": "1.0.0",
     "author": "Your Name",
     "description": "自定义主题描述"
   }
   ```

3. **自定义模板和样式**
   - 修改 `templates/` 目录下的模板文件
   - 更新 `styles/theme.css` 样式文件

## 🔌 插件系统

### 插件结构
```
plugins/
└── plugin-name/
    ├── index.js           # 插件入口
    ├── hooks/             # 钩子函数
    ├── components/        # 插件组件
    └── plugin.json        # 插件配置
```

### 创建插件

1. **创建插件目录**
   ```bash
   mkdir -p plugins/my-plugin
   ```

2. **创建插件配置**
   ```json
   {
     "name": "my-plugin",
     "displayName": "我的插件",
     "version": "1.0.0",
     "description": "插件描述",
     "hooks": ["beforePublish", "afterRender"]
   }
   ```

3. **实现插件功能**
   ```javascript
   // plugins/my-plugin/index.js
   const MyPlugin = {
     beforePublish: (post) => {
       // 发布前处理
       return post;
     },
     afterRender: (html) => {
       // 渲染后处理
       return html;
     }
   };

   module.exports = MyPlugin;
   ```

## 🔐 用户权限系统

### 角色类型
- **管理员 (Admin)**: 所有权限
- **编辑 (Editor)**: 内容管理权限
- **作者 (Author)**: 基本编辑权限
- **订阅者 (Subscriber)**: 查看权限

### 权限列表
- `manage_users` - 用户管理
- `manage_posts` - 文章管理
- `edit_posts` - 编辑文章
- `publish_posts` - 发布文章
- `manage_pages` - 页面管理
- `manage_categories` - 分类管理
- `manage_tags` - 标签管理
- `manage_media` - 媒体管理
- `manage_themes` - 主题管理
- `manage_plugins` - 插件管理
- `manage_settings` - 系统设置

## 📊 数据库结构

### 核心表结构
- `users` - 用户信息
- `roles` - 角色定义
- `permissions` - 权限定义
- `role_permissions` - 角色权限关联
- `posts` - 文章内容
- `pages` - 页面内容
- `categories` - 分类信息
- `tags` - 标签信息
- `media` - 媒体文件
- `settings` - 系统设置

## 🛠️ 开发指南

### 开发环境设置

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **代码格式化**
   ```bash
   npm run format
   ```

3. **代码检查**
   ```bash
   npm run lint
   ```

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 使用说明

### 1. 管理后台使用

1. **登录管理后台**
   - 访问 `/admin/login`
   - 使用默认账户登录

2. **创建文章**
   - 进入"文章管理" -> "新建文章"
   - 填写标题、内容、摘要
   - 选择分类和标签
   - 设置发布状态

3. **管理媒体**
   - 进入"媒体库"
   - 上传图片和文件
   - 管理现有媒体

4. **用户管理**
   - 进入"用户管理"
   - 添加新用户
   - 分配角色和权限

### 2. 前台功能

1. **浏览文章**
   - 首页显示最新文章
   - 按分类和标签筛选
   - 搜索功能

2. **文章详情**
   - 完整文章内容
   - 相关文章推荐
   - 评论系统 (可扩展)

## 🚀 性能优化

### 建议配置

1. **启用缓存**
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       appDir: true,
     },
     images: {
       domains: ['localhost'],
     },
   };
   ```

2. **数据库优化**
   - 定期备份数据库
   - 优化查询索引
   - 清理无用数据

3. **文件优化**
   - 压缩图片
   - 启用 CDN
   - 配置缓存策略

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库文件路径
   - 确认目录权限
   - 重新初始化数据库

2. **文件上传失败**
   - 检查上传目录权限
   - 确认文件大小限制
   - 查看服务器日志

3. **认证问题**
   - 检查 NEXTAUTH_SECRET 配置
   - 确认会话设置
   - 清除浏览器缓存

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 支持

如果您遇到问题或有建议，请：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索 [已知问题](https://github.com/your-username/cms-system/issues)
3. 创建新的 [Issue](https://github.com/your-username/cms-system/issues/new)
4. 加入我们的 [讨论群](https://github.com/your-username/cms-system/discussions)

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [NextAuth.js](https://next-auth.js.org/) - 认证解决方案
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Better-SQLite3](https://github.com/JoshuaWise/better-sqlite3) - SQLite 数据库
- [CKEditor 5](https://ckeditor.com/) - 富文本编辑器

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！
