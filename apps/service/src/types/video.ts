export interface VideoData {
  id: string;
  videoUrl: string;
  thumbnail: string;
  uploader: { name: string; profileImg: string | null };
  title: string;
  likes: number;
  dislikes: number;
  comments: number;
  bookmarked: boolean;
  longformUrl: string;
}
