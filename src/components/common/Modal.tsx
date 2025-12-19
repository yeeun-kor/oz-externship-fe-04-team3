import { cn } from '@/lib/utils'
import type { ModalProps } from '@/types/modal'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import * as React from 'react'
import { Button } from './Button'
import { Separator } from './separator'

/**
 * @file Modal.tsx
 * @description 재사용 가능한 공통 Modal 컴포넌트
 *
 * @features
 * - trigger 버튼으로 모달 열기 (옵셔널)
 * - open/onOpenChange props로 프로그래밍 방식 제어 (2중 모달 지원)
 * - content: 어떤 컴포넌트든 전달 가능 (폼, 카드, 그리드 등)
 * - footer: 옵셔널, description + 버튼 커스터마이징 가능
 * - variant 디폴트: closeButton='outline', submitButton='primary'
 *
 * @example
 *  1. trigger 버튼으로 사용
 <Modal
            trigger={{ text: '지원하기', variant: 'primary', icon: <Send /> }}
            title="스터디 지원"
            description="지원서 작성"
            content={<YeeunTest></YeeunTest>}
            footer={{
              description: '*필수 항목입니다',
              closeButton: { text: '취소' },
              footerButtons: (
                <Button type="submit">
                  <Send /> 지원하기
                </Button>
              ),
            }}
          />
 *
 * @example
 *  2. trigger 버튼 없는 2중 모달창
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="제목"
 *   content={<YourComponent />}
 * />
 *
 * @author 예은
 * @updated 2025-12-12 - Framer Motion 통합
 */

export default function Modal({
  title,
  description,
  content,
  footer,
  trigger,
  open,
  onOpenChange,
  contentClassName,
  bodyClassName,
}: ModalProps) {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && (
          <DialogTrigger asChild>
            <Button variant={trigger.variant} className={trigger.className}>
              {trigger.icon}
              {trigger.text}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent
          className={cn('w-auto min-w-[400px] sm:max-w-2xl', contentClassName)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Separator
            style={{
              marginLeft: '-24px',
              marginRight: '-24px',
              width: 'calc(100% + 48px)',
              maxWidth: 'none',
            }}
          />
          <div className={cn('overflow-y-auto p-4', bodyClassName)}>
            {content}
          </div>
          {footer && (
            <>
              <Separator
                style={{
                  marginLeft: '-24px',
                  marginRight: '-24px',
                  width: 'calc(100% + 48px)',
                  maxWidth: 'none',
                }}
              />
              <DialogFooter>
                <DialogDescription>{footer.description}</DialogDescription>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    {footer.closeButton?.text && (
                      <Button variant={'outline'}>
                        {footer.closeButton?.text}
                      </Button>
                    )}
                  </DialogClose>
                  {footer.footerButtons}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

//  forceMount로 exit 애니메이션 보장
// https://www.radix-ui.com/primitives/docs/components/dialog#portal
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

//  asChild + props를 motion.div에 전달
// https://motion.dev/docs/radix
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay & typeof motion.div>) {
  return (
    <DialogPrimitive.Overlay asChild data-slot="dialog-overlay">
      <motion.div
        // initial={{ opacity: 0, scale: 0 }}
        // animate={{ opacity: 1, scale: 1 }}
        // exit={{ opacity: 0, scale: 0 }}
        className={cn('fixed inset-0 z-50 bg-black/60', className)}
        {...props}
      />
    </DialogPrimitive.Overlay>
  )
}

// DialogClose를 motion.div 외부로
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content asChild {...props}>
        <motion.div
          // initial={{ opacity: 0, scale: 0.9, y: 20 }}
          // animate={{ opacity: 1, scale: 1, y: 0 }}
          // exit={{ opacity: 0, scale: 0.9, y: 20 }}
          // transition={{
          //   type: 'spring',
          //   bounce: 0.3,
          //   duration: 0.2,
          // }}
          data-slot="dialog-content"
          className={cn(
            'bg-background fixed top-[50%] left-[50%] z-50',
            'flex max-h-[80dvh] w-sm sm:max-w-lg',
            'translate-x-[-50%] translate-y-[-50%]',
            'flex-col overflow-hidden rounded-lg border shadow-lg',
            className
          )}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className="absolute top-4 right-4 z-50 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 p-4 sm:text-left md:p-6', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-row justify-between gap-2 p-4 md:p-6',
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
}
