import ModalProvider from '@/providers/modal-provider'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div>
      <ModalProvider>
        {children}

        <Toaster />
      </ModalProvider>
    </div>
  )
}
