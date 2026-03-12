'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { Chip } from '@repo/ui';

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

  //TODO: 추후 로딩 에러 UI구현
  if (isPending) return <span>태그 로딩중,,,</span>;
  if (isError) return <span>태그 에러,,,</span>;
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
