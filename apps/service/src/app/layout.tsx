import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import BottomSheet from '@/components/BottomSheet';
import QueryProvider from '@/lib/tanstack/QueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          id="app-container"
          className="bg-background mx-auto min-h-dvh max-w-112.5"
        >
          <QueryProvider>
            {children}
            <BottomSheet />
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
