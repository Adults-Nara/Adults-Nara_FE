import Navigation from '../../components/Navigation';

export default function NavOnlyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <main className="mb-17.5">{children}</main>
      <Navigation />
    </div>
  );
}
