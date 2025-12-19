import { Button } from '@/components/common'
import { ROUTE_PATHS } from '@/constant/route'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex-center w-full">
      <div className="flex h-[513px] w-[854px] items-center rounded-2xl border border-gray-200 bg-gray-50 p-[25px]">
        <div className="text-center">
          <h4 className="text-primary-500 text-[96px]">404</h4>
          <p className="mb-2 text-[20px] font-bold text-gray-700">
            찾으시는 페이지가 없습니다
          </p>

          <div className="flex h-[97px] w-[804px] items-center justify-center text-center">
            <p className="px-[130px] text-[16px] text-gray-700">
              방문하시려는 페이지의 주소가 잘못 입력되었거나, 삭제되어 사용하실
              수 없습니다.입력하신 주소가 정확한지 다시 한번 확인해 주세요.
            </p>
          </div>
          <div>
            <Button
              size="lg"
              className="w-37"
              onClick={() => navigate(ROUTE_PATHS.HOME)}
            >
              홈으로 가기
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
