import { ROUTE_PATHS } from '@/constant/route'
import { Link } from 'react-router-dom'

function Guest() {
  return (
    <div className="ml-auto flex items-center">
      <div className="flex items-center gap-8 text-base text-gray-700">
        <div className="hidden md:flex md:gap-8">
          <a href="/courses" className="hover:text-primary-600 cursor-pointer">
            강의 목록
          </a>
          <a
            href={ROUTE_PATHS.STUDY}
            className="hover:text-primary-600 cursor-pointer"
          >
            스터디 그룹
          </a>
          <a
            href="/recruitments"
            className="hover:text-primary-600 cursor-pointer"
          >
            구인 공고
          </a>
        </div>
        <a
          href={ROUTE_PATHS.LOGIN}
          className="hover:text-primary-600 text-base md:cursor-pointer md:text-lg"
        >
          로그인
        </a>
      </div>
      <Link to={ROUTE_PATHS.SIGNUP}>
        <button className="bg-primary-500 text-basic-white ml-4 h-10 w-[90.89px] rounded-lg text-base md:text-lg">
          회원가입
        </button>
      </Link>
    </div>
  )
}
export default Guest
