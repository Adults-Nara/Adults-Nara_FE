'use client';
import { useState } from 'react';

import { mockUsers } from '@/types/content';
import { DataTable, Pagination } from '@components/common';
import { USER_COLUMNS } from '@components/user';
import { Button, Delete, Input, SearchIcon, UserCheck, UserX } from '@repo/ui';

interface UsersListContainerProps {
  currentPage: number;
  type: 'user' | 'uploader';
}

const UsersListContainer = ({ currentPage, type }: UsersListContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const totalPages = 150; // api연동 필요 없으면 삭제해야됨
  const title = type === 'user' ? '사용자 리스트' : '업로더 리스트';
  const label = type === 'user' ? '사용자' : '업로더';

  const handlerActive = (id: string) => {
    console.log('활성화', id);
  };
  const handlerDeactivated = (id: string) => {
    console.log('비활성화', id);
  };
  const handlerReason = (reason: string | undefined) => {
    console.log('사유', reason);
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

  const columns = USER_COLUMNS(
    handlerActive,
    handlerDeactivated,
    handlerReason,
  );
  return (
    <div className="flex flex-col gap-5">
      {/* 제목섹션 */}
      <div className="flex flex-col">
        <span className="title1">{title}</span>
        <span className="title3 text-gray-700">
          {`총 ${mockUsers.length}명의 ${label}`}
        </span>
      </div>
      {/* 검색섹션 */}

      <Input
        leftIcon={<SearchIcon className="h-7 w-7" />}
        placeholder="닉네임, 이메일로 검색"
        className="w-100 bg-white"
      />

      {/* 다중선택메뉴 */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-500 bg-white px-5 py-4">
          <span>{selectedIds.length}개 선택됨</span>
          <div className="flex gap-2">
            <Button onClick={handlerAllActive} variant={'outline'} size={'lg'}>
              <UserCheck className="h-5 w-5" /> 활성화
            </Button>
            <Button
              onClick={handlerAllDeactivated}
              variant={'outline'}
              size={'lg'}
            >
              <UserX className="h-5 w-5" /> 비활성화
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
        data={mockUsers}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default UsersListContainer;
