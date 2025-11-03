import { Metadata } from 'next'
import ProfileForm from './components/profile-form'
import { notFound } from 'next/navigation'
import SignOutBtn from '@/components/home/shared/SignOutBtn'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('user.profile')

  return {
    title: t('title'),
  }
}

export const dynamic = 'force-dynamic'
const Profile = async () => {
  const user = await getCurrentUser()
  const t = await getTranslations('user.profile')

  // if (!user || !user.name || !user.phoneNumber) notFound()
  if (!user || !user.name) notFound()

  const initialData = {
    name: user.name,
    phoneNumber: user.phoneNumber ?? '',
  }
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-bold text-xl">{t('title')}</h2>

        <SignOutBtn variant={'destructive'} className="" />
      </div>
      <ProfileForm initialData={initialData} />
    </div>
  )
}

export default Profile
