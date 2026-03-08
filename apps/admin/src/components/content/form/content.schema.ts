import { UploadRequest } from '@/models/content.model';

export const mockVideoUpload: UploadRequest = {
  videoType: 'LONG',
  visibility: 'PRIVATE',
  otherVideoUrl: '',
  thumbnailUrl: 'https://picsum.photos/200?random=1',
  title: '영상제목',
  description: '영상설명',
  tagIds: ['3001', '3002'],
};
