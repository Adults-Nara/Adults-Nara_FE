import { MOCK_POINT_DATA } from '@/constant/mockData';
import type { Point } from '@/types/point';
import { cn, LeftArrow2, RightArrow } from '@repo/ui';

const TIME_ZONE = 'Asia/Seoul';

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const PointHistory = () => {
  //api연동 필요
  const groupedData = MOCK_POINT_DATA.reduce(
    (acc: Record<string, Point[]>, curr) => {
      const dateObj = new Date(curr.createdAt);
      // 헤더용 날짜 포맷 (M. D.) -> "2. 28."
      const dateKey = `${dateObj.getMonth() + 1}. ${dateObj.getDate()}.`;

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(curr);
      return acc;
    },
    {},
  );
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3">
        <button>
          <LeftArrow2 className="h-5 w-5" />
        </button>
        <span className="title2">2026년 2월</span>
        <button>
          <RightArrow className="h-5 w-5" />
        </button>
      </div>
      {Object.entries(groupedData).map(([date, items]) => (
        <div key={date} className="flex w-full flex-col gap-1">
          <span className="title2">{date}</span>
          <div className="flex w-full flex-col gap-2 px-2">
            {items.map((data) => {
              const pointType = data.type === 'COST' ? true : false;
              return (
                <div
                  key={data.transactionId}
                  className="flex w-full justify-between border-b border-b-gray-500 py-3 last:border-none"
                >
                  <div className="flex flex-col gap-1">
                    <span className="body2">
                      {pointType ? '통신비 납부 할인' : '광고시청 포인트 적립'}
                    </span>
                    <span className="body3">{formatTime(data.createdAt)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'body2',
                        pointType ? 'text-primary-600' : '',
                      )}
                    >
                      {pointType ? '- ' : '+ '}
                      {data.amount.toLocaleString()} P
                    </span>
                    <span className="body3">
                      {data.balanceAfterTransaction.toLocaleString()} P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointHistory;
