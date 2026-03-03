import z from 'zod';

export const CONTENT_TYPE_OPTIONS = [
  { label: '숏폼', value: 'SHORT' },
  { label: '롱폼', value: 'LONG' },
  { label: '광고', value: 'AD' },
] as const;

export const contentSchema = z.object({
  contentType: z.enum(['SHORT', 'LONG', 'AD']),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  videoLink: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  title: z.string().min(1, '영상 제목을 입력해주세요'),
  description: z.string().min(1, '영상 설명을 입력해주세요'),
  categories: z
    .array(z.string())
    .min(1, '카테고리를 최소 1개 선택해주세요')
    .max(3, '카테고리는 최대 3개까지 선택 가능합니다'),
});

export type ContentFormValues = z.infer<typeof contentSchema>;

export const mockVideoUpload: ContentFormValues = {
  contentType: 'LONG',
  visibility: 'PRIVATE',
  videoLink: '',
  thumbnailUrl: 'https://picsum.photos/200?random=1',
  title: '영상제목',
  description: '영상설명',
  categories: ['yoga', 'ai'],
};
