'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'default',
  setTheme: () => {},
  themeConfig: {},
  loading: true
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function ThemeProvider({ children, initialTheme = 'default' }) {
  const [theme, setThemeState] = useState(initialTheme);
  const [themeConfig, setThemeConfig] = useState({});
  const [loading, setLoading] = useState(true);

  // 从服务器获取主题配置
  const fetchThemeConfig = async (themeName) => {
    try {
      const response = await fetch(`/api/themes/config?theme=${themeName}`);
      if (response.ok) {
        const data = await response.json();
        return data.config || {};
      }
    } catch (error) {
      console.error('获取主题配置失败:', error);
    }
    return {};
  };

  // 应用主题样式
  const applyThemeStyles = (themeName, config) => {
    const variables = {
      primaryColor: config.primaryColor || '#3b82f6',
      secondaryColor: config.secondaryColor || '#64748b',
      accentColor: config.accentColor || '#10b981',
      textColor: config.textColor || '#111827',
      backgroundColor: config.backgroundColor || '#ffffff',
      fontFamily: config.fontFamily || 'Inter, sans-serif',
      borderRadius: config.borderRadius || '0.5rem',
      boxShadow: config.boxShadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      ...config.variables
    };

    // 应用 CSS 变量
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // 更新主题类名
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${themeName}`);

    // 加载主题的 CSS 文件
    loadThemeCSS(themeName);
  };

  // 动态加载主题 CSS
  const loadThemeCSS = (themeName) => {
    // 移除之前的主题样式
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // 创建新的样式链接
    const link = document.createElement('link');
    link.id = 'theme-styles';
    link.rel = 'stylesheet';
    link.href = `/themes/${themeName}/styles/theme.css`;
    
    // 处理加载失败的情况
    link.onerror = () => {
      console.warn(`主题样式文件不存在: ${themeName}`);
    };

    document.head.appendChild(link);
  };

  // 设置主题
  const setTheme = async (themeName) => {
    setLoading(true);
    
    try {
      // 保存到本地存储
      localStorage.setItem('activeTheme', themeName);
      
      // 获取主题配置
      const config = await fetchThemeConfig(themeName);
      
      // 应用主题
      setThemeState(themeName);
      setThemeConfig(config);
      applyThemeStyles(themeName, config);

      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { themeName, config }
      }));

    } catch (error) {
      console.error('主题切换失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化主题
  useEffect(() => {
    const initTheme = async () => {
      setLoading(true);
      
      try {
        // 从本地存储获取主题
        const savedTheme = localStorage.getItem('activeTheme') || initialTheme;
        
        // 获取主题配置
        const config = await fetchThemeConfig(savedTheme);
        
        // 应用主题
        setThemeState(savedTheme);
        setThemeConfig(config);
        applyThemeStyles(savedTheme, config);

      } catch (error) {
        console.error('主题初始化失败:', error);
        
        // 回退到默认主题
        setThemeState('default');
        setThemeConfig({});
        applyThemeStyles('default', {});
      } finally {
        setLoading(false);
      }
    };

    initTheme();
  }, [initialTheme]);

  // 监听主题切换事件
  useEffect(() => {
    const handleThemeChange = (event) => {
      const { themeName } = event.detail;
      if (themeName !== theme) {
        setTheme(themeName);
      }
    };

    window.addEventListener('switchTheme', handleThemeChange);
    return () => window.removeEventListener('switchTheme', handleThemeChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themeConfig,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}