import { useRef, useState } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface SpeedSelectorProps {
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export function SpeedSelector({
  playbackRate,
  onPlaybackRateChange,
}: SpeedSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="title3 rounded bg-black/50 px-3 py-1 text-white transition hover:bg-white/20"
        aria-label="재생 속도 선택"
      >
        {playbackRate === 1 ? '속도' : `${playbackRate}x`}
      </button>

      {open && (
        <div
          className="absolute top-full right-0 left-0 flex flex-col items-center overflow-hidden rounded bg-black/50 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {PLAYBACK_RATES.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => {
                onPlaybackRateChange(rate);
                setOpen(false);
              }}
              className={`body3 px-4 py-1.5 transition hover:bg-white/20 ${
                playbackRate === rate ? 'text-primary-600 font-bold' : ''
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
