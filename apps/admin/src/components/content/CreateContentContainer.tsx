'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { UploadRequest } from '@/models/upload.model';
import { LeftArrow } from '@repo/ui';

const CreateContentContainer = () => {
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
    // API 호출: POST /api/v1/videos/{videoId}/upload
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
      <ContentForm mode="create" onSubmit={handleCreate} />
    </div>
  );
};

export default CreateContentContainer;
