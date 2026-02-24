import { ControlBar } from './ControlBar';
import { PlayButton } from './PlayButton';
import { ProgressBar } from './ProgressBar';

interface VideoControllerOverlayProps {
  show: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isDragging: React.RefObject<boolean>; // VideoPlayer에서 관리
  onTogglePlay: () => void;
  onShowControls: () => void;
  onSeek: (time: number) => void; // time in seconds
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
}

// 플레이어 화면 오버레이 컴포넌트
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
}: VideoControllerOverlayProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-end transition-opacity duration-300 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={onShowControls}
    >
      {/* 딤 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 영상 중앙 플레이버튼 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayButton isPlaying={isPlaying} onTogglePlay={onTogglePlay} />
      </div>

      {/* 하단 컨트롤바 */}
      <div className="absolute right-0 bottom-0 left-0">
        <ControlBar
          show={show}
          isPlaying={isPlaying}
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
    </div>
  );
}
