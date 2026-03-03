export const MainCategory = [
  { key: 'health', label: '건강' },
  { key: 'life', label: '생활' },
  { key: 'music', label: '음악' },
  { key: 'info', label: '정보' },
] as const;

export type MainCategoryKey = (typeof MainCategory)[number]['key'];

export const CATEGORY_MAP: Record<
  MainCategoryKey,
  { label: string; value: string }[]
> = {
  health: [
    { label: '등산', value: 'hiking' },
    { label: '요가', value: 'yoga' },
    { label: '헬스', value: 'fitness' },
    { label: '골프', value: 'golf' },
    { label: '명상', value: 'meditation' },
    { label: '다이어트', value: 'diet' },
    { label: '수영', value: 'swimming' },
  ],
  life: [
    { label: '요리', value: 'cooking' },
    { label: '청소', value: 'cleaning' },
    { label: '인테리어', value: 'interior' },
    { label: '반려동물', value: 'pet' },
    { label: '육아', value: 'parenting' },
    { label: '원예', value: 'gardening' },
  ],
  music: [
    { label: 'POP', value: 'pop' },
    { label: '재즈', value: 'jazz' },
    { label: '트로트', value: 'Trot' },
    { label: '클래식', value: 'classic' },
    { label: '발라드', value: 'ballade' },
    { label: 'OST', value: 'ost' },
  ],
  info: [
    { label: '부동산', value: 'real_estate' },
    { label: '금융', value: 'finance' },
    { label: 'AI', value: 'ai' },
    { label: '건강정보', value: 'health_info' },
    { label: '시사', value: 'current_affairs' },
    { label: '교육', value: 'education' },
  ],
};
