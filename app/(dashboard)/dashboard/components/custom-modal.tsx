'use client'

// Provider
import { useModal } from '@/providers/modal-provider'

// UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
} from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

type Props = {
  heading?: string
  subheading?: string
  children: React.ReactNode
  defaultOpen?: boolean
  maxWidth?: string
}

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}: Props) => {
  const { isOpen, setClose } = useModal()
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogOverlay>
        <DialogContent
          dir="rtl"
          className={cn(
            'overflow-y-scroll rounded-md md:max-h-[700px] md:h-fit h-[80svh] bg-card',
            maxWidth
          )}
        >
          <DialogHeader className="pt-8 text-right  ">
            {heading && (
              <DialogTitle className="text-2xl text-right font-bold">
                {heading}
              </DialogTitle>
            )}
            {subheading && <DialogDescription>{subheading}</DialogDescription>}

            {children}
          </DialogHeader>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  )
}

export default CustomModal
