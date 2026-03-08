'use client';
import { useLogout } from '@/lib/tanstack/mutation/auth.mutation';
import { useUserMe } from '@/lib/tanstack/query/user.query';
import {
  Pen,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Settings,
  UserX,
  Logout,
} from '@repo/ui';
import Image from 'next/image';

const UserProfile = () => {
  const { data, isPending, isError } = useUserMe();
  const { mutate: logout } = useLogout();

  //TODO: 추후 로딩 에러 화면 구현
  if (isPending) {
    return <span>로딩중...</span>;
  }
  if (isError) {
    return <span>정보를 불러오지못했습니다</span>;
  }

  return (
    <div className="flex w-full items-center gap-5 rounded-lg bg-gray-100 px-4 py-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      <div className="bg-primary-100 relative h-15 w-15 shrink-0 overflow-hidden rounded-full">
        {data.profileImageUrl ? (
          <Image src={data.profileImageUrl} alt={data.nickname} fill />
        ) : null}
      </div>
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="title2">{data.nickname}</span>
            {/* TODO: 추후 뱃지 위치 변경이나 로직 추가 */}
            <span className="body4 bg-uplus rounded-2xl px-2 py-0.75 text-white">
              LG U+ 회원
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Settings className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Pen />
                  프로필 수정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logout()}
                >
                  <Logout />
                  로그아웃
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <UserX />
                  회원탈퇴
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="body3 truncate text-gray-700">{data.email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
