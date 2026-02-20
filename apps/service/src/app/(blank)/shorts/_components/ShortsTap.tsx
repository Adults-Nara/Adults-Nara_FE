'use client';

import { VideoData } from '@/types/video';
import { useRef, useState, useCallback, useEffect } from 'react';
import { HorizontalCardsArea } from './HorizontalVideoList';

interface ShortsTabProps {
  algorithmList: VideoData[];
}

// 숏폼 탭
export default function ShortsTab(props: ShortsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0); // 현재 활성화된 세로 행 인덱스
  const [verticalList, setVerticalList] = useState<VideoData[]>( // 세로 스크롤 리스트 (사용자 기반 알고리즘 추천 영상)
    props.algorithmList,
  );

  // 마지막으로 본 영상 저장 (rowIndex -> VideoData)
  const lastSeenRef = useRef<Map<number, VideoData>>(new Map());

  // activeRowIndexRef와 verticalListRef는 최신 값을 참조하기 위한 ref.
  /* TODO : 가로 스크롤 해도 리랜더링 되는 부분 수정 */
  const activeRowIndexRef = useRef(0);
  const verticalListRef = useRef(verticalList);

  // 세로 스크롤 핸들러 : 영상 하나씩 스크롤할 때마다 activeRowIndex 업데이트
  const handleVerticalScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const rowHeight = container.clientHeight;
    const currentRow = activeRowIndexRef.current;

    // 스크롤 위치가 현재 index 기준으로 반 이상 넘어갔는지 판단
    const scrolledTo = Math.round(scrollTop / rowHeight);
    if (scrolledTo === currentRow) return; // 같은 행에 머무는 경우, 업데이트 X
    let newIndex = currentRow;
    if (scrolledTo > currentRow) {
      // 아래로 넘김
      newIndex = currentRow + 1;
    } else if (scrolledTo < currentRow) {
      // 위로 넘김
      newIndex = currentRow - 1;
    }

    setVerticalList((prev) => {
      const newList = [...prev];
      // 현재 행에 마지막으로 본 영상이 있으면, 그 영상으로 verticalList 업데이트
      const lastSeenVideo = lastSeenRef.current.get(currentRow);
      if (lastSeenVideo) {
        newList[currentRow] = lastSeenVideo;
      }
      return newList;
    });
    activeRowIndexRef.current = newIndex;
    setActiveRowIndex(newIndex);
  }, []);

  // event listener 등록
  useEffect(() => {
    const container = containerRef.current;
    // 컨테이너가 존재하면 스크롤 이벤트 리스너 등록
    if (!container) return;
    container.addEventListener('scroll', handleVerticalScroll, {
      passive: true,
    });

    // 언마운트시 삭제 (리랜더링 시, 중복 등록 방지)
    return () => container.removeEventListener('scroll', handleVerticalScroll);
  }, [handleVerticalScroll]);

  // 가로 스크롤 핸들러
  const handleHorizontalChange = useCallback(
    (rowIndex: number) => (hIndex: number, video: VideoData) => {
      lastSeenRef.current.set(rowIndex, video);
      // window.history.replaceState(null, '', `/shorts/${video.id}`);
    },
    [],
  );

  return (
    <>
      <div
        ref={containerRef}
        className="custom-scrollbar flex-1 snap-y snap-mandatory overflow-y-scroll [-webkit-overflow-scrolling:touch]"
      >
        {verticalList.map((video, rowIndex) => (
          <div
            key={`row-${rowIndex}-${video.id}`}
            className="h-dvh w-full snap-start snap-always"
          >
            <HorizontalCardsArea
              sourceVideo={video}
              isActiveRow={rowIndex === activeRowIndex}
              onHorizontalIndexChange={handleHorizontalChange(rowIndex)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
