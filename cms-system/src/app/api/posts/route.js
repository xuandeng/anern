import { NextResponse } from 'next/server';
import { PostModel } from '@/lib/database/models';
import { withAuth, PERMISSIONS } from '@/lib/auth/permissions';
import { generateSlug, generateExcerpt, calculatePagination } from '@/lib/utils/helpers';

// GET /api/posts - 获取文章列表
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const status = searchParams.get('status');
    const author = searchParams.get('author');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // 构建查询条件
    let conditions = {};
    if (status) conditions.status = status;
    if (author) conditions.author_id = author;

    // 计算分页
    const total = PostModel.count(conditions);
    const pagination = calculatePagination(page, limit, total);

    // 获取文章列表
    const posts = PostModel.findAll(conditions, {
      limit: pagination.itemsPerPage,
      offset: pagination.offset,
      orderBy: 'created_at DESC'
    });

    // 如果需要完整信息，获取分类和标签
    const postsWithMeta = posts.map(post => {
      if (searchParams.get('with_meta') === 'true') {
        return PostModel.getPostWithMeta(post.id);
      }
      return post;
    });

    return NextResponse.json({
      success: true,
      data: postsWithMeta,
      pagination
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/posts - 创建文章
export async function POST(request) {
  return withAuth(async (req) => {
    try {
      const body = await req.json();
      const { title, content, excerpt, status, categories, tags, featured_image } = body;

      // 验证必要字段
      if (!title || !content) {
        return NextResponse.json(
          { success: false, error: '标题和内容不能为空' },
          { status: 400 }
        );
      }

      // 生成 slug
      const slug = generateSlug(title);
      
      // 检查 slug 是否重复
      const existingPost = PostModel.findBySlug(slug);
      if (existingPost) {
        return NextResponse.json(
          { success: false, error: '文章标题重复，请修改标题' },
          { status: 400 }
        );
      }

      // 创建文章数据
      const postData = {
        title,
        slug,
        content,
        excerpt: excerpt || generateExcerpt(content),
        status: status || 'draft',
        featured_image,
        author_id: req.user.id,
        published_at: status === 'published' ? new Date().toISOString() : null
      };

      // 创建文章
      const post = PostModel.create(postData);

      // 添加分类关联
      if (categories && categories.length > 0) {
        PostModel.addCategories(post.id, categories);
      }

      // 添加标签关联
      if (tags && tags.length > 0) {
        PostModel.addTags(post.id, tags);
      }

      // 获取完整的文章信息
      const fullPost = PostModel.getPostWithMeta(post.id);

      return NextResponse.json({
        success: true,
        data: fullPost,
        message: '文章创建成功'
      });
    } catch (error) {
      console.error('Create post error:', error);
      return NextResponse.json(
        { success: false, error: '创建文章失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.EDIT_POSTS)(request);
}