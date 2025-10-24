import { getCurrentUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import CartContainer from './components/CartContainer'

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
