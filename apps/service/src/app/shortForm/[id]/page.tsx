'use client';

import {
  Bookmark,
  BookmarkFill,
  Comment,
  Dislike,
  DislikeFill,
  Flag,
  Like,
  LikeFill,
  SearchIcon,
} from '@repo/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoData } from '../../../types/video';

// --- Mock Data ---
const ALGORITHM_VIDEOS = fetchAlgorithmVideo();

function fetchAlgorithmVideo(): VideoData[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `s${i}`,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '',
    uploader: {
      name: `user_${i + 1}`,
      profileImg: null,
    },
    title: `알고리즘 추천 영상 ${i + 1}`,
    likes: (i + 1) * 100,
    dislikes: (i + 1) * 5,
    comments: (i + 1) * 20,
    bookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

function fetchRelatedVideos(sourceVideo: VideoData): VideoData[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${sourceVideo.id}-rel-${i}`,
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '',
    uploader: {
      name: `related_${i + 1}`,
      profileImg: null,
    },
    title: `${sourceVideo.title} 관련 ${i + 1}`,
    likes: (i + 1) * 80,
    dislikes: (i + 1) * 3,
    comments: (i + 1) * 15,
    bookmarked: false,
    longformUrl: i % 2 === 0 ? `/watch/rel-${i}` : '',
  }));
}

// --- Utility ---
function formatCount(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return String(n);
}

// =============================================================
// ShortCard
// =============================================================
interface ShortCardProps {
  data: VideoData;
  isActive: boolean;
}

function ShortCard({ data, isActive }: ShortCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(data.bookmarked);
  const [paused, setPaused] = useState(false);

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

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="relative h-full min-w-full shrink-0 snap-start snap-always overflow-hidden bg-black text-[var(--color-white)]">
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
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[20%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Pause indicator */}
      {paused && (
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-black/15">
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
      <div className="absolute right-3 bottom-[128px] z-10 flex flex-col items-center gap-5 text-[28px]">
        <button
          className="flex flex-col items-center gap-1 border-none bg-transparent p-1"
          onClick={handleLike}
        >
          {liked ? <LikeFill /> : <Like />}
        </button>
        <button
          className="flex flex-col items-center gap-1 border-none bg-transparent p-1"
          onClick={handleDislike}
        >
          {disliked ? <DislikeFill /> : <Dislike />}
        </button>
        <button
          className="flex flex-col items-center gap-1 border-none bg-transparent p-1"
          onClick={() => setBookmarked(!bookmarked)}
        >
          {bookmarked ? <BookmarkFill /> : <Bookmark />}
        </button>
        <button className="flex items-center justify-center rounded-full border-none bg-transparent">
          <Flag />
        </button>
        <button className="flex flex-col items-center gap-1 border-none bg-transparent">
          <Comment />
          <span className="body4 font-medium">
            {formatCount(data.comments)}
          </span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute right-0 bottom-0 left-0 z-10 p-4">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
            {data.uploader.profileImg ? (
              <img
                src={data.uploader.profileImg}
                className="h-full w-full object-cover"
                alt=""
              />
            ) : (
              <div className="h-full w-full rounded-full bg-[var(--color-primary-100)]" />
            )}
          </div>
          <span className="title3 font-semibold">{data.uploader.name}</span>
        </div>

        <p className="title3 mb-3 line-clamp-2 leading-[1.4]">{data.title}</p>

        {data.longformUrl !== '' && (
          <button className="title3 w-full rounded-lg border-none bg-white/70 px-4 py-3 font-semibold tracking-wide text-[var(--color-black)] backdrop-blur-[10px]">
            해당영상 시청하기
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================
// HorizontalRow
// =============================================================
interface HorizontalRowProps {
  sourceVideo: VideoData;
  isActiveRow: boolean;
  onHorizontalIndexChange: (index: number, video: VideoData) => void;
}

function HorizontalRow({
  sourceVideo,
  isActiveRow,
  onHorizontalIndexChange,
}: HorizontalRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [horizontalIndex, setHorizontalIndex] = useState(0);
  const allVideos = [sourceVideo, ...relatedVideos];

  useEffect(() => {
    if (isActiveRow && relatedVideos.length === 0) {
      const related = fetchRelatedVideos(sourceVideo);
      setRelatedVideos(related);
    }
  }, [isActiveRow, sourceVideo, relatedVideos.length]);

  useEffect(() => {
    if (!isActiveRow && scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
      setHorizontalIndex(0);
    }
  }, [isActiveRow]);

  const handleHorizontalScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (
      newIndex !== horizontalIndex &&
      newIndex >= 0 &&
      newIndex < allVideos.length
    ) {
      setHorizontalIndex(newIndex);
      onHorizontalIndexChange(newIndex, allVideos[newIndex]!);
    }
  }, [horizontalIndex, allVideos, onHorizontalIndexChange]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleHorizontalScroll, {
      passive: true,
    });
    return () =>
      container.removeEventListener('scroll', handleHorizontalScroll);
  }, [handleHorizontalScroll]);

  return (
    <div
      ref={scrollRef}
      className="flex h-full w-full snap-x snap-mandatory overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {allVideos.map((video, i) => (
        <ShortCard
          key={video.id}
          data={video}
          isActive={isActiveRow && i === horizontalIndex}
        />
      ))}
    </div>
  );
}

// =============================================================
// ShortsTab (Main)
// =============================================================
export default function ShortsTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [algorithmList, setAlgorithmList] =
    useState<VideoData[]>(ALGORITHM_VIDEOS);

  const lastSeenRef = useRef<Map<number, VideoData>>(new Map());

  // 수직 스크롤 핸들러
  const handleVerticalScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const rowHeight = container.clientHeight;
    const newRowIndex = Math.round(scrollTop / rowHeight);

    if (
      newRowIndex !== activeRowIndex &&
      newRowIndex >= 0 &&
      newRowIndex < algorithmList.length
    ) {
      const lastSeen = lastSeenRef.current.get(activeRowIndex);
      if (lastSeen && lastSeen.id !== algorithmList[activeRowIndex]?.id) {
        setAlgorithmList((prev) => {
          const next = [...prev];
          next[activeRowIndex] = lastSeen;
          return next;
        });
      }

      setActiveRowIndex(newRowIndex);

      const currentVideo =
        lastSeenRef.current.get(newRowIndex) ?? algorithmList[newRowIndex];
      if (currentVideo) {
        window.history.replaceState(null, '', `/shortForm/${currentVideo.id}`);
      }
    }
  }, [activeRowIndex, algorithmList]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleVerticalScroll, {
      passive: true,
    });
    return () => container.removeEventListener('scroll', handleVerticalScroll);
  }, [handleVerticalScroll]);

  const handleHorizontalChange = useCallback(
    (rowIndex: number) => (hIndex: number, video: VideoData) => {
      lastSeenRef.current.set(rowIndex, video);
      window.history.replaceState(null, '', `/shortForm/${video.id}`);
    },
    [],
  );

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-black">
      {/* 헤더 */}
      <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between bg-linear-to-b from-black/30 to-transparent px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 text-[28px] text-[var(--color-white)]">
        <div />
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-full border-none bg-transparent">
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Vertical scroll container */}
      <div
        ref={containerRef}
        className="flex-1 snap-y snap-mandatory overflow-y-scroll [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {algorithmList.map((video, rowIndex) => (
          <div
            key={`row-${rowIndex}-${video.id}`}
            className="h-dvh w-full snap-start snap-always"
          >
            <HorizontalRow
              sourceVideo={video}
              isActiveRow={rowIndex === activeRowIndex}
              onHorizontalIndexChange={handleHorizontalChange(rowIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
