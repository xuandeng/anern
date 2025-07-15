const dbManager = require('./db');

// 基础模型类
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = dbManager.getConnection();
  }

  // 查找所有记录
  findAll(conditions = {}, options = {}) {
    const { limit, offset, orderBy } = options;
    let sql = `SELECT * FROM ${this.tableName}`;
    let params = [];

    // 添加条件
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params = Object.values(conditions);
    }

    // 添加排序
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    // 添加分页
    if (limit) {
      sql += ` LIMIT ${limit}`;
      if (offset) {
        sql += ` OFFSET ${offset}`;
      }
    }

    return this.db.prepare(sql).all(params);
  }

  // 根据 ID 查找
  findById(id) {
    return this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
  }

  // 查找单条记录
  findOne(conditions) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`;
    return this.db.prepare(sql).get(Object.values(conditions));
  }

  // 创建记录
  create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = this.db.prepare(sql).run(values);
    
    return this.findById(result.lastInsertRowid);
  }

  // 更新记录
  update(id, data) {
    const updateData = { ...data, updated_at: new Date().toISOString() };
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    
    this.db.prepare(sql).run([...values, id]);
    return this.findById(id);
  }

  // 删除记录
  delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return this.db.prepare(sql).run(id);
  }

  // 计数
  count(conditions = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    let params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params = Object.values(conditions);
    }

    const result = this.db.prepare(sql).get(params);
    return result.count;
  }
}

// 用户模型
class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  // 根据邮箱查找用户
  findByEmail(email) {
    return this.findOne({ email });
  }

  // 获取用户权限
  getUserPermissions(userId) {
    const sql = `
      SELECT p.name, p.display_name 
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN users u ON u.role_id = rp.role_id
      WHERE u.id = ?
    `;
    return this.db.prepare(sql).all(userId);
  }

  // 创建用户（包含角色）
  createWithRole(userData) {
    return this.create(userData);
  }
}

// 文章模型
class PostModel extends BaseModel {
  constructor() {
    super('posts');
  }

  // 获取已发布的文章
  getPublishedPosts(options = {}) {
    const conditions = { status: 'published' };
    return this.findAll(conditions, {
      orderBy: 'published_at DESC',
      ...options
    });
  }

  // 根据 slug 查找文章
  findBySlug(slug) {
    return this.findOne({ slug });
  }

  // 获取文章及其分类和标签
  getPostWithMeta(id) {
    const post = this.findById(id);
    if (!post) return null;

    // 获取分类
    const categorySql = `
      SELECT c.* FROM categories c
      JOIN post_categories pc ON c.id = pc.category_id
      WHERE pc.post_id = ?
    `;
    const categories = this.db.prepare(categorySql).all(id);

    // 获取标签
    const tagSql = `
      SELECT t.* FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `;
    const tags = this.db.prepare(tagSql).all(id);

    return { ...post, categories, tags };
  }

  // 添加文章分类关联
  addCategories(postId, categoryIds) {
    const stmt = this.db.prepare('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)');
    const transaction = this.db.transaction((categoryIds) => {
      // 先删除现有关联
      this.db.prepare('DELETE FROM post_categories WHERE post_id = ?').run(postId);
      // 添加新关联
      for (const categoryId of categoryIds) {
        stmt.run(postId, categoryId);
      }
    });
    transaction(categoryIds);
  }

  // 添加文章标签关联
  addTags(postId, tagIds) {
    const stmt = this.db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');
    const transaction = this.db.transaction((tagIds) => {
      // 先删除现有关联
      this.db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(postId);
      // 添加新关联
      for (const tagId of tagIds) {
        stmt.run(postId, tagId);
      }
    });
    transaction(tagIds);
  }
}

// 页面模型
class PageModel extends BaseModel {
  constructor() {
    super('pages');
  }

  // 根据 slug 查找页面
  findBySlug(slug) {
    return this.findOne({ slug });
  }

  // 获取已发布的页面
  getPublishedPages() {
    return this.findAll({ status: 'published' }, { orderBy: 'created_at DESC' });
  }
}

// 分类模型
class CategoryModel extends BaseModel {
  constructor() {
    super('categories');
  }

  // 根据 slug 查找分类
  findBySlug(slug) {
    return this.findOne({ slug });
  }

  // 获取分类树
  getCategoryTree() {
    const categories = this.findAll({}, { orderBy: 'name ASC' });
    return this.buildTree(categories);
  }

  // 构建分类树
  buildTree(categories, parentId = null) {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        children: this.buildTree(categories, cat.id)
      }));
  }
}

// 标签模型
class TagModel extends BaseModel {
  constructor() {
    super('tags');
  }

  // 根据 slug 查找标签
  findBySlug(slug) {
    return this.findOne({ slug });
  }
}

// 媒体模型
class MediaModel extends BaseModel {
  constructor() {
    super('media');
  }

  // 根据文件名查找
  findByFilename(filename) {
    return this.findOne({ filename });
  }

  // 获取用户的媒体文件
  getUserMedia(userId, options = {}) {
    return this.findAll({ author_id: userId }, {
      orderBy: 'created_at DESC',
      ...options
    });
  }
}

// 设置模型
class SettingModel extends BaseModel {
  constructor() {
    super('settings');
  }

  // 根据键获取设置值
  getValue(key) {
    const setting = this.findOne({ key });
    return setting ? setting.value : null;
  }

  // 设置值
  setValue(key, value) {
    const existing = this.findOne({ key });
    if (existing) {
      return this.update(existing.id, { value });
    } else {
      return this.create({ key, value });
    }
  }

  // 获取所有设置（作为对象返回）
  getAllSettings() {
    const settings = this.findAll();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
}

// 角色模型
class RoleModel extends BaseModel {
  constructor() {
    super('roles');
  }

  // 获取角色权限
  getRolePermissions(roleId) {
    const sql = `
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `;
    return this.db.prepare(sql).all(roleId);
  }
}

// 导出所有模型
module.exports = {
  UserModel: new UserModel(),
  PostModel: new PostModel(),
  PageModel: new PageModel(),
  CategoryModel: new CategoryModel(),
  TagModel: new TagModel(),
  MediaModel: new MediaModel(),
  SettingModel: new SettingModel(),
  RoleModel: new RoleModel(),
};