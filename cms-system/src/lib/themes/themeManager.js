import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { SettingModel } from '@/lib/database/models';

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.themeCache = new Map();
    this.themesDir = path.join(process.cwd(), 'themes');
  }

  // 获取当前激活的主题名称
  getActiveThemeName() {
    if (typeof window !== 'undefined') {
      // 客户端环境
      return localStorage.getItem('activeTheme') || 'default';
    } else {
      // 服务端环境
      try {
        return SettingModel.getValue('active_theme') || 'default';
      } catch (error) {
        console.warn('无法从数据库获取主题设置:', error);
        return 'default';
      }
    }
  }

  // 设置激活主题
  setActiveTheme(themeName) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTheme', themeName);
    }
    this.currentTheme = null; // 清除缓存
  }

  // 获取主题配置
  getThemeConfig(themeName = null) {
    const name = themeName || this.getActiveThemeName();
    
    if (this.themeCache.has(name)) {
      return this.themeCache.get(name);
    }

    const themeDir = path.join(this.themesDir, name);
    const configPath = path.join(themeDir, 'theme.json');

    let config = {
      name,
      displayName: name,
      version: '1.0.0',
      author: 'Unknown',
      description: '无描述',
      styles: {},
      templates: {},
      assets: {}
    };

    if (existsSync(configPath)) {
      try {
        const configContent = readFileSync(configPath, 'utf8');
        config = { ...config, ...JSON.parse(configContent) };
      } catch (error) {
        console.error(`读取主题配置失败: ${name}`, error);
      }
    }

    this.themeCache.set(name, config);
    return config;
  }

  // 获取主题样式
  getThemeStyles(themeName = null) {
    const config = this.getThemeConfig(themeName);
    const name = themeName || this.getActiveThemeName();
    
    const stylesPath = path.join(this.themesDir, name, 'styles', 'theme.css');
    
    if (existsSync(stylesPath)) {
      try {
        return readFileSync(stylesPath, 'utf8');
      } catch (error) {
        console.error(`读取主题样式失败: ${name}`, error);
      }
    }

    return '';
  }

  // 获取主题模板
  getTemplate(templateName, themeName = null) {
    const name = themeName || this.getActiveThemeName();
    const templatePath = path.join(this.themesDir, name, 'templates', `${templateName}.js`);
    
    if (existsSync(templatePath)) {
      try {
        // 动态导入模板
        delete require.cache[require.resolve(templatePath)];
        return require(templatePath);
      } catch (error) {
        console.error(`加载主题模板失败: ${templateName}`, error);
      }
    }

    // 回退到默认模板
    if (name !== 'default') {
      return this.getTemplate(templateName, 'default');
    }

    return null;
  }

  // 获取主题变量
  getThemeVariables(themeName = null) {
    const config = this.getThemeConfig(themeName);
    return {
      primaryColor: config.primaryColor || '#3b82f6',
      secondaryColor: config.secondaryColor || '#64748b',
      fontFamily: config.fontFamily || 'Inter, sans-serif',
      borderRadius: config.borderRadius || '0.5rem',
      ...config.variables
    };
  }

  // 应用主题到页面
  applyTheme(themeName = null) {
    if (typeof window === 'undefined') return;

    const name = themeName || this.getActiveThemeName();
    const variables = this.getThemeVariables(name);
    
    // 应用 CSS 变量到根元素
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // 更新主题类名
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${name}`);

    // 触发主题切换事件
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { themeName: name, variables }
    }));
  }

  // 获取主题的静态资源URL
  getAssetUrl(assetPath, themeName = null) {
    const name = themeName || this.getActiveThemeName();
    return `/themes/${name}/assets/${assetPath}`;
  }

  // 清除主题缓存
  clearCache() {
    this.themeCache.clear();
    this.currentTheme = null;
  }

  // 验证主题是否存在
  themeExists(themeName) {
    const themeDir = path.join(this.themesDir, themeName);
    return existsSync(themeDir);
  }

  // 获取所有可用主题
  getAvailableThemes() {
    if (typeof window !== 'undefined') {
      // 客户端需要通过 API 获取
      return [];
    }

    try {
      const { readdirSync } = require('fs');
      return readdirSync(this.themesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    } catch (error) {
      console.error('获取主题列表失败:', error);
      return ['default'];
    }
  }
}

// 创建单例实例
const themeManager = new ThemeManager();

export default themeManager;