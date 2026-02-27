'use client';
import { ImagesIcon, Upload } from '@repo/ui';
import { useEffect, useState } from 'react';

interface ContentUploadSectionProps {
  setThumbnailFile: (file: File) => void;
  isEdit: boolean;
  initialThumbnail?: string | null;
}

const ContentUploadSection = ({
  isEdit,
  setThumbnailFile,
  initialThumbnail = null,
}: ContentUploadSectionProps) => {
  // 미리보기용 URL 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialThumbnail);

  // 마운트시 임시URL 클린업
  useEffect(() => {
    return () => {
      if (previewUrl && !initialThumbnail?.startsWith(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialThumbnail]);

  // 파일 선택 시 실행될 함수
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 허용할 확장자 목록
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    // 파일 용량 제한 (예: 5MB) 나중에 체크
    // if (file.size > 5 * 1024 * 1024) {
    //   alert('파일 크기는 5MB를 초과할 수 없습니다.');
    //   return;
    // }

    setThumbnailFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  return (
    <div className="flex w-full gap-2">
      <div className="flex h-70 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">영상 파일</span>
        {/* TODO:추후 영상업로드 로직 추가예정 */}
        <div className="body2 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
          {isEdit ? (
            '수정불가'
          ) : (
            <>
              <Upload className="h-7 w-7" />
              <span>클릭하여 영상 업로드</span>
            </>
          )}
        </div>
      </div>
      <div className="flex h-70 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">썸네일</span>
        <label className="body2 flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <ImagesIcon className="h-6 w-6" />
              클릭하여 썸네일 업로드
            </>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleThumbnailChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ContentUploadSection;
