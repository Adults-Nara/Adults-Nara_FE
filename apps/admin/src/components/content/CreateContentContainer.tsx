'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { UploadRequest } from '@/models/content.model';
import { LeftArrow } from '@repo/ui';
import { useContentUpload } from '@/lib/tanstack/mutation/content.mutation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';
import { toast } from '@/lib/toast';

const CreateContentContainer = () => {
  const router = useRouter();
  const { mutate, isPending } = useContentUpload();
  const [videoId, setVideoId] = useState('');

  const handleCreate = (data: UploadRequest, thumbnailFile: File | null) => {
    if (!videoId) {
      toast.error('원본 영상 업로드 완료 후 저장해주세요.');
      return;
    }
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    }

    mutate(
      { videoId: videoId, data: formData },
      {
        onSuccess: () => {
          toast.success('영상 업로드를 완료하였습니다.');
          router.push(ROUTES.CONTENT);
        },
        onError: () => {
          toast.error('영상 업로드중 오류가 발생하였습니다.');
        },
      },
    );
  };
  return (
    <div className="flex w-full flex-col gap-3 px-9 py-5">
      {/* 헤더 섹션 */}
      <div className="flex items-center gap-3">
        <Link href="/content" className="cursor-pointer">
          <LeftArrow className="h-6 w-7" />
        </Link>
        <span className="title1">콘텐츠 등록</span>
      </div>
      <ContentForm
        mode="create"
        isPending={isPending}
        onSubmit={handleCreate}
        setVideoId={setVideoId}
      />
    </div>
  );
};

export default CreateContentContainer;
