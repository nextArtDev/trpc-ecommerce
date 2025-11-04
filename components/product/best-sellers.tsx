import { FC } from 'react'
import MainPageCarousel from './main-page-carousel'
import { HomepageProduct } from '@/lib/types/home'
import { getTranslations } from 'next-intl/server'
import { RevealText } from '../shared/reveal-text'

interface BestSellersProps {
  items: Partial<HomepageProduct>[]
}

const BestSellers: FC<BestSellersProps> = async ({ items }) => {
  const bestSellers = await getTranslations('bestSellers')
  return (
    <section className="w-full h-full flex flex-col gap-8 py-8 px-3">
      <RevealText
        text={bestSellers('title')}
        id="best-sellers-heading"
        className="w-full mx-auto font-display text-center! max-w-xl text-2xl leading-none text-neutral-50 md:text-3xl lg:text-4xl "
        staggerAmount={0.1}
        duration={1.0}
      />

      {/* <h2 className=" sr-only text-xl md:text-3xl font-bold uppercase text-center py-8 ">
        {bestSellers('title')}
      </h2> */}
      <MainPageCarousel items={items} />
    </section>
  )
}

export default BestSellers
