'use client'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleWishlistItem } from '@/lib/home/actions/user'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FC, useActionState, useOptimistic, useTransition } from 'react'

interface BookmarkBtnProps {
  productId: string
  isInWishList: boolean
}

const BookmarkBtn: FC<BookmarkBtnProps> = ({ productId, isInWishList }) => {
  const path = usePathname()
  const [isPending, startTransition] = useTransition()

  // Optimistic state for immediate UI feedback
  const [optimisticIsInWishList, setOptimisticIsInWishList] = useOptimistic(
    isInWishList,
    (currentState: boolean) => !currentState
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, toggleWishedAction, pending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (prevState: any, formData: FormData) => {
      // Start optimistic update
      startTransition(() => {
        setOptimisticIsInWishList(!optimisticIsInWishList)
      })

      // Call the actual server action
      const result = await toggleWishlistItem(
        path,
        productId,
        prevState,
        formData
      )
      return result
    },
    {
      errors: {},
    }
  )

  return (
    <form action={toggleWishedAction}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            disabled={pending || isPending}
            type="submit"
          >
            <Bookmark
              size={32}
              className={cn(
                'cursor-pointer w-10 h-10 scale-150',
                optimisticIsInWishList ? 'fill-indigo-600' : 'fill-none'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isInWishList ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          </p>
        </TooltipContent>
      </Tooltip>
    </form>
  )
}

export default BookmarkBtn
