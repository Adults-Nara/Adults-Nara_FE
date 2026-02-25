import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '어신나 관리자 페이지',
  description: '어르신나라 관리자 페이지 입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="custom-scrollbar">
      <body className={`custom-scrollbar h-dvh bg-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
