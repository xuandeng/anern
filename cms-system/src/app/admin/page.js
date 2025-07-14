'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/Layout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: { total: 0, published: 0, draft: 0 },
    pages: { total: 0, published: 0, draft: 0 },
    users: { total: 0, active: 0 },
    media: { total: 0, size: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // 这里可以调用实际的 API 获取统计数据
      // 现在使用模拟数据
      setTimeout(() => {
        setStats({
          posts: { total: 15, published: 12, draft: 3 },
          pages: { total: 5, published: 4, draft: 1 },
          users: { total: 8, active: 7 },
          media: { total: 45, size: '2.3MB' }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('获取统计数据失败:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '文章',
      icon: '📝',
      total: stats.posts.total,
      items: [
        { label: '已发布', value: stats.posts.published, color: 'text-green-600' },
        { label: '草稿', value: stats.posts.draft, color: 'text-yellow-600' }
      ]
    },
    {
      title: '页面',
      icon: '📄',
      total: stats.pages.total,
      items: [
        { label: '已发布', value: stats.pages.published, color: 'text-green-600' },
        { label: '草稿', value: stats.pages.draft, color: 'text-yellow-600' }
      ]
    },
    {
      title: '用户',
      icon: '👥',
      total: stats.users.total,
      items: [
        { label: '活跃用户', value: stats.users.active, color: 'text-blue-600' }
      ]
    },
    {
      title: '媒体文件',
      icon: '🖼️',
      total: stats.media.total,
      items: [
        { label: '总大小', value: stats.media.size, color: 'text-purple-600' }
      ]
    }
  ];

  const quickActions = [
    { title: '新建文章', href: '/admin/posts/new', icon: '✏️', description: '创建新的文章内容' },
    { title: '新建页面', href: '/admin/pages/new', icon: '📄', description: '创建新的页面' },
    { title: '上传媒体', href: '/admin/media', icon: '📤', description: '上传图片和其他媒体文件' },
    { title: '管理用户', href: '/admin/users', icon: '👤', description: '添加和管理系统用户' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="mt-1 text-sm text-gray-500">
            欢迎回到 CMS 管理后台，以下是系统概况
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? (
                          <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                        ) : (
                          card.total
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                
                {!loading && card.items.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {card.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className={item.color}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 快捷操作 */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 最近活动（可选） */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">系统信息</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">系统版本</h3>
                <p className="mt-1 text-sm text-gray-900">CMS v1.0.0</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Node.js 版本</h3>
                <p className="mt-1 text-sm text-gray-900">{process.version}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">当前主题</h3>
                <p className="mt-1 text-sm text-gray-900">默认主题</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">已启用插件</h3>
                <p className="mt-1 text-sm text-gray-900">0 个插件</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}