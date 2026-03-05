'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { UploadRequest } from '@/models/content.model';
import { LeftArrow } from '@repo/ui';
import { useContentUpload } from '@/lib/tanstack/mutation/content.mutation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routes';

const CreateContentContainer = () => {
  const router = useRouter();
  const { mutate } = useContentUpload();
  const [videoId, setVideoId] = useState('');

  const handleCreate = (data: UploadRequest, thumbnailFile: File | null) => {
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );

    if (thumbnailFile) {
      formData.append('image', thumbnailFile);
    }

    console.log('최종 전송할 데이터:', data);
    console.log('첨부된 파일:', thumbnailFile);
    console.log(formData, 'FormData 준비 완료');

    mutate(
      { videoId: videoId, data: formData },
      {
        onSuccess: () => {
          //TODO: 추후업로드성공 토스트
          console.log('업로드성공');
          router.push(ROUTES.CONTENT);
        },
        onError: (error) => {
          //TODO: 추후 토스트로 변경
          console.log(error.message);
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
        onSubmit={handleCreate}
        setVideoId={setVideoId}
      />
    </div>
  );
};

export default CreateContentContainer;
