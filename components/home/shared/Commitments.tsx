// components/Commitments.tsx
'use client'

import { useTranslations, useLocale } from 'next-intl' // 1. IMPORT HOOKS
import { FadeIn } from '@/components/shared/fade-in'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { RevealText } from '@/components/shared/reveal-text'
import { cn } from '@/lib/utils'

// 2. REMOVE THE HARDCODED 'items' ARRAY
// We will now get this data from our translation files.

export default function Commitments() {
  // 3. GET THE TRANSLATION FUNCTION AND CURRENT LOCALE
  const t = useTranslations('commitments')
  const locale = useLocale()

  // 4. GET THE ITEMS FROM TRANSLATIONS USING .raw()
  // .raw() is used to get the entire array of objects as-is.
  const items = t.raw('description') as Array<{
    id: string
    title: string
    description: string
    url: string
  }>

  const carouselRef = useRef(null)
  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })

  // 5. DETERMINE DIRECTION BASED ON LOCALE
  const isRtl = locale === 'fa'

  return (
    <section className="flex flex-col items-center gap-6 w-full overflow-x-hidden">
      {/* <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
        {t('title')}
      </h2> */}
      <RevealText
        text={t('title')}
        id="commitments-sellers-heading"
        className="w-full mx-auto font-display text-center! max-w-xl text-2xl leading-none   md:text-3xl lg:text-4xl "
        staggerAmount={0.1}
        duration={1.0}
      />
      <Carousel
        opts={{
          align: isRtl ? 'start' : 'end',
          // 7. SET DIRECTION DYNAMICALLY
          direction: isRtl ? 'rtl' : 'ltr',
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
        // 8. SET DIR ATTRIBUTE DYNAMICALLY
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full"
      >
        <CarouselContent className="">
          {items.map((item, i) => (
            <CarouselItem
              key={item.id}
              className="mx-auto basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <FadeIn
                className="translate-y-5"
                vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
              >
                <div className="flex flex-col border-none rounded-none gap-2 md:gap-4">
                  <figure className="relative w-full aspect-square bg-[#eceae8] border-none rounded-none">
                    <Image
                      unoptimized
                      src={item.url || '/images/fallback-image.webp'}
                      fill
                      alt={item.title} // The alt text is now automatically translated
                      className="object-cover mix-blend-darken"
                    />
                  </figure>
                  <article className="flex flex-col gap-3 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base text-right">
                    <RevealText
                      text={item.title} // The title is now automatically translated
                      id={item.title}
                      className={cn(
                        'font-bold ',
                        isRtl ? 'text-lg text-right' : 'text-base text-left!'
                      )}
                      staggerAmount={0.2}
                      duration={0.8}
                    />
                    <FadeIn
                      className="translate-y-4"
                      vars={{ delay: 0.6, duration: 0.6 }}
                    >
                      <p className="text-sm text-justify">{item.description}</p>{' '}
                      {/* Description is now translated */}
                    </FadeIn>
                  </article>
                </div>
              </FadeIn>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel navigation buttons remain the same */}
        <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
        <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
      </Carousel>
    </section>
  )
}
