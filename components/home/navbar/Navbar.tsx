import { getCategoriesWithStats } from '@/lib/home/queries/products'
import React from 'react'
import MainNav from './MainNav'
import { NavigationData } from '@/lib/types/home'
import { getCurrentUser } from '@/lib/auth-helpers'

const Navbar = async () => {
  const allCategories = await getCategoriesWithStats()
  const session = await getCurrentUser()
  const navigation: NavigationData = {
    categories: allCategories.map((cat) => ({
      name: cat.name,
      featured: cat.subCategories.map((sub) => ({
        name: sub.name,
        href: `/sub-categories/${sub.url}`,
        imageSrc: sub.images[0]?.url || '', // Fallback if no image exists
        imageAlt: sub.name,
      })),
    })),
    pages: [
      { name: 'خانه', href: '/' },
      { name: 'درباره ما', href: '/about-us' },
      { name: 'ارتباط با ما', href: '/contact-us' },
      { name: 'سوالات متداول', href: '/faq' },
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
