import { FC } from 'react'
import MainPageCarousel from './main-page-carousel'
import { HomepageProduct } from '@/lib/types/home'
import { getTranslations } from 'next-intl/server'
interface NewestProps {
  items: Partial<HomepageProduct>[]
}

const Newest: FC<NewestProps> = async ({ items }) => {
  const newestSellers = await getTranslations('newestSellers')
  return (
    <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
      <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
        {newestSellers('title')}
      </h2>
      <MainPageCarousel items={items} />
    </section>
  )
}

export default Newest
