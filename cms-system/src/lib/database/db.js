const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  // 初始化数据库连接
  init() {
    if (this.initialized) return this.db;

    try {
      // 确保数据目录存在
      const dbPath = process.env.DATABASE_PATH || './data/cms.db';
      const dbDir = path.dirname(dbPath);
      
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // 创建数据库连接
      this.db = new Database(dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');

      // 如果数据库是新创建的，运行初始化脚本
      const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      if (tables.length === 0) {
        this.initializeSchema();
      }

      this.initialized = true;
      console.log('Database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // 运行初始化 SQL 脚本
  initializeSchema() {
    try {
      const sqlPath = path.join(__dirname, 'init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // 分割并执行 SQL 语句
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const statement of statements) {
        this.db.exec(statement + ';');
      }
      
      console.log('Database schema initialized');
    } catch (error) {
      console.error('Failed to initialize database schema:', error);
      throw error;
    }
  }

  // 获取数据库连接
  getConnection() {
    if (!this.initialized) {
      this.init();
    }
    return this.db;
  }

  // 关闭数据库连接
  close() {
    if (this.db) {
      this.db.close();
      this.initialized = false;
    }
  }

  // 备份数据库
  backup(backupPath) {
    try {
      const db = this.getConnection();
      db.backup(backupPath);
      console.log(`Database backed up to: ${backupPath}`);
    } catch (error) {
      console.error('Database backup failed:', error);
      throw error;
    }
  }

  // 执行事务
  transaction(fn) {
    const db = this.getConnection();
    const transaction = db.transaction(fn);
    return transaction;
  }
}

// 创建单例实例
const dbManager = new DatabaseManager();

module.exports = dbManager;