'use client';
import { ROUTES } from '@/constant/routes';
import { Chip } from '@repo/ui';
import { useRouter } from 'next/navigation';

// 임시 데이터 (나중에 API 연동)
const categories = ['건강', '요리', '애완동물'];
const categoriesRanking = [
  {
    category: '건강',
    tiem: '5시간 20분',
  },
  {
    category: '요리',
    tiem: '3시간 40분',
  },
  {
    category: '애완동물',
    tiem: '1시간 50분',
  },
];
const CategoryBoard = () => {
  const route = useRouter();
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-4 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      <div className="flex w-full justify-between">
        <span className="title2">선호주제</span>
        <button
          className="body3 text-primary-500 cursor-pointer"
          onClick={() => route.push(ROUTES.CATEGORY)}
        >
          자세히보기{' >'}
        </button>
      </div>
      <div className="flex w-full gap-2">
        {categories.map((cat, index) => {
          return (
            <Chip key={index} selected className="hover:bg-primary-500">
              {cat}
            </Chip>
          );
        })}
      </div>
      <div className="flex w-full flex-col gap-4">
        {categoriesRanking.map((rank, index) => {
          return (
            <div key={index} className="flex gap-4">
              <span className="title3 text-primary-500 w-5">{index + 1}</span>
              <span className="body2 w-20">{rank.category}</span>
              <span className="body2 text-gray-700">{rank.tiem}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBoard;
