'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
export function ShareButton() {
  const [url, setUrl] = useState('')

  // Get the current page URL once the component mounts on the client
  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this product',
          text: 'I found this amazing product you might like!',
          url: url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        // User might have cancelled sharing, so we don't show an error toast.
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('لینک کپی شد!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('خطا در کپی لینک')
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={handleCopyLink}>
          <Share2
            onClick={handleNativeShare}
            size={32}
            className={cn('cursor-pointer w-10 h-10 scale-150')}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>کپی لینک</p>
      </TooltipContent>
    </Tooltip>
  )
}
