export const LoadingSpinner = ({ thumbnail }: { thumbnail?: string }) => {
  return (
    <div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black"
      role="status"
      aria-live="polite"
      aria-label="콘텐츠 로딩 중"
    >
      {/* 배경 썸네일 */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt="thumbnail"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      )}

      {/* 로딩 스피너 (z-10으로 맨 위로 올림) */}
      <svg
        className="relative z-10 h-10 w-10 animate-spin text-white"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};
