'use client';
import { useState } from 'react';
import { DataTable, Pagination } from '@components/common';
import { USER_COLUMNS } from '@components/user';
import { Button, Delete, Input, SearchIcon, UserCheck, UserX } from '@repo/ui';
import { useDialogStore } from '@/store/useDialogStore';
import { useUsersList } from '@/lib/tanstack/query/users.query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useUsersDelete,
  useUsersStatusUpdate,
} from '@/lib/tanstack/mutation/users.mutation';
import { UserBanStatus, UsersStatusRequest } from '@/models/users.model';

interface UsersListContainerProps {
  currentPage: number;
  currentKeyword: string;
  type: 'VIEWER' | 'UPLOADER';
}

const UsersListContainer = ({
  currentPage,
  currentKeyword,
  type,
}: UsersListContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState(currentKeyword);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openDialog } = useDialogStore();
  const title = type === 'VIEWER' ? '사용자 리스트' : '업로더 리스트';
  const label = type === 'VIEWER' ? '사용자' : '업로더';

  const safePage = Math.max(1, currentPage || 1);
  const { data, isLoading, isError } = useUsersList({
    userRole: type,
    page: safePage,
    keyword: currentKeyword,
  });
  const totalPages = data?.totalPages ?? 0;

  const { mutate: statusMutate } = useUsersStatusUpdate();
  const { mutate: deleteMutate } = useUsersDelete();

  //유저 상태관리 함수
  const updateUserStatus = (
    userIds: string[],
    status: UserBanStatus,
    reason: string,
  ) => {
    const payload: UsersStatusRequest = {
      userIds,
      banStatus: status,
      banReason: reason,
    };

    statusMutate(payload, {
      onSuccess: () => {
        //TODO:추후 토스트추가
        if (status == 'ACTIVE') {
          console.log('활성화 성공', userIds, status);
        } else {
          console.log('비활성화 성공', userIds);
        }
      },
      onError: (error) => {
        //TODO:추후 토스트추가
        console.error(error.message);
      },
    });
  };

  const handlerActive = (id: string, name: string) => {
    openDialog(type, 'activate', {
      name,
      onConfirm: () => {
        updateUserStatus([id], 'ACTIVE', '');
      },
    });
  };
  const handlerDeactivated = (id: string, name: string) => {
    openDialog(type, 'deactivate', {
      name,
      onConfirm: (text, period) => {
        if (!id || !period) {
          //TODO: 추후 토스트 추가
          console.error('비활성화 오류 id,period 없음');
          return;
        }
        //TODO:추후 토스트추가
        console.log('비활성화', text, id, period);
        updateUserStatus([id], period, text ?? '관리자가 차단하였습니다.');
      },
    });
  };
  const handlerReason = (reason: string | undefined, name: string) => {
    openDialog(type, 'reason', {
      name,
      reason,
    });
  };

  const handlerAllActive = () => {
    openDialog(type, 'activate', {
      onConfirm: () => {
        updateUserStatus(selectedIds, 'ACTIVE', '');
      },
    });
  };
  const handlerAllDeactivated = () => {
    openDialog(type, 'deactivate', {
      onConfirm: (text, period) => {
        if (!period) {
          //TODO: 추후 토스트 추가
          console.error('비활성화 오류 id,period 없음');
          return;
        }
        updateUserStatus(
          selectedIds,
          period,
          text ?? '관리자가 차단하였습니다.',
        );
      },
    });
  };
  const handlerAllDelete = () => {
    openDialog(type, 'delete', {
      onConfirm: () => console.log(selectedIds),
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('keyword', keyword);
    router.push(`${pathname}?${params.toString()}`);
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
          {`총 ${data?.totalElements ?? 0}명의 ${label}`}
        </span>
      </div>
      {/* 검색섹션 */}

      <Input
        leftIcon={<SearchIcon className="h-7 w-7" />}
        placeholder="닉네임, 이메일로 검색"
        className="w-100 bg-white"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
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
        data={data?.content ?? []}
        getRowId={(row) => row.userId}
        isLoading={isLoading}
        isError={isError}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />
      <Pagination totalPages={totalPages} currentPage={safePage} />
    </div>
  );
};

export default UsersListContainer;
