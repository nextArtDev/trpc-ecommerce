import React from 'react'

import { getCurrentUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import MultiStepFormAuth from '@/app/[locale]/(auth)/sign-in/components/MultiSteFormAuth'
import ModalWrapper from '../components/ModalWrapper'

export const dynamic = 'force-dynamic'

const InterceptedSignInPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const locale = (await params).locale
  const session = await getCurrentUser()

  // If user is already authenticated, redirect to home
  if (session?.phoneNumber) {
    redirect('/')
  }

  return (
    <ModalWrapper>
      <MultiStepFormAuth locale={locale} />
    </ModalWrapper>
  )
}

export default InterceptedSignInPage
