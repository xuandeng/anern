import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Inter } from 'next/font/google';

// 使用 Google Fonts 的 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "CMS 系统 - 现代化内容管理系统",
  description: "基于 Next.js 构建的现代化 CMS 系统，支持文章管理、媒体库、用户权限等功能",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
