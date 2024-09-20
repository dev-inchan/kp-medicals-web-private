import type { Metadata } from 'next';
import '@/styles/globals.scss';
import Head from 'next/head';
import localFont from 'next/font/local';
import RQProvider from '@/components/RQProvider/RQProvider';
import { MSWComponent } from '@/components/MSWComponent/MSWComponent';
import { Suspense } from 'react';

// Pretendard 폰트 설정
const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard', // CSS 변수 이름
});

export const metadata: Metadata = {
  title: 'Medical Wallet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <Head>
        {/* 뷰포트 메타 태그 설정 */}
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body className={pretendard.className}>
        <MSWComponent />
        <RQProvider>
          <Suspense>
            <div id='modal'></div>
            {children}
          </Suspense>
        </RQProvider>
      </body>
    </html>
  );
}
