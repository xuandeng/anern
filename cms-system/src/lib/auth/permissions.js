import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import authConfig from './config';

// 服务端权限检查
export async function hasPermission(permission) {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.permissions) {
    return false;
  }
  
  return session.user.permissions.includes(permission);
}

// 客户端权限检查 Hook
export function usePermission(permission) {
  const { data: session } = useSession();
  
  if (!session?.user?.permissions) {
    return false;
  }
  
  return session.user.permissions.includes(permission);
}

// 检查是否为管理员
export async function isAdmin() {
  const session = await getServerSession(authConfig);
  return session?.user?.roleId === 1;
}

// 权限常量
export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_POSTS: 'manage_posts',
  EDIT_POSTS: 'edit_posts',
  PUBLISH_POSTS: 'publish_posts',
  MANAGE_PAGES: 'manage_pages',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_TAGS: 'manage_tags',
  MANAGE_MEDIA: 'manage_media',
  MANAGE_THEMES: 'manage_themes',
  MANAGE_PLUGINS: 'manage_plugins',
  MANAGE_SETTINGS: 'manage_settings',
};

// 权限装饰器（用于 API 路由）
export function requirePermission(permission) {
  return function(handler) {
    return async function(req, res) {
      const session = await getServerSession(req, res, authConfig);
      
      if (!session) {
        return res.status(401).json({ error: '未授权访问' });
      }
      
      if (!session.user.permissions.includes(permission)) {
        return res.status(403).json({ error: '权限不足' });
      }
      
      return handler(req, res);
    };
  };
}

// 权限中间件
export function withAuth(handler, requiredPermission = null) {
  return async function(req, res) {
    const session = await getServerSession(req, res, authConfig);
    
    if (!session) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    if (requiredPermission && !session.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: '权限不足' });
    }
    
    // 将用户信息添加到请求对象
    req.user = session.user;
    
    return handler(req, res);
  };
}