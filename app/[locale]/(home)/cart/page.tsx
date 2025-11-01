import { getCurrentUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import CartContainer from './components/CartContainer'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string
  }>
}

// Generate metadata for the cart page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  const siteName = t('siteName', { defaultValue: 'Sarina Leather' })

  const title = t('meta.title', { defaultValue: 'Shopping Cart' })
  const description = t('meta.description', {
    defaultValue: 'Review and manage your shopping cart items',
  })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName,
      locale: locale,
      url: `/${locale}/cart`,
      images: [
        {
          url: '/images/og-cart.jpg',
          width: 1200,
          height: 630,
          alt: t('meta.ogImageAlt', { defaultValue: 'Shopping Cart' }),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-cart.jpg'],
    },
    alternates: {
      canonical: `/${locale}/cart`,
      languages: {
        fa: '/fa/cart',
        en: '/en/cart',
        de: '/de/cart',
        fr: '/fr/cart',
        it: '/it/cart',
      },
    },
    robots: {
      index: false, // Cart pages typically shouldn't be indexed
      follow: true,
    },
    other: {
      'page-type': 'cart',
    },
  }
}

const page = async ({ params }: Props) => {
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
