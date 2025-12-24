import { Button } from '@/components/common'
import { showToast } from '@/components/common/toast/Toast'
import { FileIcon, FolderArchive, Music, FileText, X } from 'lucide-react'
import type { FileRejection } from 'react-dropzone'
import { BaseUploader } from './BaseUploader'

export type UploadedFile = {
  id: string
  name: string
  size: number
  url: string // 미리보기용 URL
  key?: string // 서버 전송용 key
  type: string
}

type FileUploaderProps = {
  files: UploadedFile[]
  onChange: (next: UploadedFile[]) => void
  maxCount?: number
  maxSize?: number
  onUploadFile?: (file: File) => Promise<{ previewUrl: string; key: string }>
}

export function FileUploader({
  files,
  onChange,
  maxCount = 3,
  maxSize = 10 * 1024 * 1024,
  onUploadFile,
}: FileUploaderProps) {
  const remain = Math.max(0, maxCount - files.length)

  const handleDrop = async (accepted: File[], rejected: FileRejection[]) => {
    rejected.forEach((rej) => {
      const reason =
        rej.file.size > maxSize ? '파일 용량 초과' : '지원하지 않는 파일 형식'
      showToast.error(reason, rej.file.name)
    })

    if (remain <= 0) {
      showToast.warning(
        '업로드 제한',
        `첨부파일은 최대 ${maxCount}개까지 업로드할 수 있습니다.`
      )
      return
    }

    const sliceEnd = Math.min(accepted.length, remain)
    if (sliceEnd === 0) return

    const nextFiles: UploadedFile[] = []
    for (let i = 0; i < sliceEnd; i += 1) {
      const file = accepted[i]
      let url = URL.createObjectURL(file)
      let key: string | undefined = undefined
      if (onUploadFile) {
        try {
          const uploaded = await onUploadFile(file)
          url = uploaded.previewUrl
          key = uploaded.key
        } catch (err) {
          showToast.error('파일 업로드 실패', (err as Error)?.message ?? '')
          continue
        }
      }
      nextFiles.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        key,
      })
    }

    onChange([...files, ...nextFiles])
  }

  const handleRemove = (id: string) => {
    const target = files.find((file) => file.id === id)
    if (target) URL.revokeObjectURL(target.url)
    onChange(files.filter((file) => file.id !== id))
  }

  const renderPreview = (file: UploadedFile) => {
    const fileName = (
      <p className="mt-1 w-full truncate px-2 text-center text-xs text-gray-600">
        {file.name}
      </p>
    )

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt="preview"
          className="flex-center aspect-video h-32 w-full bg-gray-50"
        />
      )
    }

    if (file.type.startsWith('video/')) {
      return (
        <>
          <video
            src={file.url}
            controls
            className="flex-center h-32 w-full bg-black"
          />
          {fileName}
        </>
      )
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="flex-center h-32 w-full flex-col gap-2 bg-gray-50">
          <Music size={32} />
          <audio controls src={file.url} className="w-full px-2" />
          {fileName}
        </div>
      )
    }

    if (file.type === 'application/pdf') {
      return (
        <div className="flex-center h-32 w-full flex-col gap-1 bg-red-50 text-red-600">
          <FileText size={32} />
          {fileName}
        </div>
      )
    }

    if (
      file.type.includes('zip') ||
      file.type.includes('rar') ||
      file.type.includes('x-7z-compressed')
    ) {
      return (
        <div className="flex-center h-32 w-full flex-col gap-1 bg-amber-50 text-amber-700">
          <FolderArchive size={32} />
          {fileName}
        </div>
      )
    }

    return (
      <div className="flex-center bg-custom-gray-100 text-custom-gray-600 h-32 w-full flex-col gap-1">
        <FileIcon size={32} />
        {fileName}
      </div>
    )
  }

  return (
    <BaseUploader
      maxSize={maxSize}
      multiple
      onDrop={handleDrop}
      className="min-h-[168px]"
    >
      {files.length === 0 ? (
        <div className="flex-center flex-center flex-col gap-2 py-[15px] text-center text-[#9CA3AF]">
          <FileText size={32} />
          <p className="text-[#6B7280]">
            파일을 드래그하거나 클릭하여 업로드 <br /> 최대 {maxCount}개, 각{' '}
            {Math.round(maxSize / 1024 / 1024)} MB 이하
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative flex flex-col rounded-md border border-gray-200 p-2"
            >
              {renderPreview(file)}
              <Button
                variant="ghost"
                className="absolute top-1 right-1 bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(file.id)
                }}
              >
                <X size={14} />
              </Button>
              <div className="mt-1 px-1 text-[11px] text-gray-500">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseUploader>
  )
}
