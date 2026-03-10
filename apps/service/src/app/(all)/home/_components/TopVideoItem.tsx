import { Crown, Heart } from 'lucide-react';
import Image from 'next/image';

export interface TopVideoItemProps {
  rank: number;
  title: string;
  thumbnail: string;
  score: number;
}

export default function TopVideoItem({
  rank,
  title,
  thumbnail,
  score,
}: TopVideoItemProps) {
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bgColor: 'bg-[#F1C40F]',
          medalColor: 'text-white',
          medalText: 'text-white ',
        };
      case 2:
        return {
          bgColor: 'bg-[#95A5A6]',
          medalColor: 'text-[#ECF0F1]',
          medalText: 'text-gray-800 ',
        };
      case 3:
        return {
          bgColor: 'bg-[#D35400]',
          medalColor: 'text-[#E67E22]',
          medalText: 'text-white ',
        };
      default:
        return {
          bgColor: 'bg-primary-600',
          medalColor: 'text-white ',
          medalText: 'text-white ',
        };
    }
  };

  const badgeStyle = getRankBadgeStyle(rank);

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl shadow-md transition-all duration-300">
      {/* 이미지 및 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/90" />
      </div>

      {/* 리본형 순위 라벨 */}
      <div
        className={`absolute top-0 left-5 flex h-16 w-11 flex-col items-center pt-2 shadow-md ${badgeStyle.bgColor}`}
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)',
        }}
      >
        <span className={`title2 leading-none ${badgeStyle.medalText}`}>
          {rank}
        </span>
        {[1, 2, 3].includes(rank) && (
          <Crown
            className={`mt-1 h-4 w-4 ${badgeStyle.medalColor}`}
            fill="currentColor"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* 텍스트 콘텐츠 */}
      <div className="absolute right-0 bottom-0 left-0 p-4">
        <h3 className="title3 line-clamp-2 text-white">{title}</h3>
        <div className="mt-1 flex items-center gap-1">
          <Heart className="h-4 w-4 text-[#F1C40F]" fill="#F1C40F" />
          <span className="body3 text-[#F1C40F]">{score.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
