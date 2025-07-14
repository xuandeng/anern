const dbManager = require('../src/lib/database/db');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../src/lib/database/models');

async function initializeDatabase() {
  try {
    console.log('正在初始化数据库...');
    
    // 初始化数据库连接
    const db = dbManager.init();
    
    // 检查是否已经有管理员用户
    const existingAdmin = UserModel.findByEmail('admin@cms.com');
    
    if (!existingAdmin) {
      console.log('创建默认管理员用户...');
      
      // 创建默认管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = UserModel.create({
        email: 'admin@cms.com',
        password: hashedPassword,
        name: '系统管理员',
        role_id: 1, // 管理员角色
        status: 'active'
      });
      
      console.log('默认管理员用户创建成功:');
      console.log('邮箱: admin@cms.com');
      console.log('密码: admin123');
      console.log('请尽快登录后台修改密码!');
    } else {
      console.log('管理员用户已存在，跳过创建');
    }
    
    // 创建一些示例数据
    console.log('创建示例数据...');
    
    // 检查是否有文章
    const postCount = require('../src/lib/database/models').PostModel.count();
    if (postCount === 0) {
      // 创建示例文章
      const samplePost = require('../src/lib/database/models').PostModel.create({
        title: '欢迎使用 CMS 系统',
        slug: 'welcome-to-cms',
        content: `# 欢迎使用 CMS 系统

这是您的第一篇文章！

## 功能特性

- 📝 富文本编辑器
- 🖼️ 媒体管理
- 👥 用户权限管理
- 🎨 主题系统
- 🔌 插件系统

## 开始使用

1. 登录管理后台：\`/admin\`
2. 创建新文章
3. 管理分类和标签
4. 自定义您的网站

祝您使用愉快！`,
        excerpt: '欢迎使用基于 Next.js 构建的现代化 CMS 系统',
        status: 'published',
        author_id: existingAdmin ? existingAdmin.id : 1,
        published_at: new Date().toISOString()
      });
      
      console.log('示例文章创建成功');
    }
    
    console.log('数据库初始化完成！');
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  } finally {
    dbManager.close();
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;