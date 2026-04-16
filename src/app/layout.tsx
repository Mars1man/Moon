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

        {/* Adsterra 横幅广告配置和加载 */}
        <Script
          id="adsterra-banner-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('[Adsterra] 开始加载横幅广告');
                
                function loadBanner() {
                  var container = document.getElementById('adsterra-banner-container');
                  if (!container) {
                    console.log('[Adsterra] 容器未找到，重试中...');
                    setTimeout(loadBanner, 200);
                    return;
                  }
                  
                  console.log('[Adsterra] 容器找到，开始加载广告');
                  
                  // 设置广告配置
                  var atOptions = {
                    key: '332cf9d258e9f9b3875eba9a33f958d0',
                    format: 'iframe',
                    height: 60,
                    width: 468,
                    params: {}
                  };
                  
                  console.log('[Adsterra] 配置完成:', atOptions);
                  
                  // 创建并加载广告脚本
                  var script = document.createElement('script');
                  script.src = 'https://www.highperformanceformat.com/332cf9d258e9f9b3875eba9a33f958d0/invoke.js';
                  script.async = true;
                  script.onload = function() {
                    console.log('[Adsterra] 广告脚本加载完成');
                  };
                  script.onerror = function() {
                    console.error('[Adsterra] 广告脚本加载失败');
                  };
                  
                  container.appendChild(script);
                }
                
                // 等待DOM加载完成
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', loadBanner);
                } else {
                  loadBanner();
                }
              })();
            `,
          }}
        />

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SiteProvider siteName={siteName} announcement={announcement}>
            {/* Adsterra 横幅广告容器 */}
            <div 
              id="adsterra-banner-container" 
              className="w-full flex justify-center py-2"
              style={{ minHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            />
            {children}
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
