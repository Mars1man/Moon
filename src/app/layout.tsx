import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { getConfig } from '@/lib/config';

import { SiteProvider } from '../components/SiteProvider';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

// 动态生成 metadata，支持配置更新后的标题变化
export async function generateMetadata(): Promise<Metadata> {
  let siteName = process.env.SITE_NAME || 'EarthTV';
  if (process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
  }

  return {
    title: siteName,
    description: '影视聚合',
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteName = process.env.SITE_NAME || 'EarthTV';
  let announcement =
    process.env.ANNOUNCEMENT ||
    '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';
  let enableRegister = process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true';
  let imageProxy = process.env.NEXT_PUBLIC_IMAGE_PROXY || '';
  if (process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
    announcement = config.SiteConfig.Announcement;
    enableRegister = config.UserConfig.AllowRegister;
    imageProxy = config.SiteConfig.ImageProxy;
  }

  // 将运行时配置注入到全局 window 对象，供客户端在运行时读取
  const runtimeConfig = {
    STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
    ENABLE_REGISTER: enableRegister,
    IMAGE_PROXY: imageProxy,
  };

  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200`}
      >
        {/* Adsterra 弹窗广告 */}
        <Script
          src="https://pl29165876.profitablecpmratenetwork.com/69/e5/a4/69e5a47e0b64d9979c95b528d48ddc35.js"
          strategy="afterInteractive"
        />

        {/* 运行时配置 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />

        {/* Adsterra 横幅广告配置 */}
        <Script
          id="adsterra-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var atOptions = {
                key: '332cf9d258e9f9b3875eba9a33f958d0',
                format: 'iframe',
                height: 60,
                width: 468,
                params: {}
              };
            `,
          }}
        />

        {/* Adsterra 横幅广告加载 */}
        <Script
          src="https://www.highperformanceformat.com/332cf9d258e9f9b3875eba9a33f958d0/invoke.js"
          strategy="afterInteractive"
        />

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SiteProvider siteName={siteName} announcement={announcement}>
            {children}
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
