'use client';

import { FormProvider, useForm } from 'react-hook-form';
import {
  ContentDetailResponses,
  UploadRequest,
  contentSchema,
} from '@/models/content.model';
import { zodResolver } from '@hookform/resolvers/zod';
import ContentInfoSection from './ContentInfoSection';
import ContentCategorySection from './ContentCategorySection';
import ContentUploadSection from './ContentUploadSection';
import { useState } from 'react';
import { Button, Delete, Upload } from '@repo/ui';
import { Loader2 } from 'lucide-react';

interface ContentFormProps {
  mode: 'create' | 'edit';
  defaultValues?: ContentDetailResponses;
  onSubmit: (data: UploadRequest, thumbnail: File | null) => void;
  onDelete?: () => void;
  setVideoId?: (videoId: string) => void;
  isPending?: boolean;
  isDeletePending?: boolean;
}
const ContentForm = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
  setVideoId,
  isPending,
  isDeletePending,
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
                {isDeletePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Delete />
                )}
                {isDeletePending ? '삭제중...' : '삭제'}
              </Button>
            )}
            <Button
              type="submit"
              variant="outline"
              disabled={isPending}
              className="flex w-fit items-center gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-6 w-6" />
              )}

              {isPending
                ? '업로드중...'
                : isEdit
                  ? '콘텐츠 수정'
                  : '콘텐츠 업로드'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContentForm;
