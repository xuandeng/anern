import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { MediaModel } from '@/lib/database/models';
import { withAuth, PERMISSIONS } from '@/lib/auth/permissions';
import { 
  generateUniqueFilename, 
  isValidImageType, 
  isValidFileSize, 
  ensureDirectoryExists 
} from '@/lib/utils/helpers';

// POST /api/upload - 上传文件
export async function POST(request) {
  return withAuth(async (req) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file) {
        return NextResponse.json(
          { success: false, error: '未选择文件' },
          { status: 400 }
        );
      }

      // 验证文件类型
      if (!isValidImageType(file.type)) {
        return NextResponse.json(
          { success: false, error: '不支持的文件类型，仅支持 JPEG、PNG、GIF、WebP' },
          { status: 400 }
        );
      }

      // 验证文件大小
      if (!isValidFileSize(file.size)) {
        return NextResponse.json(
          { success: false, error: '文件大小超出限制' },
          { status: 400 }
        );
      }

      // 生成唯一文件名
      const filename = generateUniqueFilename(file.name);
      
      // 创建上传目录（按年月分类）
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(year), month);
      
      ensureDirectoryExists(uploadDir);

      // 文件路径
      const filePath = path.join(uploadDir, filename);
      const relativePath = `/uploads/${year}/${month}/${filename}`;
      const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${relativePath}`;

      // 保存文件
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // 保存到数据库
      const mediaData = {
        filename,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        path: relativePath,
        url,
        author_id: req.user.id
      };

      const media = MediaModel.create(mediaData);

      return NextResponse.json({
        success: true,
        data: media,
        message: '文件上传成功'
      });
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { success: false, error: '文件上传失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.MANAGE_MEDIA)(request);
}

// GET /api/upload - 获取媒体文件列表
export async function GET(request) {
  return withAuth(async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = searchParams.get('page') || 1;
      const limit = searchParams.get('limit') || 20;
      const author = searchParams.get('author');

      // 计算分页
      let conditions = {};
      if (author) {
        conditions.author_id = parseInt(author);
      }

      const total = MediaModel.count(conditions);
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const media = MediaModel.findAll(conditions, {
        limit: parseInt(limit),
        offset,
        orderBy: 'created_at DESC'
      });

      return NextResponse.json({
        success: true,
        data: media,
        pagination: {
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get media error:', error);
      return NextResponse.json(
        { success: false, error: '获取媒体文件失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.MANAGE_MEDIA)(request);
}