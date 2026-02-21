import { Minus, Plus } from '@repo/ui';

//임시 API연동필요
const MOCK_DATA_RANK = [
  {
    category: '건강',
    time: '5시간 20분',
  },
  {
    category: '요리',
    time: '3시간 40분',
  },
  {
    category: '애완동물',
    time: '2시간',
  },
  {
    category: '여행',
    time: '1시간 40분',
  },
  {
    category: '음악',
    time: '1시간 10분',
  },
  {
    category: '뉴스',
    time: '1시간',
  },
  {
    category: '교양',
    time: '50분',
  },
  {
    category: '드라마',
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
                <button className="rounded-full bg-gray-800 text-white">
                  <Plus className="h-6 w-6" />
                </button>
                {/* <Minus className="h-6 w-6 rounded-full bg-gray-500" /> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchTimeRanking;
