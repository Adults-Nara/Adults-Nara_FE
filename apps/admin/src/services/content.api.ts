import {
  ContentsListResponse,
  MultipartCompleteRequest,
  MultipartInitRequest,
  MultipartInitResponse,
} from '@/models/content.model';
import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/constant/endpoints';
import { ApiResponse } from '@/types/api';

//업로드 시작
export async function apiInit(f: File) {
  console.log(f.type);
  const body: MultipartInitRequest = {
    contentType: f.type || 'video/mp4',
    sizeBytes: f.size,
  };

  const res = await httpClient<ApiResponse<MultipartInitResponse>>(
    API_ENDPOINTS.CONTENTS.INIT,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );

  return res.data;
}

//업로드 완료
export async function apiComplete(
  videoId: string,
  req: MultipartCompleteRequest,
) {
  await httpClient(API_ENDPOINTS.CONTENTS.COMPLETE(videoId), {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

//원본 동영상 나누기
export function sliceFileIntoParts(f: File, partSizeBytes: number) {
  const parts: {
    partNumber: number;
    blob: Blob;
    start: number;
    end: number;
  }[] = [];
  const total = f.size;
  let partNumber = 1;

  for (let start = 0; start < total; start += partSizeBytes) {
    const end = Math.min(start + partSizeBytes, total);
    const blob = f.slice(start, end);
    parts.push({ partNumber, blob, start, end });
    partNumber++;
  }
  return parts;
}

//eTag 정리
export function normalizeETag(etag: string | null): string {
  if (!etag) return '';
  // Some browsers include quotes, some not. Normalize.
  const t = etag.trim();
  if (t.startsWith('"') && t.endsWith('"') && t.length >= 2)
    return t.slice(1, -1);
  return t;
}

//S3로 전송(헤더옵션 예민해서 fetch로)
export async function putPart(url: string, blob: Blob): Promise<string> {
  // NOTE: For presigned UploadPart URLs, do NOT set Content-Type arbitrarily.
  // Browser will set a default; setting custom headers can cause signature mismatch.
  const res = await fetch(url, {
    method: 'PUT',
    body: blob,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`PUT part failed: ${res.status} ${text}`);
  }

  const etag = normalizeETag(res.headers.get('ETag'));
  if (!etag) {
    // ETag should be present for UploadPart responses
    throw new Error('Missing ETag header from S3 response');
  }
  return etag;
}

//병렬로 영상 업로드
export async function uploadWithConcurrency<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  limit: number,
) {
  const queue = [...items];
  const runners: Promise<void>[] = [];

  async function runOne() {
    while (queue.length > 0) {
      const item = queue.shift()!;
      await worker(item);
    }
  }

  const n = Math.max(1, Math.min(limit, items.length));
  for (let i = 0; i < n; i++) {
    runners.push(runOne());
  }

  await Promise.all(runners);
}

//메타데이터 (썸네일+기본정보) 업로드
export const ContentUpload = async (videoId: string, data: FormData) => {
  await httpClient<ApiResponse<void>>(API_ENDPOINTS.CONTENTS.UPLOAD(videoId), {
    method: 'POST',
    body: data,
  });
};

export const UploaderConentsList = async (params: {
  keyword?: string;
  page: number;
  size: number;
  sortBy: string;
  direction: 'ASC' | 'DESC';
}) => {
  const searchParams = new URLSearchParams({
    keyword: params.keyword ?? '',
    page: String(params.page),
    size: String(params.size),
    sortBy: params.sortBy,
    direction: params.direction,
  });
  const response = await httpClient<ApiResponse<ContentsListResponse>>(
    `${API_ENDPOINTS.CONTENTS.UPLOADER_CONTENTS_LIST}?${searchParams}`,
    {
      method: 'GET',
    },
  );
  return response.data;
};

export const AdminConentsList = async (params: {
  keyword?: string;
  page: number;
  size: number;
  sortBy: string;
  direction: 'ASC' | 'DESC';
}) => {
  const searchParams = new URLSearchParams({
    keyword: params.keyword ?? '',
    page: String(params.page),
    size: String(params.size),
    sortBy: params.sortBy,
    direction: params.direction,
  });
  const response = await httpClient<ApiResponse<ContentsListResponse>>(
    `${API_ENDPOINTS.CONTENTS.ADMIN_CONTENTS_LIST}?${searchParams}`,
    {
      method: 'GET',
    },
  );
  return response.data;
};
