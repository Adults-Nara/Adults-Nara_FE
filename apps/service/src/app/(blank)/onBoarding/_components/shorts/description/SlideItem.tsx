import { useLongPressTTS } from '@/hooks/useLongPressTTS';

export const SlideItem = ({
  icon,
  imgSrc,
  description,
  index,
}: {
  icon?: React.ReactNode;
  imgSrc?: string;
  description: string;
  index: number;
}) => {
  const descTTs = useLongPressTTS(description);
  return (
    <div
      key={index}
      className="flex flex-[0_0_100%] flex-col items-center gap-10 rounded-2xl px-4 py-8"
    >
      {icon && (
        <div className="flex h-48 items-center justify-center">{icon}</div>
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={`Slide ${index + 1}`}
          className="h-70 object-contain"
        />
      )}

      <p
        className="title1 p-2 text-center break-keep whitespace-pre-wrap"
        {...descTTs}
      >
        {description}
      </p>
    </div>
  );
};
