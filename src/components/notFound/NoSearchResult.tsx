import { Search } from 'lucide-react'

type searchResultProps = {
  searchResult: string | undefined
}
export default function NoSearchResult({ searchResult }: searchResultProps) {
  return (
    <div className="h-[382px] w-full justify-center rounded-2xl border border-gray-200 bg-gray-50 p-[25px] text-center md:w-[854px]">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <div className="flex h-8 w-8 items-center justify-center">
              <Search />
            </div>
          </div>
        </div>

        <p className="mb-2 text-[20px] font-bold text-gray-700">
          {`'${searchResult}'`} 에 대한 검색 결과가 없습니다
        </p>
      </div>
    </div>
  )
}
