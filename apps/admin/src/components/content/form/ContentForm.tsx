'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { UploadRequest, contentSchema } from '@/models/upload.model';
import { zodResolver } from '@hookform/resolvers/zod';
import ContentInfoSection from './ContentInfoSection';
import ContentCategorySection from './ContentCategorySection';
import ContentUploadSection from './ContentUploadSection';
import { useState } from 'react';
import { Button, Delete, Upload } from '@repo/ui';

interface ContentFormProps {
  mode: 'create' | 'edit';
  defaultValues?: UploadRequest;
  onSubmit: (data: UploadRequest, thumbnail: File | null) => void;
  onDelete?: () => void;
  setVideoId?: (videoId: string) => void;
}
const ContentForm = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
  setVideoId,
}: ContentFormProps) => {
  // 썸네일 파일 상태 (실제 파일 객체)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const methods = useForm<UploadRequest>({
    resolver: zodResolver(contentSchema),
    defaultValues: defaultValues ?? {
      videoType: 'SHORT',
      visibility: 'PUBLIC',
      tagIds: [],
      otherVideoUrl: '',
      title: '',
      description: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const isEdit = mode === 'edit';
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit(data, thumbnailFile))}
      >
        <div className="mx-auto flex w-250 min-w-250 flex-col gap-2">
          {/* Upload Section */}
          <ContentUploadSection
            setThumbnailFile={setThumbnailFile}
            initialThumbnail={defaultValues?.thumbnailUrl}
            setVideoId={setVideoId}
            isEdit={isEdit}
          />

          <div className="custom-scrollbar flex h-fit w-full flex-col gap-2 overflow-y-auto rounded-lg border border-gray-500 bg-white px-6 py-4">
            <div className="flex h-full gap-3">
              <ContentInfoSection isEdit={isEdit} />

              <ContentCategorySection />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {isEdit && (
              <Button
                type="button"
                onClick={onDelete}
                variant="default"
                className="flex w-fit items-center gap-2"
              >
                <Delete />
                삭제
              </Button>
            )}
            <Button
              type="submit"
              variant="outline"
              className="flex w-fit items-center gap-2"
            >
              <Upload className="h-6 w-6" />
              {isEdit ? '콘텐츠 수정' : '콘텐츠 업로드'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContentForm;
