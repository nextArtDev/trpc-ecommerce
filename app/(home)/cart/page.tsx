import React from 'react'

import CartContainer from './components/CartContainer'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

const page = async () => {
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  return (
    <div>
      <CartContainer />
    </div>
  )
}

export default page
