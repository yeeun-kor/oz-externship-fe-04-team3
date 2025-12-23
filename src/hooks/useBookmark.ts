import { addBookmark, deleteBookmark, getBookmark } from '@/api/lecture'
import { showToast } from '@/components/common/toast/Toast'
import { useAuthStore } from '@/store/userStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
/* 북마크 처리 커스텀 리액트쿼리 (로그인상태 boolean) */
export function useBookmark() {
  //queryClient 호출 invalidateQueries 사용 (캐시를 무효화 → 데이터 다시 fetch )
  const queryClient = useQueryClient()
  const { loginState } = useAuthStore()

  //목록 불러오기
  const getBookmarkQuery = useQuery({
    queryKey: ['bookmarkList'],
    queryFn: getBookmark,
    enabled: loginState === 'USER',
  })

  //북마크 추가 useMutation (캐시무효화 사용되는 쿼리키)
  const addBookmarkMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (msg) => {
      showToast.success('북마크 추가', msg)
      queryClient.invalidateQueries({ queryKey: ['bookmarkList'] })
    },
    onError: (error) => {
      //400에러인경우
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          showToast.error(
            `${error.status} 에러 발생`,
            `${error.response?.data.error_detail.lecture_id}`
          )
        }
      } else {
        showToast.error(`${error}`, `${error.message}`)
      }
    },
  })

  //북마크 삭제 useMutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (msg) => {
      showToast.warning('북마크 삭제', msg)
      queryClient.invalidateQueries({ queryKey: ['bookmarkList'] })
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        showToast.error(`${error}`, `${error.message}`)
      }
    },
  })

  return { addBookmarkMutation, deleteBookmarkMutation, getBookmarkQuery }
}
