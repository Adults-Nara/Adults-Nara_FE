import { VideoData } from '@/types/video';
import {
  LikeFill,
  Like,
  DislikeFill,
  Dislike,
  BookmarkFill,
  Bookmark,
  Comment,
  Button,
} from '@repo/ui';
import { useEffect, useRef, useState } from 'react';

interface ShortCardProps {
  data: VideoData;
  isActive: boolean;
}

export function ShortCard({ data, isActive }: ShortCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(data.bookmarked);
  const [paused, setPaused] = useState(false);

  // isActive이 변경될 때마다 비디오 재생/일시정지 처리
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 자동재생 실패 시 muted 상태에서 재시도
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
      setPaused(false);
    } else {
      vid.pause();
    }
  }, [isActive]);

  // 비디오 클릭 시 재생/일시정지 토글
  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  /* TODO : 반응 */
  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="relative h-full min-w-full shrink-0 snap-start snap-always overflow-hidden bg-black text-white">
      {/* 비디오 재생 */}
      <video
        ref={videoRef}
        src={data.videoUrl}
        poster={data.thumbnail || undefined}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
        onClick={togglePlay}
      />

      {/* Gradient overlay at bottom */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[20%] bg-linear-to-t from-black/50 via-black/20 to-transparent" />

      {/* Pause indicator */}
      {paused && (
        <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center bg-black/15">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.8)"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      )}

      {/* Right action buttons */}
      <div className="absolute right-3 bottom-[20%] z-10 flex flex-col items-center gap-6 text-[28px] drop-shadow-sm">
        <button onClick={handleLike}>{liked ? <LikeFill /> : <Like />}</button>
        <button onClick={handleDislike}>
          {disliked ? <DislikeFill /> : <Dislike />}
        </button>
        <button onClick={() => setBookmarked(!bookmarked)}>
          {bookmarked ? <BookmarkFill /> : <Bookmark />}
        </button>
        <button className="flex flex-col items-center gap-1 border-none">
          <Comment />
          <span className="body4 font-medium">{data.comments}</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute right-0 bottom-0 left-0 z-10 p-4">
        {/* 업로더 정보 */}
        <div className="mb-2 flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
            {data.uploader.profileImg ? (
              <img
                src={data.uploader.profileImg}
                className="h-full w-full object-cover"
                alt=""
              />
            ) : (
              <div className="bg-primary-100 h-full w-full rounded-full" />
            )}
          </div>
          <span className="title3">{data.uploader.name}</span>
        </div>
        {/* 영상 제목 및 시청 버튼 */}
        <p className="title3 mb-3">{data.title}</p>

        {data.longformUrl !== '' && (
          <Button
            size={null}
            className="title3 h-12.5 w-full bg-white/70 px-5 text-black"
          >
            해당영상 시청하기
          </Button>
        )}
      </div>
    </div>
  );
}
