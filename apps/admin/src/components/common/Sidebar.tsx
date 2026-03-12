'use client';
import { ROUTES } from '@/constant/routes';
import {
  useBackofficeAccount,
  useBackofficeLogout,
} from '@/lib/tanstack/mutation/auth.mutation';
import { useBackofficeMe } from '@/lib/tanstack/query/auth.query';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FilmIcon,
  Logo,
  Logout,
  Settings,
  Upload,
  Users,
  UserX,
} from '@repo/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: userData, isError, isPending, refetch } = useBackofficeMe();
  const { mutate: logoutMutate } = useBackofficeLogout();
  const { mutate: accountMutate } = useBackofficeAccount();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: () => {
        //TODO:토스트로 추후변경
        console.log('로그아웃 성공');
      },
      onError: (error) => {
        console.error('로그아웃 요청 실패:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해 주세요');
      },
    });
  };
  const handleAccount = () => {
    accountMutate(undefined, {
      onSuccess: () => {
        //TODO:토스트로 추후변경
        console.log('회원탈퇴 성공');
      },
      onError: (error) => {
        console.error('회원탈퇴 요청 실패:', error);
        alert('탈퇴에 실패했습니다. 다시 시도해 주세요');
      },
    });
  };

  const getLinkStyle = (href: string) =>
    cn(
      'flex items-center gap-1 rounded-sm p-2 transition-colors',
      pathname.startsWith(href) ? 'bg-primary-600' : 'hover:bg-gray-800',
    );

  if (isPending)
    return (
      <div className="bg-navy flex h-full min-w-75 flex-col justify-center gap-5 px-10 text-white">
        {/* TODO: 사이드바 로딩UI  */}
        <span className="text-center">로딩중...</span>
      </div>
    );
  if (isError)
    return (
      <div className="bg-navy flex h-full min-w-75 flex-col justify-center gap-5 px-10 text-white">
        {/* TODO: 사이드바 에러UI  */}
        <span className="text-center">유저 정보를 불러오지못했습니다.</span>
        <Button onClick={() => refetch()}>재시도</Button>
      </div>
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
          {userData.role === 'ADMIN' ? (
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
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-5 p-3">
        <div className="bg-primary-100 relative h-12.5 w-12.5 shrink-0 rounded-full">
          {userData.profileImageUrl ? (
            <Image
              className="h-full w-full rounded-full object-cover"
              src={userData.profileImageUrl}
              alt="유저 프로필"
              fill
            />
          ) : null}
        </div>
        <div className="flex w-full flex-col">
          <span className="title3">{userData.nickname}</span>
          <span className="body3 text-gray-700">{userData.email}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Settings className="h-5 w-5 cursor-pointer" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <Logout />
                로그아웃
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAccount} variant="destructive">
                <UserX />
                회원탈퇴
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
