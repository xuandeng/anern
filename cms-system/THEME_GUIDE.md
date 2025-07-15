# 主题切换功能使用指南

本指南将介绍如何使用和自定义 CMS 系统的主题切换功能。

## 🎨 功能概述

CMS 系统内置了强大的主题系统，支持：
- **实时主题切换** - 无需刷新页面即可切换主题
- **多种内置主题** - 默认、暗色、简约三种主题
- **自定义主题** - 支持创建和安装自定义主题
- **响应式设计** - 所有主题都支持移动端适配
- **主题配置** - 可自定义主题的颜色、字体等设置

## 🚀 快速开始

### 1. 在前台切换主题

在网站首页，点击右上角的主题切换器（🎨 图标），选择您喜欢的主题：

- **默认主题** - 现代简洁的蓝色调设计
- **暗色主题** - 深色背景，适合夜间使用
- **简约主题** - 极简黑白设计，专注内容阅读

### 2. 在管理后台管理主题

1. 登录管理后台（`/admin`）
2. 进入"主题设置"页面（`/admin/themes`）
3. 查看所有可用主题
4. 点击"激活主题"按钮切换主题
5. 点击"预览"按钮在新窗口预览主题效果

## 📁 主题结构

每个主题都位于 `themes/` 目录下，包含以下文件：

```
themes/
└── theme-name/
    ├── theme.json          # 主题配置文件
    ├── styles/
    │   └── theme.css       # 主题样式文件
    ├── templates/          # 主题模板（可选）
    │   ├── index.js        # 首页模板
    │   ├── post.js         # 文章页模板
    │   └── page.js         # 页面模板
    ├── assets/             # 静态资源（可选）
    │   ├── images/
    │   └── fonts/
    └── screenshot.jpg      # 主题预览图（可选）
```

## 🛠️ 创建自定义主题

### 步骤 1：创建主题目录

```bash
mkdir -p themes/my-theme/styles
```

### 步骤 2：创建主题配置文件

创建 `themes/my-theme/theme.json`：

```json
{
  "name": "my-theme",
  "displayName": "我的主题",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "自定义主题描述",
  "primaryColor": "#ff6b6b",
  "secondaryColor": "#4ecdc4",
  "accentColor": "#45b7d1",
  "textColor": "#2c3e50",
  "backgroundColor": "#ffffff",
  "fontFamily": "Arial, sans-serif",
  "borderRadius": "8px",
  "boxShadow": "0 2px 10px rgba(0,0,0,0.1)",
  "variables": {
    "headerHeight": "70px",
    "contentMaxWidth": "1000px",
    "cardPadding": "2rem"
  }
}
```

### 步骤 3：创建主题样式文件

创建 `themes/my-theme/styles/theme.css`：

```css
/* 自定义主题样式 */
.theme-my-theme {
  --theme-primary: var(--theme-primaryColor, #ff6b6b);
  --theme-secondary: var(--theme-secondaryColor, #4ecdc4);
  --theme-accent: var(--theme-accentColor, #45b7d1);
  --theme-text: var(--theme-textColor, #2c3e50);
  --theme-background: var(--theme-backgroundColor, #ffffff);
}

/* 自定义样式 */
.theme-my-theme body {
  background-color: var(--theme-background);
  color: var(--theme-text);
  font-family: var(--theme-fontFamily);
}

.theme-my-theme .card {
  background-color: var(--theme-background);
  border-radius: var(--theme-borderRadius);
  box-shadow: var(--theme-boxShadow);
  padding: var(--theme-cardPadding);
}

/* 更多自定义样式... */
```

### 步骤 4：添加预览图（可选）

在主题目录下添加 `screenshot.jpg` 作为主题预览图。

### 步骤 5：激活主题

1. 在管理后台的主题页面中，新主题会自动出现
2. 点击"激活主题"即可使用

## 🎨 主题配置说明

### 基础配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `name` | 主题唯一标识符 | `"my-theme"` |
| `displayName` | 主题显示名称 | `"我的主题"` |
| `version` | 主题版本号 | `"1.0.0"` |
| `author` | 主题作者 | `"Your Name"` |
| `description` | 主题描述 | `"主题描述"` |

### 颜色配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `primaryColor` | 主色调 | `#3b82f6` |
| `secondaryColor` | 次要颜色 | `#64748b` |
| `accentColor` | 强调色 | `#10b981` |
| `textColor` | 文字颜色 | `#111827` |
| `backgroundColor` | 背景颜色 | `#ffffff` |

### 字体配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `fontFamily` | 正文字体 | `Inter, sans-serif` |
| `headingFontFamily` | 标题字体 | `继承 fontFamily` |
| `fontSize` | 基础字体大小 | `16px` |
| `lineHeight` | 行高 | `1.6` |

### 样式配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `borderRadius` | 圆角大小 | `0.5rem` |
| `boxShadow` | 阴影效果 | `0 1px 3px rgba(0,0,0,0.1)` |

### 自定义变量

在 `variables` 对象中可以定义任意自定义变量：

```json
"variables": {
  "headerHeight": "64px",
  "sidebarWidth": "256px",
  "contentMaxWidth": "1200px",
  "cardPadding": "1.5rem",
  "borderColor": "#e5e7eb",
  "linkColor": "#3b82f6"
}
```

## 💡 最佳实践

### 1. 颜色搭配

- 确保文字与背景有足够的对比度
- 使用色彩工具检查无障碍访问性
- 主色调不超过 3-4 种

### 2. 字体选择

- 选择易读的字体
- 考虑中文字体的兼容性
- 提供字体降级方案

### 3. 响应式设计

- 测试不同屏幕尺寸下的效果
- 使用相对单位（rem、em、%）
- 考虑移动端的触摸体验

### 4. 性能优化

- 压缩CSS文件
- 优化图片资源
- 避免过度的动画效果

## 🔧 高级功能

### 1. 主题继承

可以基于现有主题创建新主题：

```bash
# 复制默认主题
cp -r themes/default themes/my-custom-theme

# 修改配置文件
# 自定义样式文件
```

### 2. 动态样式

在CSS中使用CSS变量实现动态样式：

```css
.theme-my-theme .custom-element {
  background: linear-gradient(
    45deg,
    var(--theme-primary),
    var(--theme-accent)
  );
  color: var(--theme-text);
  transition: all 0.3s ease;
}
```

### 3. JavaScript交互

主题切换时会触发自定义事件：

```javascript
window.addEventListener('themeChanged', (event) => {
  const { themeName, config } = event.detail;
  console.log('主题已切换到:', themeName);
  // 执行自定义逻辑
});
```

## 🐛 故障排除

### 主题不显示

1. 检查主题目录结构是否正确
2. 确认 `theme.json` 文件格式正确
3. 查看浏览器控制台错误信息

### 样式不生效

1. 检查CSS文件路径是否正确
2. 确认CSS选择器优先级
3. 清除浏览器缓存

### 主题切换失败

1. 检查网络连接
2. 确认用户权限
3. 查看服务器日志

## 📚 示例主题

### 节日主题

创建一个圣诞节主题：

```json
{
  "name": "christmas",
  "displayName": "圣诞主题",
  "primaryColor": "#dc2626",
  "secondaryColor": "#16a34a",
  "accentColor": "#fbbf24",
  "backgroundColor": "#fef7f0",
  "variables": {
    "snowAnimation": "enabled"
  }
}
```

### 品牌主题

为公司品牌定制主题：

```json
{
  "name": "company-brand",
  "displayName": "公司品牌",
  "primaryColor": "#1e40af",
  "secondaryColor": "#64748b",
  "fontFamily": "Source Sans Pro, sans-serif",
  "variables": {
    "logoUrl": "/assets/company-logo.svg"
  }
}
```

## 🤝 贡献主题

如果您创建了优秀的主题，欢迎分享：

1. Fork 项目仓库
2. 在 `themes/` 目录下添加您的主题
3. 提交 Pull Request
4. 等待审核和合并

---

**更多帮助**

- [技术文档](README.md)
- [API 文档](docs/API.md)
- [社区讨论](https://github.com/your-username/cms-system/discussions)

🎨 让您的网站更加个性化和美观！