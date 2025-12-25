import type { SelectData } from '@/components/common/Select'

export const sortData: SelectData = [
  { itemValue: 'default', itemText: '정렬 기본순' },
  { itemValue: 'latest', itemText: '최신순' },
  { itemValue: 'oldest', itemText: '오래된순' },
  { itemValue: 'low_price', itemText: '낮은 가격순' },
  { itemValue: 'high_price', itemText: '높은 가격순' },
  { itemValue: 'high_rating', itemText: '높은 평점순' },
  { itemValue: 'low_rating', itemText: '낮은 평점순' },
]
export const categoryData: SelectData = [
  { itemValue: 'default', itemText: '전체' },
  { itemValue: '개발 · 프로그래밍', itemText: '개발 · 프로그래밍' },
  { itemValue: 'AI 기술', itemText: 'AI 기술' },
  { itemValue: 'AI 활용(AX)', itemText: 'AI 활용(AX)' },
  { itemValue: '게임 개발', itemText: '게임 개발' },
  { itemValue: '데이터 사이언스', itemText: '데이터 사이언스' },
  { itemValue: '보안 · 네트워크', itemText: '보안 · 네트워크' },
  { itemValue: '하드웨어', itemText: '하드웨어' },
  { itemValue: '디자인 · 아트', itemText: '디자인 · 아트' },
  { itemValue: '기획 · 경영 · 마케팅', itemText: '기획 · 경영 · 마케팅' },
  { itemValue: '외국어', itemText: '외국어' },
  { itemValue: '업무 생산성', itemText: '업무 생산성' },
  { itemValue: '커리어 · 자기계발', itemText: '커리어 · 자기계발' },
  { itemValue: '대학 교육', itemText: '대학 교육' },
]
export const LectureLevel: Record<string, string> = {
  EASY: '초급',
  NORMAL: '중급',
  HARD: '고급',
}
