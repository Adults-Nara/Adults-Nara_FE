'use client';
import { ROUTES } from '@/constant/routes';
import { confirm } from '@/lib/confirm';
import { useLogout } from '@/lib/tanstack/mutation/auth.mutation';
import {
  useDeleteUser,
  useUpdateUser,
} from '@/lib/tanstack/mutation/user.mutation';
import { useMyuplusVerify } from '@/lib/tanstack/query/uplus.query';
import { useUserMe } from '@/lib/tanstack/query/user.query';
import { toast } from '@/lib/toast';
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
import { UserXIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState('');
  const phoneNumber = useAuthStore((state) => state.phoneNumber);
  const { data, isPending, isError, refetch } = useUserMe();
  const { data: myVerify } = useMyuplusVerify({
    phoneNumber: phoneNumber || '0',
  });
  const { mutate: logout } = useLogout();
  const { mutate: editMutate } = useUpdateUser();
  const { mutate: deleteMutate } = useDeleteUser();
  const router = useRouter();

  const handleSave = () => {
    if (nickname.trim().length === 0) {
      return toast.error('값을 입력해주세요.');
    }

    editMutate(
      { nickname: nickname.trim() },
      {
        onSuccess: () => {
          toast.success('수정을 완료되었습니다.');
          setIsEdit(false);
        },
        onError: () => {
          toast.error('수정을 실패하였습니다.');
        },
      },
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirm('정말 탈퇴하시겠습니까?', '탈퇴');
    if (!confirmed) return;

    deleteMutate('직접 탈퇴', {
      onSuccess: () => {
        toast.success('탈퇴를 성공하였습니다.');
        router.replace(ROUTES.HOME);
      },
      onError: () => {
        toast.error('탈퇴를 실패하였습니다.');
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex animate-pulse items-center justify-between rounded-lg bg-white px-4 py-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          {/* avatar */}
          <div className="h-15 w-15 shrink-0 rounded-full bg-gray-200" />

          {/* text */}
          <div className="flex flex-col gap-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="h-5 w-60 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-gray-100 px-4 py-6 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
        <UserXIcon size={35} className="text-primary-600" />
        <span className="body2 text-primary-600">
          내정보를 불러오지 못했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="body3 mt-2 underline opacity-60"
        >
          다시 시도하기
        </button>
      </div>
    );
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
