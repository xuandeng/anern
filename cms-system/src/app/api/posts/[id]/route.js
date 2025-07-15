import { NextResponse } from 'next/server';
import { PostModel } from '@/lib/database/models';
import { withAuth, PERMISSIONS } from '@/lib/auth/permissions';
import { generateSlug, generateExcerpt } from '@/lib/utils/helpers';

// GET /api/posts/[id] - 获取单个文章
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // 检查是通过 ID 还是 slug 查询
    let post;
    if (isNaN(id)) {
      // 如果不是数字，按 slug 查询
      post = PostModel.findBySlug(id);
    } else {
      // 按 ID 查询
      post = PostModel.findById(parseInt(id));
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    // 获取完整的文章信息（包含分类和标签）
    const fullPost = PostModel.getPostWithMeta(post.id);

    return NextResponse.json({
      success: true,
      data: fullPost
    });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { success: false, error: '获取文章失败' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - 更新文章
export async function PUT(request, { params }) {
  return withAuth(async (req) => {
    try {
      const { id } = params;
      const body = await req.json();
      const { title, content, excerpt, status, categories, tags, featured_image } = body;

      // 查找文章
      const existingPost = PostModel.findById(parseInt(id));
      if (!existingPost) {
        return NextResponse.json(
          { success: false, error: '文章不存在' },
          { status: 404 }
        );
      }

      // 检查权限：作者可以编辑自己的文章，或者有管理文章权限
      const hasManagePermission = req.user.permissions.includes(PERMISSIONS.MANAGE_POSTS);
      const isAuthor = existingPost.author_id === req.user.id;
      
      if (!hasManagePermission && !isAuthor) {
        return NextResponse.json(
          { success: false, error: '权限不足' },
          { status: 403 }
        );
      }

      // 验证必要字段
      if (!title || !content) {
        return NextResponse.json(
          { success: false, error: '标题和内容不能为空' },
          { status: 400 }
        );
      }

      // 生成 slug（如果标题改变了）
      let slug = existingPost.slug;
      if (title !== existingPost.title) {
        slug = generateSlug(title);
        
        // 检查新的 slug 是否重复
        const duplicatePost = PostModel.findBySlug(slug);
        if (duplicatePost && duplicatePost.id !== existingPost.id) {
          return NextResponse.json(
            { success: false, error: '文章标题重复，请修改标题' },
            { status: 400 }
          );
        }
      }

      // 准备更新数据
      const updateData = {
        title,
        slug,
        content,
        excerpt: excerpt || generateExcerpt(content),
        featured_image
      };

      // 如果状态改变了
      if (status && status !== existingPost.status) {
        updateData.status = status;
        if (status === 'published' && !existingPost.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      // 更新文章
      const updatedPost = PostModel.update(parseInt(id), updateData);

      // 更新分类关联
      if (categories !== undefined) {
        PostModel.addCategories(parseInt(id), categories);
      }

      // 更新标签关联
      if (tags !== undefined) {
        PostModel.addTags(parseInt(id), tags);
      }

      // 获取完整的文章信息
      const fullPost = PostModel.getPostWithMeta(parseInt(id));

      return NextResponse.json({
        success: true,
        data: fullPost,
        message: '文章更新成功'
      });
    } catch (error) {
      console.error('Update post error:', error);
      return NextResponse.json(
        { success: false, error: '更新文章失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.EDIT_POSTS)(request);
}

// DELETE /api/posts/[id] - 删除文章
export async function DELETE(request, { params }) {
  return withAuth(async (req) => {
    try {
      const { id } = params;

      // 查找文章
      const existingPost = PostModel.findById(parseInt(id));
      if (!existingPost) {
        return NextResponse.json(
          { success: false, error: '文章不存在' },
          { status: 404 }
        );
      }

      // 检查权限：作者可以删除自己的文章，或者有管理文章权限
      const hasManagePermission = req.user.permissions.includes(PERMISSIONS.MANAGE_POSTS);
      const isAuthor = existingPost.author_id === req.user.id;
      
      if (!hasManagePermission && !isAuthor) {
        return NextResponse.json(
          { success: false, error: '权限不足' },
          { status: 403 }
        );
      }

      // 删除文章（级联删除会自动处理关联表）
      PostModel.delete(parseInt(id));

      return NextResponse.json({
        success: true,
        message: '文章删除成功'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      return NextResponse.json(
        { success: false, error: '删除文章失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.EDIT_POSTS)(request);
}