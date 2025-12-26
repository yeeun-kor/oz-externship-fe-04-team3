import type { SelectData } from '@/components/common/Select'
import type {
  Recruitment,
  RecruitmentApiDetail,
  RecruitmentApiItem,
} from '@/types/recruitment'

export const mapRecruitmentItem = (data: RecruitmentApiItem): Recruitment => {
  return {
    id: data.uuid,
    title: data.title,
    content: '',
    maxParticipants: data.expected_headcount ?? 0,
    participants: 0,
    deadline: data.close_at,
    estimatedFee: undefined,
    studyType: undefined,
    authorId: undefined,
    author: undefined,
    views: data.views_count ?? 0,
    createdAt: data.close_at ?? '',
    thumbnail: data.thumbnail_img_url ?? undefined,
    thumbnailType: 'image',
    tags: data.tags?.map((tag) => tag.name) ?? [],
    bookmarks: data.bookmark_count ?? 0,
    lectureList:
      data.lectures?.map((lecture) => ({
        id: lecture.id,
        title: lecture.title,
        instructor: lecture.instructor,
        thumbnail: lecture.thumbnail_img_url,
        price: lecture.discounted_price ?? lecture.original_price ?? 0,
        link: lecture.url_link,
      })) ?? [],
    attachments: [],
  }
}

export const mapRecruitmentDetail = (
  data: RecruitmentApiDetail
): Recruitment => {
  return {
    id: data.uuid,
    title: data.title,
    content: data.content ?? '',
    maxParticipants: data.expected_headcount ?? 0,
    participants: data.participants ?? 0,
    deadline: data.close_at,
    estimatedFee: data.estimated_fee,
    studyType: data.study_type,
    authorId: data.author?.id,
    author: data.author,
    views: data.views_count ?? 0,
    createdAt: data.created_at ?? data.close_at ?? '',
    thumbnail: data.thumbnail_img_url,
    thumbnailType: 'image',
    tags: data.tags?.map((tag) => tag.name) ?? [],
    bookmarks: data.bookmark_count ?? 0,
    lectureList:
      data.lectures?.map((lecture) => ({
        id: lecture.id,
        title: lecture.title,
        instructor: lecture.instructor,
        thumbnail: lecture.thumbnail_img_url,
        price: lecture.discounted_price ?? lecture.original_price ?? 0,
        link: lecture.url_link,
      })) ?? [],
    attachments: data.files ?? [],
  }
}
export const sortDataRecruitment: SelectData = [
  { itemValue: 'default', itemText: '정렬 기본순' },
  { itemValue: 'latest', itemText: '최신순' },
  { itemValue: 'oldest', itemText: '오래된순' },
  { itemValue: 'most_views', itemText: '조회수 높은순' },
  { itemValue: 'most_bookmarks', itemText: '북마크 높은순' },
]
