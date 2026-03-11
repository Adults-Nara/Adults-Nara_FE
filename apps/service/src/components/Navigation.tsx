'use client';
import { ROUTES } from '@/constant/routes';
import { Home, Profile, Shorts } from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigateWithPrefetch } from '@/hooks/useNavigateWithPrefetch';

const Navigation = () => {
  const pathname = usePathname();
  const { navigateToShorts, isNavigating } = useNavigateWithPrefetch();

  const navItems = [
    { name: '홈', href: ROUTES.HOME, icon: <Home className="h-7 w-7" /> },
    { name: '쇼츠', href: ROUTES.SHORTS, icon: <Shorts className="h-7 w-7" /> },
    {
      name: '내 정보',
      href: ROUTES.MYPAGE,
      icon: <Profile className="h-7 w-7" />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 z-40 h-17.5 w-full max-w-112.5 border-t border-gray-300 bg-gray-100"
      aria-label="하단 메뉴"
    >
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const iconElement = item.icon;

          if (item.name === '쇼츠') {
            return (
              <button
                key={item.name}
                onClick={navigateToShorts}
                disabled={isNavigating}
                className={`flex h-full w-full flex-col items-center justify-center gap-2 transition-transform active:scale-95 ${
                  isActive
                    ? 'text-primary-500'
                    : 'hover:text-primary-600 text-gray-900'
                } ${isNavigating ? 'cursor-wait opacity-50' : ''}`}
              >
                {iconElement}
                <span className="body4">{item.name}</span>
              </button>
            );
          }

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
