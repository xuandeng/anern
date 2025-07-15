import { NextResponse } from 'next/server';
import { readdirSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { withAuth, PERMISSIONS } from '@/lib/auth/permissions';
import { SettingModel } from '@/lib/database/models';

// GET /api/themes - 获取所有主题列表
export async function GET(request) {
  return withAuth(async (req) => {
    try {
      const themesDir = path.join(process.cwd(), 'themes');
      
      if (!existsSync(themesDir)) {
        return NextResponse.json({
          success: true,
          data: [],
          message: '主题目录不存在'
        });
      }

      const themes = [];
      const themeFolders = readdirSync(themesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folder of themeFolders) {
        const themePath = path.join(themesDir, folder);
        const configPath = path.join(themePath, 'theme.json');
        
        let themeConfig = {
          name: folder,
          displayName: folder,
          version: '1.0.0',
          author: 'Unknown',
          description: '无描述',
          screenshot: null
        };

        // 读取主题配置
        if (existsSync(configPath)) {
          try {
            const configContent = readFileSync(configPath, 'utf8');
            themeConfig = { ...themeConfig, ...JSON.parse(configContent) };
          } catch (error) {
            console.error(`读取主题配置失败: ${folder}`, error);
          }
        }

        // 检查截图文件
        const screenshotExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        for (const ext of screenshotExts) {
          const screenshotPath = path.join(themePath, `screenshot${ext}`);
          if (existsSync(screenshotPath)) {
            themeConfig.screenshot = `/themes/${folder}/screenshot${ext}`;
            break;
          }
        }

        themes.push(themeConfig);
      }

      // 获取当前激活的主题
      const activeTheme = SettingModel.getValue('active_theme') || 'default';

      return NextResponse.json({
        success: true,
        data: {
          themes,
          activeTheme
        }
      });
    } catch (error) {
      console.error('获取主题列表失败:', error);
      return NextResponse.json(
        { success: false, error: '获取主题列表失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.MANAGE_THEMES)(request);
}

// POST /api/themes - 激活主题
export async function POST(request) {
  return withAuth(async (req) => {
    try {
      const { themeName } = await req.json();

      if (!themeName) {
        return NextResponse.json(
          { success: false, error: '主题名称不能为空' },
          { status: 400 }
        );
      }

      // 检查主题是否存在
      const themePath = path.join(process.cwd(), 'themes', themeName);
      if (!existsSync(themePath)) {
        return NextResponse.json(
          { success: false, error: '指定的主题不存在' },
          { status: 404 }
        );
      }

      // 更新激活主题设置
      SettingModel.setValue('active_theme', themeName);

      return NextResponse.json({
        success: true,
        data: { activeTheme: themeName },
        message: '主题切换成功'
      });
    } catch (error) {
      console.error('主题切换失败:', error);
      return NextResponse.json(
        { success: false, error: '主题切换失败' },
        { status: 500 }
      );
    }
  }, PERMISSIONS.MANAGE_THEMES)(request);
}