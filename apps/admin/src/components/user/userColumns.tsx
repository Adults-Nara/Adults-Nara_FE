'use client';
import { UserData } from '@/types/content';
import { Column } from '@components/common';

import { Button, Comment, UserCheck, UserX } from '@repo/ui';
import Image from 'next/image';

const STATUS_MAP: Record<
  UserData['status'],
  { label: string; className: string }
> = {
  ACTIVE: { label: '활성', className: 'bg-green-600 text-white' },
  DEACTIVATED: { label: '비활성', className: 'bg-gray-600 text-white' },
  SUSPENDED_7: { label: '정지 7일', className: 'bg-orange-500 text-white' },
  SUSPENDED_15: { label: '정지 15일', className: 'bg-orange-600 text-white' },
  SUSPENDED_30: { label: '정지 30일', className: 'bg-red-500 text-white' },
};

export const USER_COLUMNS = (
  onActive: (id: string) => void,
  onDeactivated: (id: string) => void,
  onReason: (reason: string | undefined) => void,
): Column<UserData>[] => [
  {
    key: 'profileImageUrl',
    label: '프로필',
    width: '70px',
    render: (item) => (
      // 프로필사진
      <div className="relative h-12.5 w-12.5 shrink-0 overflow-hidden rounded-full">
        <Image
          fill
          className="object-cover"
          src={item.profileImageUrl}
          alt="프로필사진"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
  {
    key: 'nickname',
    label: '닉네임',
    width: '120px',
    align: 'left',
  },
  {
    key: 'email',
    label: '이메일',
    width: '200px',
    align: 'left',
  },
  {
    key: 'status',
    label: '상태',
    width: '100px',
    align: 'center',
    render: (item) => (
      <span
        className={`body4 rounded-full px-3 py-1.5 ${STATUS_MAP[item.status].className}`}
      >
        {STATUS_MAP[item.status].label}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '140px',
    align: 'center',
  },
  {
    key: 'actions',
    label: '관리',
    width: '190px',
    align: 'center',
    render: (item) => (
      <div className="flex justify-end gap-2 pr-5">
        {item.status === 'ACTIVE' ? (
          <div>
            <Button
              onClick={() => onDeactivated(item.id)}
              variant={'outline'}
              size={'lg'}
            >
              <UserX /> 비활성화
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onReason(item.banReason)}
              className="body2 hover:text-primary-400 flex cursor-pointer items-center"
            >
              <Comment className="h-5 w-5" />
              사유
            </button>
            <Button
              onClick={() => onActive(item.id)}
              variant={'outline'}
              size={'lg'}
            >
              <UserCheck /> 활성화
            </Button>
          </div>
        )}
      </div>
    ),
  },
];
