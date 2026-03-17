export function VideoInfoSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 px-3 py-2">
      {/* Title & Stats */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
      </div>

      {/* Uploader Profile */}
      <div className="mt-2 flex flex-row items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="h-5 w-1/4 rounded bg-gray-200"></div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-row flex-wrap gap-2">
        {/* Placeholder for buttons with matching sizes */}
        <div className="h-10 w-24 rounded-lg bg-gray-100"></div>
        <div className="h-10 w-24 rounded-lg bg-gray-100"></div>
        <div className="h-10 w-24 rounded-lg bg-gray-100"></div>
        <div className="h-10 w-32 rounded-lg bg-gray-100"></div>
      </div>
    </div>
  );
}
