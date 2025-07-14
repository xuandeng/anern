'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/helpers';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?status=published&limit=10');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      } else {
        setError('获取文章列表失败');
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 transition-colors duration-300">
                我的博客
              </h1>
              <p className="mt-2 text-gray-600 transition-colors duration-300">
                分享技术与生活
              </p>
            </div>
            
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                首页
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                关于
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                管理后台
              </Link>
              
              {/* 主题切换器 */}
              <ThemeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-colors duration-300">
              最新文章
            </h2>
            
            {loading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6 card transition-colors duration-300">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 transition-colors duration-300">
                <div className="text-red-600">{error}</div>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center card transition-colors duration-300">
                <div className="text-gray-500">
                  <span className="text-4xl mb-4 block">📝</span>
                  <h3 className="text-lg font-medium mb-2 text-gray-900">暂无文章</h3>
                  <p className="text-sm">还没有发布任何文章</p>
                </div>
              </div>
            )}

            {!loading && !error && posts.length > 0 && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 card">
                    {post.featured_image && (
                      <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 post-title transition-colors duration-300">
                        <Link 
                          href={`/posts/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      <div className="text-sm text-gray-500 mb-3 post-meta transition-colors duration-300">
                        <time dateTime={post.published_at}>
                          {formatDate(post.published_at)}
                        </time>
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 post-excerpt transition-colors duration-300">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        阅读更多
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 关于 */}
            <div className="bg-white rounded-lg shadow p-6 card transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                关于博客
              </h3>
              <p className="text-gray-600 text-sm transition-colors duration-300">
                这是一个基于 Next.js 构建的现代化博客系统，支持 Markdown 编辑、分类标签、媒体管理等功能。
              </p>
            </div>

            {/* 最新文章（简化版） */}
            <div className="bg-white rounded-lg shadow p-6 card transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                最新文章
              </h3>
              <ul className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <li key={post.id}>
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="text-sm text-gray-600 hover:text-gray-900 line-clamp-2 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 功能链接 */}
            <div className="bg-white rounded-lg shadow p-6 card transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                快速链接
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                    管理后台
                  </Link>
                </li>
                <li>
                  <Link href="/admin/themes" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                    主题管理
                  </Link>
                </li>
                <li>
                  <Link href="/api/posts" className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                    API 文档
                  </Link>
                </li>
              </ul>
            </div>

            {/* 主题展示 */}
            <div className="bg-white rounded-lg shadow p-6 card transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300">
                🎨 主题切换
              </h3>
              <p className="text-gray-600 text-sm mb-4 transition-colors duration-300">
                体验不同的主题风格，点击右上角的主题切换器尝试：
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">默认主题 - 现代简洁</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                  <span className="text-gray-600">暗色主题 - 护眼深色</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-gray-600">简约主题 - 极简优雅</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm transition-colors duration-300">
            <p>&copy; 2024 CMS 系统. 基于 Next.js 构建. 支持主题切换功能.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
