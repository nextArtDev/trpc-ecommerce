import { FC } from 'react'
import MainPageCarousel from './main-page-carousel'
import { HomepageProduct } from '@/lib/types/home'
import { getTranslations } from 'next-intl/server'
import { RevealText } from '../shared/reveal-text'
interface NewestProps {
  items: Partial<HomepageProduct>[]
}

const Newest: FC<NewestProps> = async ({ items }) => {
  const newestSellers = await getTranslations('newestSellers')
  return (
    <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
      {/* <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
        {newestSellers('title')}
      </h2> */}
      <RevealText
        text={newestSellers('title')}
        id="newest-sellers-heading"
        className="w-full mx-auto font-display text-center! max-w-xl text-2xl leading-none text-neutral-50 md:text-3xl lg:text-4xl "
        staggerAmount={0.1}
        duration={1.0}
      />
      <MainPageCarousel items={items} />
    </section>
  )
}

export default Newest
