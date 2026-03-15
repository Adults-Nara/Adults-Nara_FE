import type { Metadata } from 'next';
import './globals.css';
import BottomSheet from '@/components/BottomSheet';
import QueryProvider from '@/lib/tanstack/QueryProvider';
import { AuthProvider } from '@/components/auth';

export const metadata: Metadata = {
  title: '어!신나',
  description: '시니어 OTT 서비스 입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="custom-scrollbar">
      <body className={`antialiased`}>
        <div
          id="app-container"
          className="bg-background mx-auto min-h-dvh max-w-112.5"
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <BottomSheet />
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
