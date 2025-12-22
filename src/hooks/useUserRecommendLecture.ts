import { getUserRecommendsLecturesApi } from '@/api/lecture'
import { useAuthStore } from '@/store/userStore'
import { useQuery } from '@tanstack/react-query'

export default function useUserRecommendLecture(max_count: number) {
  const { loginState } = useAuthStore()
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['lecture-recommend', max_count],
    queryFn: async () => {
      const data = await getUserRecommendsLecturesApi({ max_count }) //객체로 전달하기!!
      return data
    },
    enabled: loginState === 'USER',
  })

  return { isError, isPending, error, data }
}
