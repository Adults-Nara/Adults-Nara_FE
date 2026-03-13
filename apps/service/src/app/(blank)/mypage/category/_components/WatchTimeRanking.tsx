'use client';
import { useTagWatchStats } from '@/lib/tanstack/query/tag.query';
import { formatSecondsToTime } from '@/utils/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Minus,
  More,
  Plus,
} from '@repo/ui';

interface WatchTimeRankingProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const WatchTimeRanking = ({
  selectedCategories,
  onToggle,
}: WatchTimeRankingProps) => {
  const { stats, isError, isPending } = useTagWatchStats();

  //TODO: 추후 로딩 에러 페이지 구현
  if (isPending) return <span>시청시간순위 로딩중..</span>;
  if (isError) return <span>시청시간순위 에러..</span>;
  return (
    <div className="flex flex-col gap-4">
      <span className="title1">주제별 시청시간 순위</span>
      <div className="flex flex-col gap-4 px-2">
        {stats.length === 0 ? (
          <span>시청 기록이 없습니다 </span>
        ) : (
          stats.map((rank, index) => {
            return (
              <div
                key={rank.tagId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`title2 ${index < 3 ? 'text-primary-500' : ''}`}
                  >
                    {index + 1}
                  </span>
                  <span className="title2">{rank.tagName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="body1 text-gray-700">
                    {formatSecondsToTime(rank.totalWatchSeconds)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="shrink-0">
                        <More className="h-5 w-5 text-gray-700" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          disabled={selectedCategories.includes(rank.tagId)}
                          onClick={() => onToggle(rank.tagId)}
                        >
                          <Plus />
                          선호주제 추가
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={!selectedCategories.includes(rank.tagId)}
                          onClick={() => onToggle(rank.tagId)}
                          variant="destructive"
                        >
                          <Minus />
                          선호주제 삭제
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
  );
};

export default WatchTimeRanking;
