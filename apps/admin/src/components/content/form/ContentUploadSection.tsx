'use client';
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

const ContentUploadSection = ({
  isEdit,
  setThumbnailFile,
  initialThumbnail = null,
  setVideoId,
}: ContentUploadSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialThumbnail);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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

    // 파일 용량 제한 (예: 5MB) 나중에 체크
    // if (file.size > 5 * 1024 * 1024) {
    //   alert('파일 크기는 5MB를 초과할 수 없습니다.');
    //   return;
    // }

    setThumbnailFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  //비디오파일 선택시
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected) setVideoFile(selected);

    try {
      const init = await apiInit(selected);

      // local slicing based on partSizeBytes returned by server
      const localParts = sliceFileIntoParts(selected, init.partSizeBytes);

      // sanity check: server-provided part count should match our calculated one
      if (init.presignedParts.length !== localParts.length) {
        console.log(
          `WARN: part count mismatch (server=${init.presignedParts.length}, local=${localParts.length}). Using local count.`,
        );
      }

      // Map partNumber -> presigned URL
      const urlByPartNumber = new Map<number, string>();
      for (const p of init.presignedParts)
        urlByPartNumber.set(p.partNumber, p.url);

      // Collect completed parts (partNumber, etag)
      const completed: { partNumber: number; eTag: string }[] = [];

      // setPhase('UPLOADING');

      // progress updates
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
          // Optional: small jitter to reduce bursts

          // await sleep(30);

          const etag = await putPart(url, lp.blob);

          completed.push({ partNumber: lp.partNumber, eTag: etag });

          uploadedBytes[lp.partNumber - 1] = lp.end - lp.start;
          const sum = uploadedBytes.reduce((a: number, b: number) => a + b, 0);
          // setProgress({ uploaded: sum, total: file.size });

          console.log(`PUT part ${lp.partNumber} ok, ETag=${etag}`);
        },
        3, //병렬로 몇개씩보낼지 설정
      );

      // sort parts by partNumber for complete
      completed.sort((a, b) => a.partNumber - b.partNumber);

      // setPhase('COMPLETING');
      console.log(`complete start: parts=${completed.length}`);

      const completeReq: MultipartCompleteRequest = {
        uploadId: init.uploadId,
        sizeBytes: selected.size,
        parts: completed,
      };

      await apiComplete(init.videoId, completeReq);

      if (setVideoId) setVideoId(init.videoId);

      console.log(`complete ok: videoId=${init.videoId}`);
      // setPhase('DONE');
    } catch (e: any) {
      // setError(e?.message ?? 'Unknown error');
      // setPhase('ERROR');
      console.log(`ERROR: ${e?.message ?? e}`);
    }
  };
  return (
    <div className="flex w-full gap-2">
      <div className="flex h-65 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
        <span className="title2">영상 파일</span>
        {/* TODO:추후 영상업로드 로직 추가예정 */}
        <label className="body2 flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-500 bg-gray-100 text-gray-700">
          {isEdit ? (
            '수정불가'
          ) : (
            <>
              {videoFile ? (
                <video
                  // src={URL.createObjectURL(videoFile)}
                  src={videoPreviewUrl ?? undefined}
                  className="w-full rounded-lg"
                />
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
              />
            </>
          )}
        </label>
      </div>
      <div className="flex h-65 w-full flex-col gap-3 rounded-lg border border-gray-500 bg-white px-6 py-4">
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
