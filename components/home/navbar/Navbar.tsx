import { getCategoriesWithStats } from '@/lib/home/queries/products'
import MainNav from './MainNav'
import { NavigationData } from '@/lib/types/home'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getLocale, getTranslations } from 'next-intl/server'

const Navbar = async () => {
  const allCategories = await getCategoriesWithStats()
  const session = await getCurrentUser()

  const locale = await getLocale()
  const t = await getTranslations('navigation')

  // Transform categories to get translated names
  const transformedCategories = allCategories.map((cat) => ({
    ...cat,
    name: cat.translations[0]?.name || '',
    subCategories: cat.subCategories.map((sub) => ({
      ...sub,
      name: sub.translations[0]?.name || '',
    })),
  }))

  const navigation: NavigationData = {
    categories: transformedCategories.map((cat) => ({
      name: cat.name,
      featured: cat.subCategories.map((sub) => ({
        name: sub.name,
        href: `/${locale}/sub-categories/${sub.url}`,
        imageSrc: sub.images[0]?.url || '',
        imageAlt: sub.name,
      })),
    })),
    pages: [
      { name: t('home'), href: `/${locale}` },
      { name: t('about'), href: `/${locale}/about-us` },
      { name: t('contact'), href: `/${locale}/contact-us` },
      { name: t('faq'), href: `/${locale}/faq` },
    ],
  }
  //   console.log(navigation)
  return (
    <div>
      <MainNav navigation={navigation} session={session} />
    </div>
  )
}

export default Navbar
