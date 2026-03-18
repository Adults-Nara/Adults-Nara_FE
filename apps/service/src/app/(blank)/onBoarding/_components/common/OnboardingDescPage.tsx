'use client';

import { Button, Coin, Logo } from '@repo/ui';
import useEmblaCarousel from 'embla-carousel-react';
import { Volume2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { useLongPressTTS } from '@/hooks/useLongPressTTS';

const SLIDES = [
  {
    icon: <Logo className="h-40 w-40" />,
    description: '연습하기 전 저희 서비스에 대해 간단히 설명드릴게요.',
  },
  {
    icon: <Coin className="h-40 w-40" />,
    description: '광고 영상을 끝까지 보면 포인트를 획득할 수 있어요!',
  },
  {
    imgSrc: '/onboarding_touch.png',
    description: '영상 정보는 글자를 꾹 눌러서 소리로 들어보세요!',
  },
];

export function OnboardingDescPage({ onNext }: { onNext: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleNext = () => {
    if (selectedIndex < SLIDES.length - 1) {
      emblaApi?.scrollNext();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex h-dvh flex-col items-center justify-between px-6 py-16">
      <OnboardingHeader />
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className="flex flex-[0_0_100%] flex-col items-center gap-10 rounded-2xl px-4 py-8"
            >
              {slide.icon && (
                <div className="flex h-48 items-center justify-center">
                  {slide.icon}
                </div>
              )}
              {slide.imgSrc && (
                <img
                  src={slide.imgSrc}
                  alt={`Slide ${index + 1}`}
                  className="h-70 object-contain"
                />
              )}

              <p
                className="title1 p-2 text-center break-keep whitespace-pre-wrap"
                {...useLongPressTTS(slide.description)}
              >
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex ? 'bg-primary-500 w-6' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      <Button onClick={handleNext}>
        {selectedIndex < SLIDES.length - 1 ? '다음' : '시작하기'}
      </Button>
    </div>
  );
}
