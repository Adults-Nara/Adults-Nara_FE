import { useRef, useState } from 'react';
import { type HlsLevel } from '@/hooks/useHlsPlayer';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface QualitySelectorProps {
  levels: HlsLevel[];
  currentLevel: number;
  onLevelChange: (index: number) => void;
}

function levelLabel(level: HlsLevel) {
  return level.height
    ? `${level.height}p`
    : `${Math.round(level.bitrate / 1000)}k`;
}

export function QualitySelector({
  levels,
  currentLevel,
  onLevelChange,
}: QualitySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false), open);

  if (levels.length === 0) return null;

  const selectedLabel =
    currentLevel === -1 ? 'Auto' : levelLabel(levels[currentLevel]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="title3 rounded bg-black/50 px-3 py-1 text-white transition hover:bg-white/20"
        aria-label="화질 선택"
      >
        화질
      </button>

      {open && (
        <div
          className="absolute top-full right-0 left-0 flex flex-col items-center overflow-hidden rounded bg-black/50 text-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Auto */}
          <button
            type="button"
            onClick={() => {
              onLevelChange(-1);
              setOpen(false);
            }}
            className={`body3 px-4 py-1.5 text-left transition hover:bg-white/20 ${
              currentLevel === -1 ? 'text-primary-600 font-bold' : ''
            }`}
          >
            Auto
          </button>

          {/* 화질 */}
          {[...levels]
            .sort((a, b) => b.height - a.height)
            .map((level) => (
              <button
                key={level.index}
                type="button"
                onClick={() => {
                  onLevelChange(level.index);
                  setOpen(false);
                }}
                className={`body3 px-4 py-2 text-left transition hover:bg-white/20 ${
                  currentLevel === level.index
                    ? 'text-primary-600 font-bold'
                    : ''
                }`}
              >
                {levelLabel(level)}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
