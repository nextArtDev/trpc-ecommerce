import { getCurrentUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import CartContainer from './components/CartContainer'

export const dynamic = 'force-dynamic'

const page = async ({
  params,
}: {
  params: Promise<{
    locale: string
  }>
}) => {
  const locale = (await params).locale
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  return (
    <div>
      <CartContainer locale={locale} />
    </div>
  )
}

export default page
