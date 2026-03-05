'use client';
import { useState } from 'react';

import { CONTENT_COLUMNS } from './contentColumns';
import { DataTable, Pagination } from '@components/common';
import {
  Button,
  Delete,
  Input,
  Power,
  SearchIcon,
  Unpower,
  Upload,
} from '@repo/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constant/routes';
import { useDialogStore } from '@/store/useDialogStore';
import { useContentsList } from '@/lib/tanstack/query/content.query';
import { useAuthStore } from '@/store/useAuthStore';

interface ContentListContainerProps {
  currentPage: number;
  currentKeyword: string;
}

const ContentListContainer = ({
  currentPage,
  currentKeyword,
}: ContentListContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openDialog } = useDialogStore();
  const { role } = useAuthStore.getState();

  const { data, isLoading, isError } = useContentsList(role, {
    page: currentPage,
    keyword: currentKeyword,
  });
  const totalPages = data?.totalPages ?? 0;

  const handlerEdit = (id: string) => {
    router.push(ROUTES.EDIT_CONTENT(id));
  };
  const handlerDelete = (id: string) => {
    openDialog('content', 'delete', {
      onConfirm: () => console.log(id),
    });
  };

  const handlerAllActive = () => {
    openDialog('content', 'activate', {
      onConfirm: () => console.log(selectedIds),
    });
  };
  const handlerAllDeactivated = () => {
    openDialog('content', 'deactivate', {
      onConfirm: () => console.log(selectedIds),
    });
  };
  const handlerAllDelete = () => {
    openDialog('content', 'delete', {
      onConfirm: () => console.log(selectedIds),
    });
  };
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('keyword', keyword);
    router.push(`${pathname}?${params.toString()}`);
  };

  const columns = CONTENT_COLUMNS(handlerEdit, handlerDelete);
  return (
    <div className="flex flex-col gap-5">
      {/* 제목섹션 */}
      <div className="flex flex-col">
        <span className="title1">콘텐츠 리스트</span>
        <span className="title3 text-gray-700">
          {`총 ${data?.totalElements ?? 0}개의 콘텐츠`}
        </span>
      </div>
      {/* 검색섹션 */}
      <div className="flex justify-between">
        <Input
          leftIcon={<SearchIcon className="h-7 w-7" />}
          placeholder="제목, 설명, 카테고리로 검색"
          className="w-100 bg-white"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          onClick={() => router.push(ROUTES.NEW_CONTENT)}
          variant={'outline'}
          className="w-fit"
        >
          <Upload className="h-6 w-6" />
          콘텐츠 업로드
        </Button>
      </div>
      {/* 다중선택메뉴 */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-500 bg-white px-5 py-4">
          <span>{selectedIds.length}개 선택됨</span>
          <div className="flex gap-2">
            <Button onClick={handlerAllActive} variant={'outline'} size={'lg'}>
              <Power className="h-5 w-5" /> 활성화
            </Button>
            <Button
              onClick={handlerAllDeactivated}
              variant={'outline'}
              size={'lg'}
            >
              <Unpower className="h-5 w-5" /> 비활성화
            </Button>
            <Button onClick={handlerAllDelete} variant={'default'} size={'lg'}>
              <Delete className="h-5 w-5" /> 삭제
            </Button>
          </div>
        </div>
      )}
      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      {!isError && (
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </div>
  );
};

export default ContentListContainer;
