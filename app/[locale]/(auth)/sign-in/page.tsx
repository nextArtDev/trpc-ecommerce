import MultiStepFormAuth from './components/MultiSteFormAuth'

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import heroImage from '@/public/images/hero-image.webp'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: // searchParams,
{
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale
  const t = await getTranslations({ locale, namespace: 'auth' })

  return {
    title: t('title'),
    description: t('signInWithGoogle'),
  }
}

const SignInPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const locale = (await params).locale

  const session = await getCurrentUser()

  if (session?.phoneNumber || session?.email) {
    redirect(`/${locale}`)
  }

  // const t = await getTranslations({ locale, namespace: 'auth' })

  return (
    <section
      aria-label="sign-in"
      className="relative w-full h-full min-h-screen"
    >
      <Image fill src={heroImage} alt="Store Logo" className="object-cover" />
      <div className="absolute inset-0 bg-background/5 backdrop-blur-xs" />
      <Link
        href={`/${locale}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          locale === 'fa'
            ? 'absolute top-10 left-10'
            : 'absolute top-10 right-10',
          'flex gap-1 font-bold'
        )}
      >
        {locale === 'fa' ? 'بازگشت' : 'Back'} {locale === 'fa' ? '←' : '→'}
      </Link>
      <div className="relative w-full h-full flex items-center justify-center max-w-sm mx-auto">
        <MultiStepFormAuth locale={locale} />
      </div>
    </section>
  )
}

export default SignInPage
