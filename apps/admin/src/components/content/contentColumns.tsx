'use client';
import { Column } from '@components/common';
import { formatViewCount } from '@/utils/format';
import Link from 'next/link';
import { Delete, Edit } from '@repo/ui';
import { ContentItem } from '@/models/content.model';
import Image from 'next/image';

const TRANSCODING_STATUS = {
  UPLOADED: {
    label: '업로드 완료',
    className: 'bg-gray-500 text-white',
  },
  TRANSCODING: {
    label: '진행중',
    className: 'bg-blue-500 text-white',
  },
  READY: {
    label: '완료',
    className: 'bg-green-600 text-white',
  },
  FAILED: {
    label: '실패',
    className: 'bg-red-500 text-white',
  },
};

export const CONTENT_COLUMNS = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): Column<ContentItem>[] => [
  {
    key: 'title',
    label: '동영상',
    width: 'auto',
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-20 shrink-0 rounded-md bg-gray-200">
          {item.thumbnailUrl && (
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        {/* 썸네일 */}
        <div className="overflow-hidden">
          <p className="truncate">{item.title}</p>
          <p className="body3 truncate text-gray-700">{item.description}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'otherVideoUrl', //TODO: 추후 링크상태 확인
    label: '링크',
    width: '80px',
    align: 'center',
    render: (item) => (
      <Link
        href={`https://www.asinna.store/long/${item.videoId}`}
        className="cursor-pointer text-blue-500 underline"
      >
        링크
      </Link>
    ),
  },
  {
    key: 'viewCount',
    label: '조회수',
    width: '90px',
    align: 'center',
    render: (item) => formatViewCount(item.viewCount),
  },
  {
    key: 'likeCount',
    label: '좋아요',
    width: '80px',
    align: 'center',
    render: (item) => formatViewCount(item.likeCount),
  },
  {
    key: 'dislikeCount',
    label: '싫어요',
    width: '80px',
    align: 'center',
    render: (item) => formatViewCount(item.dislikeCount),
  },
  {
    key: 'commentCount',
    label: '댓글',
    width: '70px',
    align: 'center',
    render: (item) => formatViewCount(item.commentCount),
  },
  {
    key: 'visibility',
    label: '상태',
    width: '90px',
    align: 'center',
    render: (item) => (
      <span
        className={`body4 rounded-full px-3 py-1.5 ${
          item.visibility === 'PUBLIC'
            ? 'bg-green-600 text-white'
            : 'bg-gray-600 text-white'
        }`}
      >
        {item.visibility === 'PUBLIC' ? '활성' : '비활성'}
      </span>
    ),
  },
  {
    key: 'processingStatus',
    label: '트랜스코딩',
    width: '120px',
    align: 'center',
    render: (item) => {
      const status = TRANSCODING_STATUS[item.processingStatus];

      return (
        <span className={`body4 rounded-full px-3 py-1.5 ${status.className}`}>
          {status.label}
        </span>
      );
    },
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
    width: '90px',
    align: 'center',
    render: (item) => (
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => onEdit(item.videoId)} className="cursor-pointer">
          <Edit className="h-6 w-6" />
        </button>
        <button
          onClick={() => onDelete(item.videoId)}
          className="cursor-pointer text-red-500"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>
    ),
  },
];
