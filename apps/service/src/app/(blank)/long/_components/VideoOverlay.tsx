import { ControlBar } from './ControlBar';
import { PlayButton } from './PlayButton';
import { ProgressBar } from './ProgressBar';
import { AdProgressBar } from './AdProgressBar';
import { PageHeader } from './PageHeader';
import { type RefObject } from 'react';

interface VideoControllerOverlayProps {
  show: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isDragging: RefObject<boolean>;
  onTogglePlay: () => void;
  onShowControls: () => void;
  onSeek: (time: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
  // 광고 관련 추가
  isAdMode?: boolean;
  onSkip?: () => void;
}

export function VideoControllerOverlay({
  show,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  isDragging,
  onTogglePlay,
  onShowControls,
  onSeek,
  onPlaybackRateChange,
  onToggleFullscreen,
  isAdMode = false,
  onSkip,
}: VideoControllerOverlayProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-end transition-opacity duration-300 ${
        show || isAdMode ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onShowControls}
    >
      {/* 광고 모드일 때는 항상 배경 딤을 약간 주거나, 상황에 따라 조절 */}
      <div
        className={`absolute inset-0 bg-black/30 ${isAdMode ? 'pointer-events-none' : ''}`}
      />

      {/* 뒤로가기 버튼 - 광고 중에는 숨김 (선택 사항) */}
      {!isAdMode && <PageHeader />}

      {/* 영상 중앙 플레이버튼 - 자동재생 실패 시나 일시정지 시 필요 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayButton isPlaying={isPlaying} onTogglePlay={onTogglePlay} />
      </div>

      {/* 광고 전용 UI: 스킵 버튼 */}
      {isAdMode && onSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="absolute right-4 bottom-20 z-20 flex flex-col rounded bg-black/60 px-4 py-2 text-sm text-white transition hover:bg-black/80 active:scale-95"
        >
          <p>리워드 건너뛰기 ▶</p>
        </button>
      )}

      {/* 하단 컨트롤 영역 */}
      <div className="absolute right-0 bottom-0 left-0">
        {isAdMode ? (
          // 광고 모드: 읽기 전용 프로그레스 바만 노출
          <div key="ad-controls" className="pb-4">
            <AdProgressBar currentTime={currentTime} duration={duration} />
          </div>
        ) : (
          // 일반 모드: 표준 컨트롤바 + 인터랙티브 프로그레스 바
          <div key="standard-controls">
            <ControlBar
              currentTime={currentTime}
              duration={duration}
              playbackRate={playbackRate}
              onSeek={onSeek}
              onPlaybackRateChange={onPlaybackRateChange}
              onToggleFullscreen={onToggleFullscreen}
            />
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={onSeek}
              isDragging={isDragging}
            />
          </div>
        )}
      </div>
    </div>
  );
}
