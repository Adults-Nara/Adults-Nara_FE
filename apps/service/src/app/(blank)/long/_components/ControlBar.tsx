import { formatVideoTime } from '@/utils/format';

interface ControlBarProps {
  currentTime: number;
  duration: number;
  playbackRate: number;
  onSeek: (time: number) => void; // time in seconds
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
}

const PLAYBACK_RATES = [0.75, 1, 1.25];

export function ControlBar({
  currentTime,
  duration,
  playbackRate,
  onPlaybackRateChange,
  onToggleFullscreen,
}: ControlBarProps) {
  return (
    <div className="body3 flex items-center justify-between px-4 pt-1">
      {/* 재생 시간 표시 */}
      <div className="w-fit text-white">
        {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
      </div>
      {/* 속도 조절 */}
      <div className="flex flex-row gap-7">
        <div className="flex items-center gap-2">
          {/* 재생 속도 */}
          <div className="flex items-center gap-1">
            {PLAYBACK_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onPlaybackRateChange(rate)}
                aria-pressed={playbackRate === rate}
                aria-label={`${rate}배속`}
                className={`rounded px-2 py-1 transition ${
                  playbackRate === rate ? 'bg-white text-black' : 'text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
        {/* 전체화면 */}
        <button
          onClick={onToggleFullscreen}
          className="rounded px-2 py-1 text-white"
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
    </div>
  );
}
