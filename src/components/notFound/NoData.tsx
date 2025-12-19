import Data from '@/assets/icons/data.svg'
export default function NoData() {
  return (
    <div className="h-[382px] max-w-[854px] justify-center rounded-2xl border border-gray-200 bg-gray-50 p-[25px] text-center">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-6">
          <div className="bg-primary-50 flex h-20 w-20 items-center justify-center rounded-full">
            <img
              src={Data}
              alt="icon"
              className="flex h-8 w-8 items-center justify-center"
            />
          </div>
        </div>

        <p className="mb-2 text-[20px] font-bold text-gray-700">
          아직 데이터가 없습니다
        </p>
        {/* <p className="mb-[24px] text-[16px] text-gray-700">
          첫 항목을 추가해 보세요
        </p> */}
        <div>
          {/* <Button size="lg" className="w-37">
            <img src={Plus} alt="icon" />
            새로 만들기
          </Button> */}
        </div>
      </div>
    </div>
  )
}
