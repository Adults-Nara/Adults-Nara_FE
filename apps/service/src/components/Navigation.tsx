'use client';
import { Home, Profile, Shorts } from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: '홈', href: '/home', icon: <Home className="h-7 w-7" /> },
    { name: '쇼츠', href: '/shorts', icon: <Shorts className="h-7 w-7" /> },
    {
      name: '내 정보',
      href: '/mypage',
      icon: <Profile className="h-7 w-7" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 z-40 h-17.5 w-full max-w-112.5 border-t border-gray-300 bg-gray-100">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const iconElement = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex h-full w-full flex-col items-center justify-center gap-2 transition-transform active:scale-95 ${
                isActive
                  ? 'text-primary-500'
                  : 'hover:text-primary-600 text-gray-900'
              }`}
            >
              {iconElement}
              <span className="body4">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
