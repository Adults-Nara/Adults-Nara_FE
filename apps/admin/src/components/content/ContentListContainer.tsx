'use client';
import { useState } from 'react';

import { CONTENT_COLUMNS } from './contentColumns';
import { MOCK_CONTENTS } from '@/types/content';
import { DataTable } from '@components/common';
import { Button, Input, SearchIcon, Upload } from '@repo/ui';

const ContentListContainer = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handlerEdit = (id: string) => {
    console.log('수정', id, selectedIds);
  };
  const handlerdelete = (id: string) => {
    console.log('삭제', id);
  };

  const columns = CONTENT_COLUMNS(
    (id) => handlerEdit(id),
    (id) => handlerdelete(id),
  );
  return (
    <div className="relative flex flex-col gap-5">
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
        <Button variant={'outline'} className="w-fit">
          <Upload className="h-6 w-6" />
          콘텐츠 등록
        </Button>
      </div>
      {/* 다중선택메뉴 */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-12 left-0 flex items-center rounded-lg border border-gray-500 bg-white px-5 py-4">
          <span>{selectedIds.length}개 선택됨</span>
          <div className="flex gap-2">
            <Button variant={'outline'} size={'lg'}>
              활성화
            </Button>
            <Button variant={'outline'} size={'lg'}>
              비활성화
            </Button>
            <Button variant={'default'} size={'lg'}>
              삭제
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
    </div>
  );
};

export default ContentListContainer;
