import Header from '../../components/Header';
import Navigation from '../../components/Navigation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-hidde flex h-dvh flex-col">
      <Header />
      <main className="custom-scrollbar mb-17.5 flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
