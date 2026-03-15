'use client';
import { ROUTES } from '@/constant/routes';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { useLogout } from '@/lib/tanstack/mutation/auth.mutation';
import {
  useDeleteUser,
  useUpdateUser,
} from '@/lib/tanstack/mutation/user.mutation';
import { useMyuplusVerify } from '@/lib/tanstack/query/uplus.query';
import { useUserMe } from '@/lib/tanstack/query/user.query';
import { useAuthStore } from '@/store/useAuthStore';
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
  Input,
  Button,
} from '@repo/ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState('');
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { data, isPending, isError } = useUserMe();
  const { data: myVerify } = useMyuplusVerify({
    phoneNumber: phoneNumber || '0',
  });
  const { mutate: logout } = useLogout();
  const { mutate: editMutate } = useUpdateUser();
  const { mutate: deleteMutate } = useDeleteUser();
  const router = useRouter();

  const handleSave = () => {
    if (nickname.trim().length === 0) {
      //TODO: 추후 토스트 변경
      return console.log('값을 입력해주세요');
    }

    editMutate(
      { nickname: nickname.trim() },
      {
        onSuccess: () => {
          //TODO: 추후 토스트로 변경
          console.log('수정성공');
          setIsEdit(false);
        },
        onError: () => {
          //TODO: 추후 토스트로 변경
          console.log('수정실패');
        },
      },
    );
  };

  const handleDelete = () => {
    //TODO: 추후 모달창 수정
    const confirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    );
    if (!confirmed) return;

    deleteMutate('직접 탈퇴', {
      onSuccess: () => {
        //TODO: 추후 토스트로 변경
        console.log('탈퇴 성공');
        router.replace(ROUTES.HOME);
      },
      onError: () => {
        //TODO: 추후 토스트로 변경
        console.log('탈퇴 실패');
      },
    });
  };

  //TODO: 추후 로딩 에러 화면 구현
  if (isPending) {
    return <span>로딩중...</span>;
  }
  if (isError) {
    return <span>정보를 불러오지못했습니다</span>;
  }

  return (
    <div className="flex w-full items-center gap-5 rounded-lg bg-gray-100 px-4 py-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-full">
        <Image
          src={data.profileImageUrl ?? `/defaultProfile.png`}
          alt={data.nickname}
          width={60}
          height={60}
          className="object-cover"
        />
      </div>
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        {isEdit ? (
          <div className="flex h-10 w-full justify-between">
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-9 w-40"
            />
            <Button onClick={handleSave} size={'lg'}>
              저장
            </Button>
          </div>
        ) : (
          <div className="flex h-10 w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="title2">{data.nickname}</span>
              {myVerify?.verified && (
                <span className="body4 bg-uplus rounded-2xl px-2 py-0.75 text-white">
                  LG U+ 회원
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Settings className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEdit(true);
                      setNickname(data.nickname);
                    }}
                  >
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
                  <DropdownMenuItem
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    <UserX />
                    회원탈퇴
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <span className="body3 truncate text-gray-700">{data.email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
