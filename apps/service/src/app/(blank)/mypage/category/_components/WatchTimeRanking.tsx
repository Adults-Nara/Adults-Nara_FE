'use client';
import { useMonthlyStats } from '@/lib/tanstack/query/tag.query';
import { formatSecondsToTime } from '@/utils/format';
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LeftArrow2,
  Minus,
  More,
  Plus,
  RightArrow,
} from '@repo/ui';
import { useMemo, useState } from 'react';

interface WatchTimeRankingProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const WatchTimeRanking = ({
  selectedCategories,
  onToggle,
}: WatchTimeRankingProps) => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth() - 1, 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isError, isPending } = useMonthlyStats(year, month);

  // 상위 10개 데이터만 필터링
  const topTenTags = useMemo(() => {
    return data?.tags?.slice(0, 10) || [];
  }, [data]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(year, month, 1);

    const thisMonthFirstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    if (nextMonth < thisMonthFirstDay) {
      setCurrentDate(nextMonth);
    }
  };

  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const isLatestAvailableMonth =
    currentDate.getFullYear() === lastMonth.getFullYear() &&
    currentDate.getMonth() === lastMonth.getMonth();

  return (
    <div className="flex flex-col gap-2">
      <span className="title1 px-2">주제별 시청시간 순위</span>
      {/* 날짜 선택 헤더 */}
      <div className="flex items-center justify-center">
        <button onClick={handlePrevMonth} className="p-2">
          <LeftArrow2 className="h-6 w-6" />
        </button>
        <span className="title2">
          {year}년 {month}월
        </span>
        <button
          onClick={handleNextMonth}
          disabled={isLatestAvailableMonth}
          className={cn(
            'p-2',
            isLatestAvailableMonth && 'cursor-not-allowed opacity-10',
          )}
        >
          <RightArrow className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 px-2">
          {isPending ? (
            <div className="animate-pulse py-20 text-center text-gray-500">
              시청 순위를 불러오고 있어요...
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-red-500">
              시청 기록을 불러오지 못했습니다.
            </div>
          ) : topTenTags.length === 0 ? (
            <div className="py-20 text-center opacity-40">
              <span className="body2">시청 기록이 없습니다.</span>
            </div>
          ) : (
            topTenTags.map((rank, index) => {
              const stringTagId = String(rank.tagId);
              const isSelected = selectedCategories.includes(stringTagId);
              return (
                <div
                  key={rank.tagId}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none"
                >
                  <div className="flex items-center gap-5">
                    <span
                      className={cn(
                        'title2 w-4 text-center',
                        index < 3 ? 'text-primary-500' : 'text-gray-700',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="title2">{rank.tagName}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="body2 text-gray-700">
                      {formatSecondsToTime(rank.totalWatchSeconds)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="shrink-0 rounded-full p-1 active:bg-gray-100">
                          <More className="h-6 w-6 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            disabled={isSelected}
                            onClick={() => onToggle(stringTagId)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            <span>선호주제 추가</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!isSelected}
                            onClick={() => onToggle(stringTagId)}
                            variant="destructive"
                          >
                            <Minus className="mr-2 h-4 w-4" />
                            <span>선호주제 삭제</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchTimeRanking;
