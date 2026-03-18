import { useEffect, useCallback, useRef } from 'react';

const LONG_PRESS_DELAY = 1000; // ms

export function useLongPressTTS(text: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // 언마운트 시 타이머 정리 및 TTS 중지
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';

    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko'));
    if (koreanVoice) utterance.voice = koreanVoice;

    window.speechSynthesis.speak(utterance);
  }, [text]);

  const handleTouchStart = useCallback(() => {
    timerRef.current = setTimeout(speak, LONG_PRESS_DELAY);
  }, [speak]);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(timerRef.current ?? undefined);
  }, []);

  return {
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onMouseDown: () => {
      timerRef.current = setTimeout(speak, LONG_PRESS_DELAY);
    }, // 데스크탑
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
    onTouchStart: handleTouchStart, // 모바일
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchEnd, // 스크롤 시 취소
  };
}
