'use client';
import { ToggleSwitch } from '@/components/common';
import { Chip, cn, Input, Textarea } from '@repo/ui';
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { CONTENT_TYPE_OPTIONS, UploadRequest } from '@/models/upload.model';

interface ContentInfoSectionProps {
  isEdit: boolean;
}

const ContentInfoSection = ({ isEdit }: ContentInfoSectionProps) => {
  const { control, register } = useFormContext<UploadRequest>();

  const { errors } = useFormState({
    control,
  });

  const currentContentType = useWatch({
    control,
    name: 'videoType',
  });

  return (
    <div className="flex w-full flex-col gap-3 px-2">
      <div className="flex gap-6">
        {/* 콘텐츠 유형 (Controller 사용)  */}
        <div
          className={cn(
            'flex flex-col gap-2',
            isEdit && 'pointer-events-none opacity-50',
          )}
        >
          <span className="body2 text-gray-900">콘텐츠 유형</span>
          <Controller
            name="videoType"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {CONTENT_TYPE_OPTIONS.map((option) => (
                  <Chip
                    key={option.value}
                    size="lg"
                    selected={field.value === option.value}
                    onClick={() => !isEdit && field.onChange(option.value)}
                    tabIndex={isEdit ? -1 : 0}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </div>
        {/* 콘텐츠 상태 (ToggleSwitch 연결) */}
        <div className="flex flex-col gap-4">
          <span className="body2 text-gray-900">콘텐츠 상태</span>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                enabled={field.value === 'PUBLIC'}
                onChange={(enabled) =>
                  field.onChange(enabled ? 'PUBLIC' : 'PRIVATE')
                }
                label={field.value === 'PUBLIC' ? '활성화' : '비활성화'}
              />
            )}
          />
        </div>
      </div>

      {/* 일반 입력 필드들 (register 사용) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="body2 text-gray-900">영상 연동</span>
          <Input
            disabled={currentContentType !== 'SHORT'}
            {...register('otherVideoUrl')}
            placeholder="연동하실 롱폼 영상주소"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="body2 text-gray-900">영상 제목</span>
          <Input
            {...register('title')}
            placeholder="영상 제목을 입력해주세요"
            error={!!errors.title}
            errorMessage={errors.title?.message}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="body2 text-gray-900">영상 설명</span>
          <Textarea
            {...register('description')}
            placeholder="영상 설명을 입력해주세요"
            error={!!errors.description}
            errorMessage={errors.description?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentInfoSection;
