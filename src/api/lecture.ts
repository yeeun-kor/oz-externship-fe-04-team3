import type {
  BookmarkResponse,
  LecturePageResponse,
  LecturesParams,
} from '@/types/lecture'
import { axiosInstance } from './axios'

export async function getLecturesApi(
  params: LecturesParams = {}
): Promise<LecturePageResponse> {
  // 객체타입 Record<키값:키밸류>
  const queryParams: Record<string, string | number> = {}

  if (params.page) queryParams.page = params.page
  if (params.page_size) queryParams.page_size = params.page_size
  if (params.search) queryParams.search = params.search
  if (params.sort) queryParams.sort = params.sort
  if (params.category) queryParams.category = params.category

  const { data } = await axiosInstance.get<LecturePageResponse>(
    '/v1/lectures',
    { params: queryParams }
  )
  return data
}
/* 북마크 */
export async function getBookmark(): Promise<BookmarkResponse> {
  const { data } = await axiosInstance.get(`/v1/lecture-bookmarks`)
  return data
}

export async function addBookmark(lectureId: number): Promise<string> {
  const { data } = await axiosInstance.post('/v1/lecture-bookmarks', {
    lecture_id: lectureId,
  })
  return data.detail
}

export async function deleteBookmark(lectureId: number): Promise<string> {
  const { data } = await axiosInstance.delete(
    `/v1/lecture-bookmarks/${lectureId}`
  )
  return data.detail
}
