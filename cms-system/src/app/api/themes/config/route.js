import { NextResponse } from 'next/server';
import themeManager from '@/lib/themes/themeManager';

// GET /api/themes/config?theme=themeName - 获取主题配置
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeName = searchParams.get('theme') || 'default';

    // 验证主题是否存在
    if (!themeManager.themeExists(themeName)) {
      return NextResponse.json(
        { success: false, error: '主题不存在' },
        { status: 404 }
      );
    }

    // 获取主题配置
    const config = themeManager.getThemeConfig(themeName);

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('获取主题配置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取主题配置失败' },
      { status: 500 }
    );
  }
}