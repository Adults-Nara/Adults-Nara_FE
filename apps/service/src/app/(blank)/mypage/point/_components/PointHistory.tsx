'use client';
import useObserver from '@/hooks/useObserver';
import { useMyPointTransactionHistory } from '@/lib/tanstack/query/point.query';
import { PointTransaction } from '@/models/point.model';
import { cn, LeftArrow2, RightArrow } from '@repo/ui';
import { useMemo, useState } from 'react';

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
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // API에 보낼 날짜 파라미터 계산
  const startDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const endDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${lastDay}`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useMyPointTransactionHistory({ startDate, endDate });

  const allTransactions = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) || [];
  }, [data]);

  const groupedData = allTransactions.reduce(
    (acc: Record<string, PointTransaction[]>, curr) => {
      const dateObj = new Date(curr.createdAt);
      // 헤더용 날짜 포맷 (M. D.) -> "2. 28."
      const dateKey = `${dateObj.getMonth() + 1}. ${dateObj.getDate()}.`;

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(curr);
      return acc;
    },
    {},
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    if (nextMonth <= today) {
      setCurrentDate(nextMonth);
    }
  };

  const isLatestMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO:추후 에러로딩 UI구현
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50">
        <span className="body2 animate-pulse">내역을 불러오고 있어요...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="body2 text-primary-600">
          내역을 불러오지 못했습니다.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline opacity-60"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  if (allTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth}>
            <LeftArrow2 className="h-5 w-5" />
          </button>
          <span className="title2">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </span>
          <button
            onClick={handleNextMonth}
            disabled={isLatestMonth}
            className={cn(isLatestMonth && 'opacity-20')}
          >
            <RightArrow className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-32 opacity-40">
          <div className="mb-4 text-5xl">💬</div>
          <span className="title2">포인트 내역이 없어요</span>
          <span className="body3 mt-1">영상을 시청하고 혜택을 받아보세요!</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-3">
        <button onClick={handlePrevMonth}>
          <LeftArrow2 className="h-5 w-5" />
        </button>
        <span className="title2">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <button
          onClick={handleNextMonth}
          disabled={isLatestMonth}
          className={cn(isLatestMonth && 'cursor-not-allowed opacity-20')}
        >
          <RightArrow className="h-5 w-5" />
        </button>
      </div>
      {Object.entries(groupedData).map(([date, items]) => (
        <div key={date} className="flex w-full flex-col gap-1">
          <span className="title2">{date}</span>
          <div className="flex w-full flex-col gap-2 px-2">
            {items.map((data) => {
              const typeMap = {
                AD_REWARD: '광고시청 포인트 적립',
                PURCHASE_BONUS: '상품구매 보너스 적립',
                UPLUS_DISCOUNT: '통신비 납부 할인',
              };

              const isDiscount = data.type === 'UPLUS_DISCOUNT';
              return (
                <div
                  key={data.transactionId}
                  className="flex w-full justify-between border-b border-b-gray-500 py-3 last:border-none"
                >
                  <div className="flex flex-col gap-1">
                    <span className="body2">
                      {typeMap[data.type as keyof typeof typeMap]}
                    </span>
                    <span className="body3">{formatTime(data.createdAt)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'body2',
                        isDiscount ? 'text-primary-600' : '',
                      )}
                    >
                      {isDiscount ? '' : '+'}
                      {data.amount.toLocaleString()} P
                    </span>
                    <span className="body3">
                      {data.balanceAfterTransaction.toLocaleString()} P
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={observerRef} className="h-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointHistory;
