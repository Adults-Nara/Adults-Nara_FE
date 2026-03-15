import z from 'zod';

export const CONTENT_TYPE_OPTIONS = [
  { label: '숏폼', value: 'SHORT' },
  { label: '롱폼', value: 'LONG' },
  // { label: '광고', value: 'AD' },
] as const;

export const contentSchema = z.object({
  videoType: z.enum(['SHORT', 'LONG', 'AD']),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  otherVideoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  title: z.string().min(1, '영상 제목을 입력해주세요'),
  description: z.string().min(1, '영상 설명을 입력해주세요'),
  tagIds: z
    .array(z.string())
    .min(1, '카테고리를 최소 1개 선택해주세요')
    .max(3, '카테고리는 최대 3개까지 선택 가능합니다'),
});

export type UploadRequest = z.infer<typeof contentSchema>;

export interface MultipartInitRequest {
  contentType: string;
  sizeBytes: number;
}

export interface MultipartInitResponse {
  videoId: string;
  objectKey: string;
  uploadId: string;
  partSizeBytes: number;
  expiresAtEpochSeconds: number;
  presignedParts: { partNumber: number; url: string }[];
}

export interface MultipartCompleteRequest {
  uploadId: string;
  sizeBytes: number;
  parts: { partNumber: number; eTag: string }[];
}

export type ProcessingStatus =
  | 'UPLOADED' //원본영상 업로드 완료
  | 'TRANSCODING' //트랜스코딩중
  | 'READY' // 영상 준비 완료 (트랜스코딩완료)
  | 'FAILED'; // 트랜스코딩 실패

export interface ContentItem {
  videoId: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  otherVideoUrl: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  visibility: 'PRIVATE' | 'PUBLIC';
  createdAt: string;
  processingStatus: ProcessingStatus;
}

export interface ContentsListResponse {
  content: ContentItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ContentsStatusRequest {
  videoIds: string[];
  visibility: 'PRIVATE' | 'PUBLIC';
}

export interface ContentDetailResponses {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  tagIds: string[];
  createdAt: string;
  otherVideoUrl: string;
  videoType: 'SHORT' | 'LONG' | 'AD';
}
