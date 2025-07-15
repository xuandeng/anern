import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 生成 slug
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 生成唯一文件名
export function generateUniqueFilename(originalName) {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  
  return `${generateSlug(name)}-${timestamp}-${random}${ext}`;
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 检查文件类型
export function isValidImageType(mimeType) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimeType);
}

// 检查文件大小
export function isValidFileSize(size, maxSize = null) {
  const max = maxSize || parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
  return size <= max;
}

// 确保目录存在
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成摘要
export function generateExcerpt(content, length = 150) {
  if (!content) return '';
  
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= length) {
    return textContent;
  }
  
  return textContent.substring(0, length).trim() + '...';
}

// 验证邮箱格式
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 分页计算
export function calculatePagination(page, limit, total) {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const itemsPerPage = Math.max(1, parseInt(limit) || 10);
  const totalPages = Math.ceil(total / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    offset,
    total,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

// 格式化日期
export function formatDate(date, locale = 'zh-CN') {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化日期时间
export function formatDateTime(date, locale = 'zh-CN') {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 检查是否为开发环境
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

// 生成随机字符串
export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// 深度合并对象
export function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  if (typeof source !== 'object' || source === null) {
    return target;
  }
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// URL 安全的 Base64 编码
export function urlSafeBase64Encode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// URL 安全的 Base64 解码
export function urlSafeBase64Decode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  return Buffer.from(base64 + padding, 'base64').toString();
}