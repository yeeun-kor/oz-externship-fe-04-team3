import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/common/card'
import { Skeleton } from '../common/skeleton'

export default function LectureCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-[210px] w-full" />
      </CardHeader>

      <CardContent>
        <div className="mb-2 flex gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="mb-2 h-5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
      <CardFooter className="relative">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="absolute top-6 right-2 h-9 w-28" />
      </CardFooter>
    </Card>
  )
}
