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
      {isPlaying ? (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,0.8)"
        >
          <rect x="5" y="3" width="4" height="18" />
          <rect x="15" y="3" width="4" height="18" />
        </svg>
      ) : (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,0.8)"
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </div>
  );
}
