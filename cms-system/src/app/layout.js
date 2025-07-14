import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CMS 系统 - 现代化内容管理系统",
  description: "基于 Next.js 构建的现代化 CMS 系统，支持文章管理、媒体库、用户权限等功能",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
