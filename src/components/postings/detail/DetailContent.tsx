import type { Recruitment } from '@/types/recruitment'
import { Download, FileText } from 'lucide-react'

interface Props {
  recruitment: Recruitment
}

export default function DetailContent({ recruitment }: Props) {
  const lectures = recruitment.lectureList || []
  const attachments = recruitment.attachments || []

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold">공고 내용</h3>
        <div className="whitespace-pre-wrap text-gray-700">
          {recruitment.content || '상세 내용이 없습니다.'}
        </div>
      </section>

      {lectures.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-xl font-bold">스터디 강의 목록</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
              >
                <img
                  src={lecture.thumbnail}
                  alt={lecture.title}
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-2 p-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {lecture.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    강사 : {lecture.instructor}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-lg font-bold text-yellow-600">
                      {lecture.price === 0 ? (
                        <h4>무료</h4>
                      ) : (
                        <h4>₩{lecture.price.toLocaleString('ko-KR')}</h4>
                      )}
                    </p>

                    <a
                      href={lecture.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-yellow-600 hover:text-yellow-800"
                    >
                      강의 보기 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {attachments.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-xl font-bold"> 첨부 파일</h3>
          <div className="space-y-3">
            {attachments.map((file) => (
              <a
                key={file.id}
                href={file.url}
                download
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                </div>
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Download className="h-4 w-4" />
                  다운로드
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
