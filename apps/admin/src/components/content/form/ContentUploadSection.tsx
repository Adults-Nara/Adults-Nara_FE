'use client';
import { toast } from '@/lib/toast';
import { MultipartCompleteRequest } from '@/models/content.model';
import {
  apiComplete,
  apiInit,
  putPart,
  sliceFileIntoParts,
  uploadWithConcurrency,
} from '@/services/content.api';
import { ImagesIcon, Upload } from '@repo/ui';
import { useEffect, useState } from 'react';

interface ContentUploadSectionProps {
  setThumbnailFile: (file: File) => void;
  isEdit: boolean;
  initialThumbnail?: string | null;
  setVideoId?: (videoId: string) => void;
}

const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
    <div
      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${percent}%` }}
    ></div>
  </div>
);

const ContentUploadSection = ({
  isEdit,
  setThumbnailFile,
  initialThumbnail = null,
  setVideoId,
}: ContentUploadSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialThumbnail);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 마운트시 섬네일임시URL 클린업
  useEffect(() => {
    return () => {
      if (previewUrl && !initialThumbnail?.startsWith(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialThumbnail]);

  //비디오 임시URL 클린업
  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  // 썸네일파일 선택 시 실행될 함수
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

    if (file.size > 10 * 1024 * 1024) {
      toast.error('썸네일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    setThumbnailFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  //비디오파일 선택시
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected) setVideoFile(selected);

    try {
      //---  업로드 시작 상태 설정 ---
      setIsUploading(true);
      setUploadProgress(0);

      const init = await apiInit(selected);
      const localParts = sliceFileIntoParts(selected, init.partSizeBytes);
      if (init.presignedParts.length !== localParts.length) {
        console.log(
          `WARN: part count mismatch (server=${init.presignedParts.length}, local=${localParts.length}). Using local count.`,
        );
      }

      // Map partNumber -> presigned URL
      const urlByPartNumber = new Map<number, string>();
      for (const p of init.presignedParts)
        urlByPartNumber.set(p.partNumber, p.url);

      const completed: { partNumber: number; eTag: string }[] = [];

      const uploadedBytes = new Array(localParts.length).fill(0);

      await uploadWithConcurrency(
        localParts,
        async (lp) => {
          const url = urlByPartNumber.get(lp.partNumber);
          if (!url)
            throw new Error(
              `Missing presigned url for partNumber=${lp.partNumber}`,
            );

          console.log(
            `PUT part ${lp.partNumber} start (${lp.end - lp.start} bytes)`,
          );

          const etag = await putPart(url, lp.blob);

          completed.push({ partNumber: lp.partNumber, eTag: etag });

          uploadedBytes[lp.partNumber - 1] = lp.end - lp.start;
          const sum = uploadedBytes.reduce((a: number, b: number) => a + b, 0);
          const percent = Math.round((sum / selected.size) * 100);
          setUploadProgress(percent);
        },
        3, //병렬로 몇개씩보낼지 설정
      );

      // sort parts by partNumber for complete
      completed.sort((a, b) => a.partNumber - b.partNumber);

      const completeReq: MultipartCompleteRequest = {
        uploadId: init.uploadId,
        sizeBytes: selected.size,
        parts: completed,
      };

      await apiComplete(init.videoId, completeReq);

      if (setVideoId) setVideoId(init.videoId);

      setUploadProgress(100);
      toast.success('원본 영상 업로드 완료');
    } catch (e: any) {
      toast.error('원본영상 업로드중 오류 발생');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="flex w-full gap-2">
      <div className="flex h-65 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">영상 파일</span>
        <label className="body2 relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
          {isEdit ? (
            '수정불가'
          ) : (
            <>
              {videoFile ? (
                <div className="relative h-full w-full">
                  <video
                    src={videoPreviewUrl ?? undefined}
                    className="h-full w-full object-cover"
                    controls={!isUploading}
                  />
                  {/* ---  업로드 중일 때 진행률 표시 --- */}
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4 text-center">
                      <span className="body3 mb-2 text-white">
                        {uploadProgress}% 업로드 중...
                      </span>
                      <ProgressBar percent={uploadProgress} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-7 w-7" />
                  <span>클릭하여 영상 업로드</span>
                </>
              )}
              <input
                style={{ display: 'none' }}
                type="file"
                accept="video/*"
                onChange={handleChange}
                disabled={isUploading}
              />
            </>
          )}
        </label>
      </div>
      <div className="flex h-65 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">썸네일</span>
        <label className="body2 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
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
