'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { UploadRequest } from '@/models/content.model';
import { Button, LeftArrow, Spinner } from '@repo/ui';
import { useContentDetail } from '@/lib/tanstack/query/content.query';
import {
  useContentDelete,
  useContentEdit,
} from '@/lib/tanstack/mutation/content.mutation';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';
import { toast } from '@/lib/toast';
import { confirm } from '@/lib/confirm';

interface EditContentContainerProps {
  videoId: string;
}

const EditContentContainer = ({ videoId }: EditContentContainerProps) => {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useContentDetail(videoId);

  const { mutate: editMutate, isPending: isEditPending } = useContentEdit();
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
          toast.success('영상 수정을 완료하였습니다.');
          router.push(ROUTES.CONTENT);
        },
        onError: () => {
          toast.error('영상 수정중 오류가 발생하였습니다.');
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirm('영상을 삭제하시겠습니까?', '삭제');

    if (!ok) return;

    deleteMutate(
      { videoIds: [videoId] },
      {
        onSuccess: () => {
          toast.success('영상 삭제을 완료하였습니다.');
          router.push(ROUTES.CONTENT);
        },
        onError: () => {
          toast.error('영상 삭제중 오류가 발생하였습니다.');
        },
      },
    );
  };

  if (isPending)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size={70} />
      </div>
    );
  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="body2 text-primary-500">
          비디오 정보을 불러오지 못했습니다.
        </span>
        <Button type="button" className="w-30" onClick={() => refetch()}>
          재시도
        </Button>
      </div>
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
        isPending={isEditPending}
      />
    </div>
  );
};

export default EditContentContainer;
