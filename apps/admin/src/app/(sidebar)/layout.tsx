import { Sidebar } from '@/components/common';

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <Sidebar />
      {children}
    </div>
  );
}
