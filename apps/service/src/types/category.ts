export const MainCategory = [
  { key: '1001', label: '건강/의학' },
  { key: '1002', label: '운동/체조' },
  { key: '1003', label: '음악/공연' },
  { key: '1004', label: '음식/요리' },
  { key: '1005', label: '취미/교양' },
  { key: '1006', label: '영화/드라마' },
  { key: '1007', label: '다큐/브이로그' },
  { key: '1008', label: '생활/정보' },
] as const;

export type MainCategoryKey = (typeof MainCategory)[number]['key'];

export const CATEGORY_MAP: Record<string, { label: string; value: string }[]> =
  {
    '1001': [
      // 건강/의학
      { label: '관절/뼈 건강', value: '2001' },
      { label: '치매 예방', value: '2002' },
      { label: '만성질환 관리', value: '2003' },
      { label: '건강 식단', value: '2004' },
      { label: '한방/동의보감', value: '2005' },
    ],
    '1002': [
      // 운동/체조
      { label: '실내 스트레칭', value: '2006' },
      { label: '시니어 요가', value: '2007' },
      { label: '걷기/등산', value: '2008' },
      { label: '통증 완화 운동', value: '2009' },
    ],
    '1003': [
      // 음악/공연
      { label: '트로트 경연', value: '2010' },
      { label: '7080 가요', value: '2011' },
      { label: '국악/민요', value: '2012' },
      { label: '콘서트', value: '2013' },
    ],
    '1004': [
      // 음식/요리
      { label: '전통 한식', value: '2014' },
      { label: '제철 요리', value: '2015' },
      { label: '보양식', value: '2016' },
      { label: '간편 밑반찬', value: '2017' },
      { label: '한식', value: '2018' },
      { label: '양식', value: '2019' },
      { label: '중식', value: '2020' },
      { label: '일식', value: '2021' },
      { label: '분식', value: '2022' },
      { label: '길거리 음식', value: '2023' },
      { label: '혼밥', value: '2024' },
      { label: '디저트 먹방', value: '2025' },
      { label: '해외 음식', value: '2026' },
    ],
    '1005': [
      // 취미/교양
      { label: '국내 여행', value: '2027' },
      { label: '해외 여행', value: '2028' },
      { label: '캠핑', value: '2029' },
      { label: '맛집 여행', value: '2030' },
      { label: '배낭여행', value: '2031' },
      { label: '스마트폰활용법', value: '2032' },
      { label: '원예/자연', value: '2033' },
      { label: '역사/인물', value: '2034' },
    ],
    '1006': [
      // 영화/드라마
      { label: '추억의 명화', value: '2035' },
      { label: '정통 사극', value: '2036' },
      { label: '가족 드라마', value: '2037' },
      { label: '감동 실화', value: '2038' },
    ],
    '1007': [
      // 다큐/브이로그
      { label: '자연 다큐', value: '2039' },
      { label: '역사 다큐', value: '2040' },
      { label: '인물 다큐', value: '2041' },
      { label: '사회 다큐', value: '2042' },
      { label: '브이로그', value: '2043' },
      { label: '리뷰', value: '2044' },
    ],
    '1008': [
      // 생활/정보
      { label: '시니어 재테크', value: '2045' },
      { label: '혜택/지원금', value: '2046' },
      { label: '생활 꿀팁', value: '2047' },
    ],
  };
