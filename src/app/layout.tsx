import type { Metadata } from 'next';
import '@/styles/globals.scss';

import localFont from 'next/font/local';
import RQProvider from '@/components/RQProvider/RQProvider';
import { MSWComponent } from '@/components/MSWComponent/MSWComponent';

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
      <body className={pretendard.className}>
        <MSWComponent />
        <RQProvider>
          <div id='modal'></div>
          {children}
        </RQProvider>
      </body>
    </html>
  );
}
