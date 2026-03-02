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

const UserProfile = () => {
  return (
    <div className="flex w-full items-center gap-5 rounded-lg bg-gray-100 px-4 py-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      {/* API연동시 이미지 태그추가 */}
      <div className="bg-primary-100 h-15 w-15 shrink-0 rounded-full"></div>
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="title3">유저닉네임</span>
            <span className="body4 bg-uplus rounded-2xl px-2 py-1 text-white">
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
                <DropdownMenuItem variant="destructive">
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

        <span className="body3 text-gray-700">example@gmail.com</span>
      </div>
    </div>
  );
};

export default UserProfile;
