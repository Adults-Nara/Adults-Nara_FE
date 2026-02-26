'use client';
import { useState } from 'react';

import { CONTENT_COLUMNS } from './contentColumns';
import { MOCK_CONTENTS } from '@/types/content';
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
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';

interface ContentListContainerProps {
  currentPage: number;
}

const ContentListContainer = ({ currentPage }: ContentListContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();
  const totalPages = 150; // 실제로는 서버에서 받아온 totalCount / limit 값으로 계산

  const handlerEdit = (id: string) => {
    router.push(ROUTES.EDITCONTENT(id));
  };
  const handlerDelete = (id: string) => {
    console.log('삭제', id);
  };

  const handlerAllActive = () => {
    console.log('선택활성화', selectedIds);
  };
  const handlerAllDeactivated = () => {
    console.log('선택비활성화', selectedIds);
  };
  const handlerAllDelete = () => {
    console.log('선택삭제', selectedIds);
  };

  const columns = CONTENT_COLUMNS(handlerEdit, handlerDelete);
  return (
    <div className="flex flex-col gap-5">
      {/* 제목섹션 */}
      <div className="flex flex-col">
        <span className="title1">콘텐츠 리스트</span>
        <span className="title3 text-gray-700">
          {`총 ${MOCK_CONTENTS.length}개의 콘텐츠`}
        </span>
      </div>
      {/* 검색섹션 */}
      <div className="flex justify-between">
        <Input
          leftIcon={<SearchIcon className="h-7 w-7" />}
          placeholder="제목, 설명, 카테고리로 검색"
          className="w-100 bg-white"
        />
        <Button
          onClick={() => router.push(ROUTES.NEWCONTENT)}
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
        data={MOCK_CONTENTS}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default ContentListContainer;
