import { getDiscount } from '@/helpers/getDiscount'
import getRatingStarsIcon from '@/helpers/getRatingStarsIcon'
import { LectureLevel } from '@/mappers/lectures/lecture'
import type { Lecture } from '@/types/lecture'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../common/Modal'
import { Badge } from '../common/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../common/card'
import { Item, ItemContent, ItemDescription, ItemTitle } from '../common/item'
import { Skeleton } from '../common/skeleton'

type LectureReviewCardProps = {
  open: boolean
  setOpen: (open: boolean) => void
  lecture: Lecture
}

export default function LectureReviewCard({
  open,
  setOpen,
  lecture,
}: LectureReviewCardProps) {
  const {
    title,
    instructor,
    thumbnail_img_url,
    difficulty,
    original_price,
    discounted_price,
    platform,
    average_rating,
    categories,
    reviews,
  } = lecture

  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="m-0 p-0 **:data-[slot='dialog-close']:bg-gray-300">
        <VisuallyHidden asChild>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>
        <Card>
          <CardHeader>
            <CardAction className="absolute z-10 justify-between px-3 py-3">
              <div className="top-2 flex flex-col gap-2">
                <Badge variant={'platform'}>{platform}</Badge>
                <Badge variant={'discount'}>
                  {getDiscount(discounted_price, original_price)}% 할인
                </Badge>
              </div>
            </CardAction>
            {/* IMG 로딩중이면 스켈레톤  */}
            {!imgLoaded && (
              <Skeleton className="h-auto min-h-[210px] min-w-[390px]" />
            )}
            <img
              src={thumbnail_img_url}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              className="aspect-auto max-h-[210px] w-full object-cover"
            />
          </CardHeader>
          <div className="review-content-section overflow-y-auto">
            <CardContent>
              <div className="Card-Content-badge flex gap-1">
                <Badge variant={'success'}>{LectureLevel[difficulty]}</Badge>
                {categories?.map((i) => (
                  <Badge key={i.id}>{i.name}</Badge>
                ))}
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{instructor}</CardDescription>
              {getRatingStarsIcon(average_rating)}
              <div className="Card-Content-price flex items-center gap-2">
                <h4>₩{discounted_price.toLocaleString('ko-KR')}</h4>
                <h6 className="text-sm text-gray-400 line-through">
                  ₩{original_price.toLocaleString('ko-KR')}
                </h6>
              </div>
            </CardContent>
            <CardFooter className="mt-2 flex w-full flex-col items-start gap-2">
              <CardTitle className="mb-2 text-left">리뷰보기</CardTitle>
              {reviews.length === 0 ? (
                <Item className="w-full">
                  <ItemContent>
                    <ItemTitle>{getRatingStarsIcon(0)}</ItemTitle>
                    <ItemDescription>리뷰가 없습니다</ItemDescription>
                  </ItemContent>
                </Item>
              ) : (
                reviews.map((i) => (
                  <Item key={i.id} className="w-full">
                    <ItemContent>
                      <ItemTitle>{getRatingStarsIcon(i.rating)}</ItemTitle>
                      <ItemDescription>{i.content}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))
              )}
            </CardFooter>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
