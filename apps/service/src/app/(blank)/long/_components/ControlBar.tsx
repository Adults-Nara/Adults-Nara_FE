import { formatVideoTime } from '@/utils/format';

interface ControlBarProps {
  currentTime: number;
  duration: number;
  onToggleFullscreen: () => void;
}

export function ControlBar({
  currentTime,
  duration,
  onToggleFullscreen,
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
    </div>
  );
}
