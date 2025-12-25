import { useEffect, useRef } from 'react'

let lockCount = 0
let savedOverflow = ''

export function useBodyScrollLock(isOpen: boolean) {
  const lockedByMe = useRef(false)

  const unlock = () => {
    if (!lockedByMe.current) return
    lockedByMe.current = false
    lockCount = Math.max(0, lockCount - 1)

    if (lockCount === 0) {
      document.body.style.overflow = savedOverflow
      savedOverflow = ''
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (!lockedByMe.current) {
        lockedByMe.current = true

        if (lockCount === 0) {
          savedOverflow = document.body.style.overflow || ''
          document.body.style.overflow = 'hidden'
        }
        lockCount += 1
      }
    } else {
      unlock()
    }

    return () => {
      unlock()
    }
  }, [isOpen])
}
