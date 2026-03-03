'use client';
import { ROUTES } from '@/constant/routes';
import { cn, FilmIcon, Logo, Upload, Users } from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const getLinkStyle = (href: string) =>
    cn(
      'flex items-center gap-1 rounded-sm p-2 transition-colors',
      pathname.startsWith(href) ? 'bg-primary-600' : 'hover:bg-gray-800',
    );
  return (
    <div className="bg-navy flex h-full min-w-75 flex-col justify-between gap-5 text-white">
      <div>
        <div className="flex items-center px-1 py-2">
          <Logo className="h-23 w-23" />
          <span className="title2">관리자 페이지</span>
        </div>
        <div className="flex flex-col gap-6 px-4">
          <div className="flex flex-col gap-1">
            <span className="title3 text-gray-700">콘텐츠 관리</span>
            <Link
              href={ROUTES.CONTENT}
              className={getLinkStyle(ROUTES.CONTENT)}
            >
              <FilmIcon className="h-6 w-6" />
              <span>콘텐츠 리스트</span>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <span className="title3 text-gray-700">사용자 관리</span>
            <Link href={ROUTES.USER} className={getLinkStyle(ROUTES.USER)}>
              <Users className="h-6 w-6" />
              <span>사용자 리스트</span>
            </Link>
            <Link
              href={ROUTES.UPLOADER}
              className={getLinkStyle(ROUTES.UPLOADER)}
            >
              <Upload className="h-6 w-6" />
              <span>업로더 리스트</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5 p-3">
        {/* API연동시 이미지 태그추가 */}
        <div className="bg-primary-100 h-12.5 w-12.5 shrink-0 rounded-full"></div>
        <div className="flex w-full flex-col">
          <span className="title3">유저닉네임</span>
          <span className="body3 text-gray-700">example@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
