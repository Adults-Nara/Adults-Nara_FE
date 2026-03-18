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
import {
  useContentDelete,
  useContentStatusUpload,
} from '@/lib/tanstack/mutation/content.mutation';
import { toast } from '@/lib/toast';

interface ContentListContainerProps {
  currentPage: number;
  currentKeyword: string;
}

const ContentListContainer = ({
  currentPage,
  currentKeyword,
}: ContentListContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState(currentKeyword);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openDialog } = useDialogStore();
  const role = useAuthStore((state) => state.role);

  const { mutate: statusMutate } = useContentStatusUpload();
  const { mutate: deleteMutate } = useContentDelete();

  //음수체크
  const safePage = Math.max(1, currentPage || 1);
  const { data, isLoading, isError } = useContentsList(role, {
    page: safePage,
    keyword: currentKeyword,
  });
  const totalPages = data?.totalPages ?? 0;

  const createMutationCallbacks = (successMessage: string) => ({
    onSuccess: () => {
      toast.success(successMessage);
      setSelectedIds([]);
    },
    onError: () => {
      toast.error('작업을 실패하였습니다.');
    },
  });

  const handlerEdit = (id: string) => {
    router.push(ROUTES.EDIT_CONTENT(id));
  };
  const handlerDelete = (id: string) => {
    openDialog('content', 'delete', {
      onConfirm: () =>
        deleteMutate(
          { videoIds: [id] },
          createMutationCallbacks(`영상 삭제 성공`),
        ),
    });
  };

  const handlerAllActive = () => {
    openDialog('content', 'activate', {
      onConfirm: () =>
        statusMutate(
          { videoIds: selectedIds, visibility: 'PUBLIC' },
          createMutationCallbacks(`영상 활성화 성공`),
        ),
    });
  };
  const handlerAllDeactivated = () => {
    openDialog('content', 'deactivate', {
      onConfirm: () =>
        statusMutate(
          { videoIds: selectedIds, visibility: 'PRIVATE' },
          createMutationCallbacks(`영상 비활성화 성공`),
        ),
    });
  };
  const handlerAllDelete = () => {
    openDialog('content', 'delete', {
      onConfirm: () =>
        deleteMutate(
          { videoIds: selectedIds },
          createMutationCallbacks(`영상 다중삭제 성공`),
        ),
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
              <Unpower className="h-5 w-5" /> 활성화
            </Button>
            <Button
              onClick={handlerAllDeactivated}
              variant={'outline'}
              size={'lg'}
            >
              <Power className="h-5 w-5" />
              비활성화
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
        getRowId={(row) => row.videoId}
        isLoading={isLoading}
        isError={isError}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      {!isError && (
        <Pagination totalPages={totalPages} currentPage={safePage} />
      )}
    </div>
  );
};

export default ContentListContainer;
