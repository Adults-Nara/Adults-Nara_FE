'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { Chip } from '@repo/ui';
import { ChipSkeleton } from '@/components/skeleton/ChipSkeleton';

interface CategoryTagListProps {
  tags: {
    tagId: string;
    tagName: string;
  }[];
  selected: string | null;
  onSelect: (tagId: string) => void;
  isError: boolean;
  isPending: boolean;
}

const CategoryTagList = ({
  tags,
  selected,
  onSelect,
  isError,
  isPending,
}: CategoryTagListProps) => {
  const [categoryRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  if (isPending)
    return (
      <div className="gap-2.5 overflow-hidden px-3">
        <ChipSkeleton count={4} />
      </div>
    );
  if (isError)
    return (
      <div className="body2 text-primary-500 px-3">
        사용자 선호주제를 가져오지못했습니다.
      </div>
    );
  return (
    <div className="overflow-hidden px-3" ref={categoryRef}>
      <div className="flex gap-2.5">
        {tags.map((cat) => (
          <Chip
            key={cat.tagId}
            selected={selected === cat.tagId}
            onClick={() => onSelect(cat.tagId)}
          >
            {cat.tagName}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default CategoryTagList;
