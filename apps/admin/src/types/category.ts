export const MainCategory = [
  { key: '1001', label: '스릴러' },
  { key: '1002', label: '다큐' },
  { key: '1003', label: '드라마' },
  { key: '9998', label: '액션' },
  { key: '9999', label: 'SF' },
  { key: '8888', label: '로맨스' },
  { key: '8887', label: '코미디' },
  { key: '1008', label: '스포츠' },
  { key: '1007', label: '게임' },
  { key: '1015', label: '여행' },
  { key: '1011', label: '먹방' },
  { key: '1023', label: '요리' },
] as const;

export type MainCategoryKey = (typeof MainCategory)[number]['key'];

export const CATEGORY_MAP: Record<string, { label: string; value: string }[]> =
  {
    '1001': [
      // 스릴러
      { label: '심리 스릴러', value: '3001' },
      { label: '범죄 스릴러', value: '3002' },
      { label: '미스터리', value: '3003' },
      { label: '추적', value: '3004' },
      { label: '서스펜스', value: '3005' },
    ],
    '1002': [
      // 다큐
      { label: '자연 다큐', value: '3006' },
      { label: '역사 다큐', value: '3007' },
      { label: '인물 다큐', value: '3008' },
      { label: '사회 다큐', value: '3009' },
    ],
    '1003': [
      // 드라마
      { label: '로맨스 드라마', value: '3010' },
      { label: '가족 드라마', value: '3011' },
      { label: '시대극', value: '3012' },
      { label: '청춘 드라마', value: '3013' },
      { label: '법정 드라마', value: '3014' },
    ],
    '9998': [
      // 액션
      { label: '무협', value: '3015' },
      { label: '전쟁', value: '3016' },
      { label: '첩보', value: '3017' },
      { label: '히어로', value: '3018' },
      { label: '카체이싱', value: '3019' },
    ],
    '9999': [
      // SF
      { label: '우주', value: '3020' },
      { label: '디스토피아', value: '3021' },
      { label: '타임루프', value: '3022' },
      { label: 'AI', value: '3023' },
      { label: '외계인', value: '3024' },
    ],
    '8888': [
      // 로맨스
      { label: '청춘 로맨스', value: '3025' },
      { label: '멜로', value: '3026' },
      { label: '재회', value: '3027' },
      { label: '짝사랑', value: '3028' },
    ],
    '8887': [
      // 코미디
      { label: '시트콤', value: '3029' },
      { label: '블랙 코미디', value: '3030' },
      { label: '패러디', value: '3031' },
      { label: '슬랩스틱', value: '3032' },
      { label: '풍자', value: '3033' },
    ],
    '1008': [
      // 스포츠
      { label: '축구', value: '3034' },
      { label: '야구', value: '3035' },
      { label: '농구', value: '3036' },
      { label: 'e스포츠', value: '3037' },
      { label: '격투기', value: '3038' },
    ],
    '1007': [
      // 게임
      { label: 'FPS', value: '3039' },
      { label: 'RPG', value: '3040' },
      { label: '전략 게임', value: '3041' },
      { label: '공포 게임', value: '3042' },
      { label: '인디 게임', value: '3043' },
    ],
    '1015': [
      // 여행
      { label: '국내 여행', value: '3044' },
      { label: '해외 여행', value: '3045' },
      { label: '캠핑', value: '3046' },
      { label: '맛집 여행', value: '3047' },
      { label: '배낭여행', value: '3048' },
    ],
    '1011': [
      // 먹방
      { label: '대식 먹방', value: '3049' },
      { label: '길거리 음식', value: '3050' },
      { label: '혼밥', value: '3051' },
      { label: '디저트 먹방', value: '3052' },
      { label: '해외 음식', value: '3053' },
    ],
    '1023': [
      // 요리
      { label: '한식', value: '3054' },
      { label: '양식', value: '3055' },
      { label: '중식', value: '3056' },
      { label: '일식', value: '3057' },
      { label: '분식', value: '3058' },
    ],
  };
