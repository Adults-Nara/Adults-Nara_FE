'use client';
import { UsersItem } from '@/models/users.model';
import { Column } from '@components/common';

import { Button, Comment, UserCheck, UserX } from '@repo/ui';
import Image from 'next/image';

const STATUS_MAP: Record<
  UsersItem['banStatus'],
  { label: string; className: string }
> = {
  ACTIVE: { label: '활성', className: 'bg-green-600 text-white' },
  DEACTIVATED: { label: '비활성', className: 'bg-gray-600 text-white' },
  SUSPENDED_7: { label: '정지 7일', className: 'bg-orange-500 text-white' },
  SUSPENDED_15: { label: '정지 15일', className: 'bg-orange-600 text-white' },
  SUSPENDED_30: { label: '정지 30일', className: 'bg-red-500 text-white' },
};

export const USER_COLUMNS = (
  onActive: (id: string, name: string) => void,
  onDeactivated: (id: string, name: string) => void,
  onReason: (reason: string | undefined, name: string) => void,
): Column<UsersItem>[] => [
  {
    key: 'profileImageUrl',
    label: '프로필',
    width: '70px',
    render: (item) => (
      // 프로필사진
      <div className="bg-primary-400 relative h-12.5 w-12.5 shrink-0 overflow-hidden rounded-full">
        {item.profileImageUrl ? (
          <Image
            fill
            className="object-cover"
            src={item.profileImageUrl}
            alt="프로필사진"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : null}
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
    render: (item) => (
      <div className="overflow-hidden">
        <p className="truncate">{item.email}</p>
      </div>
    ),
  },
  {
    key: 'banStatus',
    label: '상태',
    width: '100px',
    align: 'center',
    render: (item) => (
      <span
        className={`body4 rounded-full px-3 py-1.5 ${STATUS_MAP[item.banStatus].className}`}
      >
        {STATUS_MAP[item.banStatus].label}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '120px',
    align: 'center',
    render: (item) => (
      <span className="body3">
        {new Date(item.createdAt).toLocaleDateString('sv-SE')}
      </span>
    ),
  },
  {
    key: 'actions',
    label: '관리',
    width: '190px',
    align: 'center',
    render: (item) => (
      <div className="flex justify-end gap-2 pr-5">
        {item.banStatus === 'ACTIVE' ? (
          <div>
            <Button
              onClick={() => onDeactivated(item.userId, item.nickname)}
              variant={'outline'}
              size={'lg'}
            >
              <UserX /> 비활성화
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onReason(item.banStatus, item.nickname)} //TODO:밴 사유 컬럼없음 체크해봐야할듯
              className="body2 hover:text-primary-400 flex cursor-pointer items-center"
            >
              <Comment className="h-5 w-5" />
              사유
            </button>
            <Button
              onClick={() => onActive(item.userId, item.nickname)}
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
