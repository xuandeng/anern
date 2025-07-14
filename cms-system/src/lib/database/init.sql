-- CMS 系统数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role_id INTEGER DEFAULT 2,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER,
  permission_id INTEGER,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- 文章表
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  type TEXT DEFAULT 'post',
  author_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  FOREIGN KEY (author_id) REFERENCES users (id)
);

-- 页面表
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  template TEXT DEFAULT 'default',
  status TEXT DEFAULT 'draft',
  author_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  FOREIGN KEY (author_id) REFERENCES users (id)
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories (id)
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 文章分类关联表
CREATE TABLE IF NOT EXISTS post_categories (
  post_id INTEGER,
  category_id INTEGER,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- 媒体文件表
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  author_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users (id)
);

-- 设置表
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'string',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 主题表
CREATE TABLE IF NOT EXISTS themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  author TEXT,
  is_active INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插件表
CREATE TABLE IF NOT EXISTS plugins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  author TEXT,
  is_active INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts (type);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 插入默认角色
INSERT OR IGNORE INTO roles (id, name, display_name, description) VALUES
(1, 'admin', '管理员', '系统管理员，拥有所有权限'),
(2, 'editor', '编辑', '内容编辑，可以管理文章和页面'),
(3, 'author', '作者', '可以创建和编辑自己的文章'),
(4, 'subscriber', '订阅者', '只能查看内容的用户');

-- 插入默认权限
INSERT OR IGNORE INTO permissions (id, name, display_name, description) VALUES
(1, 'manage_users', '用户管理', '管理系统用户'),
(2, 'manage_posts', '文章管理', '管理所有文章'),
(3, 'edit_posts', '编辑文章', '编辑文章内容'),
(4, 'publish_posts', '发布文章', '发布文章到前台'),
(5, 'manage_pages', '页面管理', '管理系统页面'),
(6, 'manage_categories', '分类管理', '管理文章分类'),
(7, 'manage_tags', '标签管理', '管理文章标签'),
(8, 'manage_media', '媒体管理', '管理媒体文件'),
(9, 'manage_themes', '主题管理', '管理系统主题'),
(10, 'manage_plugins', '插件管理', '管理系统插件'),
(11, 'manage_settings', '设置管理', '管理系统设置');

-- 分配权限给角色
INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES
-- 管理员拥有所有权限
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11),
-- 编辑拥有内容管理权限
(2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
-- 作者拥有基本编辑权限
(3, 3), (3, 4), (3, 8),
-- 订阅者无特殊权限
(4, 0);

-- 插入默认设置
INSERT OR IGNORE INTO settings (key, value, type, description) VALUES
('site_title', 'My CMS', 'string', '网站标题'),
('site_description', 'A powerful CMS built with Next.js', 'string', '网站描述'),
('site_keywords', 'cms, nextjs, blog', 'string', '网站关键词'),
('posts_per_page', '10', 'number', '每页文章数量'),
('allow_registration', 'false', 'boolean', '允许用户注册'),
('default_role', '4', 'number', '默认用户角色ID'),
('timezone', 'Asia/Shanghai', 'string', '时区设置');

-- 插入默认主题
INSERT OR IGNORE INTO themes (name, display_name, description, version, author, is_active) VALUES
('default', '默认主题', '系统默认主题', '1.0.0', 'CMS Team', 1);