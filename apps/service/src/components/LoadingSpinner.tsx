export const LoadingSpinner = ({ thumbnail }: { thumbnail?: string }) => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black">
      {thumbnail && (
        <img
          src={thumbnail}
          alt="thumbnail"
          className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
        />
      )}
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
