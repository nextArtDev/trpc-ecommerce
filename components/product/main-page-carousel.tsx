'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
import { HomepageProduct } from '@/lib/types/home'
import { FadeIn } from '../shared/fade-in'
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { TransitionLink } from '../home/shared/TransitionLink'
import { useLocale, useTranslations } from 'next-intl'
import {
  // createTranslationHelpers,
  ProductTranslationFields,
  transformProductWithTranslations,
  transformWithTranslations,
  TranslatableEntity,
} from '@/lib/translation-utils'

export type item = {
  id: string
  link: string
  category: string
  title: string
  price: number
  imageSrc: string
}

type MainPageCarousel = {
  items: Partial<HomepageProduct>[]
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  const carouselRef = useRef(null)
  const locale = useLocale()
  const t = useTranslations('product')
  // const { getTranslationField } = createTranslationHelpers()

  const isRTL = locale === 'fa'
  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: isRTL ? 'rtl' : 'ltr',
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
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full"
      ref={carouselRef}
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {items.map((item, i) => {
          const displayProduct = item.translations
            ? transformProductWithTranslations(
                item as TranslatableEntity<ProductTranslationFields>
              )
            : { name: '', description: '', keywords: '' }

          // Transform category if it exists
          const displayCategory = item.category?.translations
            ? transformWithTranslations(
                item.category as TranslatableEntity<ProductTranslationFields>
              )
            : { name: '', description: '' }

          // Calculate price with discount
          const firstVariant = item.variants?.[0]
          const price = firstVariant?.price || 0
          const discount = firstVariant?.discount || 0
          const discountedPrice = price - (price * discount) / 100
          const isInStock = firstVariant?.quantity
          return (
            <CarouselItem
              key={item.id}
              className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5"
            >
              <FadeIn
                className="translate-y-5"
                vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
              >
                <TransitionLink
                  href={`/${locale}/products/${item.slug}`}
                  className="flex flex-col border-none rounded-none bg-transparent gap-4" /* Switched to flex-col for consistent height; moved gap here */
                >
                  {!!item.images && (
                    <figure className="relative w-full aspect-square bg-[#eceae8] border-none rounded-none">
                      {' '}
                      {/* Fixed aspect-square for uniform image height */}
                      <Image
                        unoptimized
                        src={
                          item.images.map((img) => img.url)[0] ||
                          '/images/fallback-image.webp'
                        }
                        fill
                        alt={displayProduct.name}
                        className={cn(
                          'object-cover mix-blend-darken',
                          // !item.variants?.map((vr) => vr.quantity) &&
                          !isInStock && 'grayscale'
                        )} // Uncommented; remove if not needed
                      />
                    </figure>
                  )}
                  <article className="flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base">
                    <p className="font-semibold">{displayCategory.name}</p>
                    {/* <p
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  className="font-bold line-clamp-2 text-justify "
                  ></p> */}
                    <p className="font-bold">{displayProduct.name}</p>
                    {firstVariant && (
                      <div className="flex items-center gap-1">
                        {discount > 0 && (
                          <p className="text-red-500">
                            {discountedPrice.toLocaleString(locale)}{' '}
                            {t('currency')}
                          </p>
                        )}
                        <p
                          className={cn(
                            discount > 0 && 'line-through text-gray-500'
                          )}
                        >
                          {price.toLocaleString(locale)} {t('currency')}
                        </p>
                      </div>
                    )}
                    {/* <p>
                    {item.variants.map((variant) =>
                      variant.discount ? variant.price * variant.discount : variant.price
                    )}
                  </p> */}
                  </article>
                </TransitionLink>
              </FadeIn>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
