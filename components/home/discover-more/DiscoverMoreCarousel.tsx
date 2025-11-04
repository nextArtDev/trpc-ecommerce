'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { SubCategoryForHomePage } from '@/lib/types/home'
import { FadeIn } from '@/components/shared/fade-in'
import { useInView } from 'framer-motion'
import { TransitionLink } from '../shared/TransitionLink'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { createTranslationHelpers } from '@/lib/translation-utils'
import { RevealText } from '@/components/shared/reveal-text'

export default function DiscoverMoreCarousel({
  subCategories,
}: {
  subCategories: SubCategoryForHomePage[]
}) {
  const carouselRef = useRef(null)
  const locale = useLocale()
  const t = useTranslations('discoverMore')
  const { getTranslationField } = createTranslationHelpers()

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })

  return (
    <section className="flex flex-col w-full! h-full! gap-6  text-center py-12 ">
      {/* <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8  ">
        {t('title')}
      </h2> */}
      <RevealText
        text={t('title')}
        id="discover-more-heading"
        className="w-full mx-auto font-display text-center! max-w-xl text-2xl leading-none text-neutral-50 md:text-3xl lg:text-4xl "
        staggerAmount={0.1}
        duration={1.0}
      />
      <Carousel
        opts={{
          align: 'start',
          direction: locale === 'fa' ? 'rtl' : 'ltr', // Adjust direction based on locale
          loop: true,
        }}
        plugins={
          isInView
            ? [
                Autoplay({
                  delay: 3000,
                }),
              ]
            : []
        }
        ref={carouselRef}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        className="w-full"
      >
        <CarouselContent className="">
          {subCategories.map((item, i) => {
            const categoryName = getTranslationField(item.translations, 'name')
            const imageUrl =
              item.images?.[0]?.url || '/images/fallback-image.webp'

            return (
              <CarouselItem
                key={item.id}
                className="pr-1 basis-1/2 md:basis-1/3 xl:basis-1/4 w-full mx-auto"
              >
                <FadeIn
                  vars={{ delay: 0.2 * i, duration: 0.5, ease: 'sine.inOut' }}
                >
                  <div className="w-full aspect-square bg-transparent">
                    <figure className="relative w-full h-full bg-[#eceae8] border-none rounded-none">
                      <Image
                        unoptimized
                        src={imageUrl}
                        fill
                        alt={categoryName}
                        className="object-cover"
                      />
                      <article className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-linear-to-b from-secondary/5 to-secondary/20 px-2 py-3 text-center text-2xl font-semibold text-background">
                        {/* {categoryName} */}
                        <RevealText
                          text={categoryName}
                          id="category-name-title"
                          className="w-full mx-auto font-display text-center! max-w-xl text-2xl leading-none  md:text-3xl lg:text-4xl mix-blend-difference!"
                          staggerAmount={0.1}
                          duration={1.0}
                        />
                        <TransitionLink
                          href={`/${locale}/sub-categories/${item.url}`}
                          className="bg-linear-to-b from-secondary/5 to-secondary/30 border rounded-none px-1.5 py-1 text-center text-base backdrop-blur-[2px]"
                        >
                          {t('viewCategory', { name: categoryName })}
                        </TransitionLink>
                      </article>
                    </figure>
                  </div>
                </FadeIn>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
