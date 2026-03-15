import { Pause, Play } from '@repo/ui';

interface PlayButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlayButton({ isPlaying, onTogglePlay }: PlayButtonProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      onClick={(e) => {
        onTogglePlay();
      }}
    >
      {isPlaying ? <Pause /> : <Play />}
    </div>
  );
}
