import Header from '../../components/Header';
import Navigation from '../../components/Navigation';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="mb-17.5">{children}</main>
      <Navigation />
    </div>
  );
}
