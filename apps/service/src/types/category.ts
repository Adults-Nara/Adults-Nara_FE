export interface SubCategory {
  id: string;
  label: string;
}

export interface CategoryGroup {
  id: string;
  title: string;
  items: SubCategory[];
}

export const MOCK_DATA_CATEGORY: CategoryGroup[] = [
  {
    id: 'group_health',
    title: '건강/생활',
    items: [
      { id: 'h1', label: '근력 홈트' },
      { id: 'h2', label: '당뇨 식단' },
      { id: 'h3', label: '명상/요가' },
      { id: 'h4', label: '등산 코스' },
      { id: 'h5', label: '질환 정보' },
    ],
  },
  {
    id: 'group_music',
    title: '추억/음악',
    items: [
      { id: 'm1', label: '인기 트로트' },
      { id: 'm2', label: '7080 가요' },
      { id: 'm3', label: '고전 명화' },
      { id: 'm4', label: '정통 사극' },
      { id: 'm5', label: '다큐멘터리' },
    ],
  },
  {
    id: 'group_edu',
    title: '배움/정보',
    items: [
      { id: 'e1', label: '전자제품 사용법' },
      { id: 'e2', label: '키오스크 교육' },
      { id: 'e3', label: '자산/연금' },
      { id: 'e4', label: '기초 영어' },
      { id: 'e5', label: '역사 강의' },
    ],
  },
  {
    id: 'group_religion',
    title: '마음/종교',
    items: [
      { id: 'r1', label: '기독교/예배' },
      { id: 'r2', label: '불교/법문' },
      { id: 'r3', label: '천주교/미사' },
      { id: 'r4', label: '명상 음악' },
      { id: 'r5', label: '자연 소리' },
    ],
  },
  {
    id: 'group_hobby',
    title: '취미/여행',
    items: [
      { id: 'v1', label: '낚시' },
      { id: 'v2', label: '바둑/장기' },
      { id: 'v3', label: '원예/텃밭' },
      { id: 'v4', label: '반려동물' },
      { id: 'v5', label: '전국 온천' },
    ],
  },
];
