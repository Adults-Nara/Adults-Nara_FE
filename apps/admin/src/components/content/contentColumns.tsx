'use client';
import { VideoData } from '@/types/content';
import { Column } from '@components/common';

import { formatViewCount } from '@/utils/format';
import Link from 'next/link';
import { Delete, Edit } from '@repo/ui';

export const CONTENT_COLUMNS = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): Column<VideoData>[] => [
  {
    key: 'title',
    label: '동영상',
    width: 'auto',
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="h-12 w-20 shrink-0 rounded-md bg-gray-200" />
        {/* 썸네일 */}
        <div className="overflow-hidden">
          <p className="truncate">{item.title}</p>
          <p className="body3 truncate text-gray-700">{item.desc}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'link',
    label: '링크',
    width: '80px',
    align: 'center',
    render: (item) => (
      <Link
        href={`${item.id}`}
        className="cursor-pointer text-blue-500 underline"
      >
        링크
      </Link>
    ),
  },
  {
    key: 'views',
    label: '조회수',
    width: '80px',
    align: 'center',
    render: (item) => formatViewCount(item.views),
  },
  {
    key: 'likes',
    label: '좋아요',
    width: '80px',
    align: 'center',
    render: (item) => formatViewCount(item.likes),
  },
  {
    key: 'dislikes',
    label: '싫어요',
    width: '80px',
    align: 'center',
    render: (item) => formatViewCount(item.dislikes),
  },
  {
    key: 'comments',
    label: '댓글',
    width: '70px',
    align: 'center',
    render: (item) => formatViewCount(item.comments),
  },
  {
    key: 'status',
    label: '상태',
    width: '90px',
    align: 'center',
    render: (item) => (
      <span
        className={`body4 rounded-full px-3 py-1.5 ${
          item.status === 'active'
            ? 'bg-green-600 text-white'
            : 'bg-gray-600 text-white'
        }`}
      >
        {item.status === 'active' ? '활성' : '비활성'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '120px',
    align: 'center',
    render: (item) => <span className="body3"> {item.createdAt}</span>,
  },
  {
    key: 'actions',
    label: '관리',
    width: '90px',
    align: 'center',
    render: (item) => (
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => onEdit(item.id)} className="cursor-pointer">
          <Edit className="h-6 w-6" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="cursor-pointer text-red-500"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>
    ),
  },
];
