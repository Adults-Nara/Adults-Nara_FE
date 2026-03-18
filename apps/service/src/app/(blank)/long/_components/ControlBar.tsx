import { formatVideoTime } from '@/utils/format';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ControlBarProps {
  currentTime: number;
  duration: number;
  onToggleFullscreen: () => void;
  isFullscreen?: boolean;
}

export function ControlBar({
  currentTime,
  duration,
  onToggleFullscreen,
  isFullscreen = false,
}: ControlBarProps) {
  return (
    <div className="body3 flex items-center justify-between px-4 pt-1">
      {/* 재생 시간 표시 */}
      <div className="w-fit rounded bg-black/50 px-2 py-1 text-white">
        {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
      </div>

      {/* 전체화면 */}
      <button
        onClick={onToggleFullscreen}
        className="rounded bg-black/50 px-2 py-1 text-white"
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>
  );
}
