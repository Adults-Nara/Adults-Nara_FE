'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { UploadRequest } from '@/models/content.model';
import { LeftArrow } from '@repo/ui';
import { useContentDetail } from '@/lib/tanstack/query/content.query';
import {
  useContentDelete,
  useContentEdit,
} from '@/lib/tanstack/mutation/content.mutation';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';
import { useDialogStore } from '@/store/useDialogStore';

interface EditContentContainerProps {
  videoId: string;
}

const EditContentContainer = ({ videoId }: EditContentContainerProps) => {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useContentDetail(videoId);
  const { openDialog } = useDialogStore();

  const { mutate: editMutate } = useContentEdit();
  const { mutate: deleteMutate } = useContentDelete();

  const handleEdit = (data: UploadRequest, thumbnailFile: File | null) => {
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    }

    editMutate(
      { videoId: videoId, data: formData },
      {
        onSuccess: () => {
          //TODO: 토스트 변경
          console.log('업로드 성공');
          router.push(ROUTES.CONTENT);
        },
        onError: (error) => {
          //TODO: 토스트 변경
          console.error(error.message);
        },
      },
    );
  };

  const handleDelete = () => {
    openDialog('content', 'delete', {
      onConfirm: () =>
        deleteMutate(
          { videoIds: [videoId] },
          {
            onSuccess: () => {
              //TODO: 토스트 변경
              console.log('삭제 성공');
              router.push(ROUTES.CONTENT);
            },
            onError: (error) => {
              //TODO: 토스트 변경
              console.error(error.message);
            },
          },
        ),
    });
  };

  //TODO: 로딩에러화면 추후 보강
  if (isPending) return <span>비디오 풀러오는중</span>;
  if (isError) {
    return (
      <>
        <span>비디오 정보 불러오는데 에러</span>
        <button type="button" onClick={() => refetch()}>
          refetch 재시도
        </button>
      </>
    );
  }
  return (
    <div className="flex w-full flex-col gap-3 px-9 py-5">
      {/* 헤더 섹션 */}
      <div className="flex items-center gap-3">
        <Link href="/content" className="cursor-pointer">
          <LeftArrow className="h-6 w-7" />
        </Link>
        <span className="title1">콘텐츠 수정</span>
      </div>
      <ContentForm
        mode="edit"
        defaultValues={data}
        onDelete={handleDelete}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default EditContentContainer;
