import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-112.5 flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Navigation />
    </div>
  );
}
