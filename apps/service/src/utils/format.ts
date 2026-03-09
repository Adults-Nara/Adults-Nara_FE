/**
 * 조회수를 단위(만, 억)로 변환합니다.
 */
export const formatViewCount = (count: number): string => {
  if (count < 1000) return `${count}회`;
  if (count < 10000) {
    const notched = Math.floor(count / 100) / 10;
    return `${notched}천회`;
  }
  if (count < 100000000) {
    const notched = Math.floor(count / 1000) / 10;
    return `${notched}만회`;
  }
  const notched = Math.floor(count / 10000000) / 10;
  return `${notched}억회`;
};

/**
 * 업로드 날짜를 기준으로 현재와의 상대적 날짜를 계산합니다.
 */
export const formatRelativeTime = (date: string | Date): string => {
  const start = new Date(date);
  const end = new Date();
  const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}주 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
};

export const formatVideoTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m}:${s}`;
  }

  return `${m}:${s}`;
};

export function formatSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}초`);

  return parts.join(' ');
}
