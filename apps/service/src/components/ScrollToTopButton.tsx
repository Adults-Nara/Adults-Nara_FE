'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@repo/ui';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼 표시 여부 결정
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 내려갔을 때 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-110">
      <button
        onClick={scrollToTop}
        className={cn(
          'pointer-events-auto absolute right-3 bottom-21 flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 bg-gray-100 shadow-lg transition-all duration-300 active:scale-95',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        )}
      >
        <ChevronUp className="text-gray-700" size={28} />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
