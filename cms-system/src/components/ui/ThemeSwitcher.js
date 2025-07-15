'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeSwitcher({ className = '' }) {
  const { theme, setTheme, loading } = useTheme();
  const [themes, setThemes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      const data = await response.json();
      if (data.success) {
        setThemes(data.data.themes);
      }
    } catch (error) {
      console.error('获取主题列表失败:', error);
    }
  };

  const handleThemeChange = async (themeName) => {
    setIsOpen(false);
    
    try {
      // 发送到服务器更新设置
      await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeName }),
      });

      // 本地切换主题
      await setTheme(themeName);
    } catch (error) {
      console.error('主题切换失败:', error);
    }
  };

  const currentTheme = themes.find(t => t.name === theme);

  if (loading || themes.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        aria-label="切换主题"
      >
        <span className="text-lg">🎨</span>
        <span className="hidden sm:inline">
          {currentTheme?.displayName || '主题'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 菜单内容 */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                选择主题
              </div>
              
              {themes.map((themeOption) => (
                <button
                  key={themeOption.name}
                  onClick={() => handleThemeChange(themeOption.name)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    themeOption.name === theme ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* 主题色彩预览 */}
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: themeOption.primaryColor }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: themeOption.accentColor }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">
                        {themeOption.displayName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {themeOption.description}
                      </div>
                    </div>
                    
                    {themeOption.name === theme && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
              
              {/* 管理主题链接 */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <a
                  href="/admin/themes"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <span>管理主题</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}