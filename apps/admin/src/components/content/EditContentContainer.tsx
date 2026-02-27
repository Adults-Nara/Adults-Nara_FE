'use client';
import Link from 'next/link';
import ContentForm from './form/ContentForm';
import { ContentFormValues, mockVideoUpload } from './form/content.schema';
import { LeftArrow } from '@repo/ui';

interface EditContentContainerProps {
  videoId: string;
}

const EditContentContainer = ({ videoId }: EditContentContainerProps) => {
  const handleEdit = (data: ContentFormValues, thumbnailFile: File | null) => {
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
    // API 호출: PUT /api/v1/backoffice/contents/{videoId}
  };

  const handleDelete = () => {
    //api연동필요
    console.log('컨텐츠삭제', videoId);
  };

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
        //api연동 필요
        defaultValues={mockVideoUpload}
        onDelete={handleDelete}
        onSubmit={handleEdit}
      />
    </div>
  );
};

export default EditContentContainer;
