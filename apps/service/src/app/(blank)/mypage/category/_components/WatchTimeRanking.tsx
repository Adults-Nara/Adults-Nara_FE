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

//임시 API연동필요
const MOCK_DATA_RANK = [
  {
    category: '등산',
    time: '5시간 20분',
  },
  {
    category: '트로트',
    time: '3시간 40분',
  },
  {
    category: '반려동물',
    time: '2시간',
  },
  {
    category: '부동산',
    time: '1시간 40분',
  },
  {
    category: '원예',
    time: '1시간 10분',
  },
  {
    category: '발라드',
    time: '1시간',
  },
  {
    category: '명상',
    time: '50분',
  },
  {
    category: '부동산',
    time: '40분',
  },
];

interface WatchTimeRankingProps {
  selectedCategories: string[];
  onToggle: (cat: string) => void;
}

const WatchTimeRanking = ({
  selectedCategories,
  onToggle,
}: WatchTimeRankingProps) => {
  return (
    <div className="flex flex-col gap-4">
      <span className="title1">주제별 시청시간 순위</span>
      <div className="flex flex-col gap-4 px-2">
        {MOCK_DATA_RANK.map((rank, index) => {
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <span
                  className={`title2 ${index < 3 ? 'text-primary-500' : ''}`}
                >
                  {index + 1}
                </span>
                <span className="title2">{rank.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="body1 text-gray-700">{rank.time}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="shrink-0">
                      <More className="h-5 w-5 text-gray-700" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled={selectedCategories.includes(rank.category)}
                        onClick={() => onToggle(rank.category)}
                      >
                        <Plus />
                        선호주제 추가
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={!selectedCategories.includes(rank.category)}
                        onClick={() => onToggle(rank.category)}
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
        })}
      </div>
    </div>
  );
};

export default WatchTimeRanking;
