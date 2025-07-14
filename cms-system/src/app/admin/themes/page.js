'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/Layout';
import Button from '@/components/ui/Button';

export default function ThemesPage() {
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState('');
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/themes');
      const data = await response.json();

      if (data.success) {
        setThemes(data.data.themes);
        setActiveTheme(data.data.activeTheme);
      } else {
        setError(data.error || '获取主题列表失败');
      }
    } catch (error) {
      console.error('获取主题列表失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const switchTheme = async (themeName) => {
    try {
      setSwitching(themeName);
      setError('');
      setSuccess('');

      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeName }),
      });

      const data = await response.json();

      if (data.success) {
        setActiveTheme(themeName);
        setSuccess('主题切换成功！');
        
        // 3秒后清除成功消息
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || '主题切换失败');
      }
    } catch (error) {
      console.error('主题切换失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setSwitching(null);
    }
  };

  const ThemeCard = ({ theme }) => {
    const isActive = theme.name === activeTheme;
    const isSwitching = switching === theme.name;

    return (
      <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
        {/* 主题截图 */}
        <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden bg-gray-100">
          {theme.screenshot ? (
            <img
              src={theme.screenshot}
              alt={`${theme.displayName} 预览`}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎨</span>
                <span className="text-sm">无预览图</span>
              </div>
            </div>
          )}
          
          {/* 激活状态标识 */}
          {isActive && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              当前激活
            </div>
          )}
        </div>

        {/* 主题信息 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {theme.displayName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {theme.description}
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <span>作者: {theme.author}</span>
            <span>版本: {theme.version}</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-2">
            {!isActive ? (
              <Button
                onClick={() => switchTheme(theme.name)}
                loading={isSwitching}
                disabled={isSwitching}
                className="flex-1"
              >
                {isSwitching ? '切换中...' : '激活主题'}
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled
                className="flex-1"
              >
                当前使用
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/', '_blank')}
            >
              预览
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">主题管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理和切换网站主题，自定义网站外观
          </p>
        </div>

        {/* 状态消息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-600">{success}</div>
          </div>
        )}

        {/* 当前主题信息 */}
        {!loading && activeTheme && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h2 className="text-lg font-medium text-blue-900 mb-2">当前激活主题</h2>
            <p className="text-blue-700">
              正在使用 <span className="font-semibold">{activeTheme}</span> 主题
            </p>
          </div>
        )}

        {/* 主题列表 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">可用主题</h2>
            <div className="text-sm text-gray-500">
              共 {themes.length} 个主题
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : themes.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🎨</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无可用主题
              </h3>
              <p className="text-gray-500 mb-4">
                请在 themes 目录下添加主题文件
              </p>
              <Button
                onClick={fetchThemes}
                variant="outline"
              >
                刷新列表
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <ThemeCard key={theme.name} theme={theme} />
              ))}
            </div>
          )}
        </div>

        {/* 主题开发提示 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            🛠️ 主题开发指南
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• 主题文件应放置在 <code className="bg-gray-200 px-1 rounded">themes/</code> 目录下</p>
            <p>• 每个主题需要包含 <code className="bg-gray-200 px-1 rounded">theme.json</code> 配置文件</p>
            <p>• 可选择添加 <code className="bg-gray-200 px-1 rounded">screenshot.jpg</code> 作为预览图</p>
            <p>• 主题结构：templates/、styles/、assets/ 目录</p>
            <div className="mt-3">
              <Button
                variant="link"
                onClick={() => window.open('/docs/themes', '_blank')}
              >
                查看详细文档 →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}