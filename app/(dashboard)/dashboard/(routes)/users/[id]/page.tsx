import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import UpdateUserForm from './components/update-user-form'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'آپدیت کاربر',
}

const AdminUserUpdatePage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const user = await prisma.user.findFirst({
    where: { id },
  })

  if (!user) notFound()

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">آپدیت اطلاعات کاربر</h1>
      <UpdateUserForm user={user} />
    </div>
  )
}

export default AdminUserUpdatePage
