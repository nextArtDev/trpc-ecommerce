'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export default function ModalWrapper({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => !open && router.back()}
      modal={true}
    >
      {/* <DialogHeader className="sr-only">ورود/ثبت نام</DialogHeader> */}
      <DialogContent
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-sm border-background/10 bg-background/5 backdrop-blur-sm rounded-none"
      >
        <DialogTitle className="sr-only">ورود/ثبت نام</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
