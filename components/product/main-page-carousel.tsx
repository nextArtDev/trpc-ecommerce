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

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
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
      dir="rtl"
      className="w-full"
      ref={carouselRef}
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {items.map((item, i) => (
          <CarouselItem
            key={item.id}
            className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5"
          >
            <FadeIn
              className="translate-y-5"
              vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
            >
              <TransitionLink
                href={`/products/${item.slug}`}
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
                      alt={item.name!}
                      className={cn(
                        'object-cover mix-blend-darken',
                        !item.variants?.map((vr) => vr.quantity) && 'grayscale'
                      )} // Uncommented; remove if not needed
                    />
                  </figure>
                )}
                <article className="flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base">
                  <p className="font-semibold">{item.category!.name}</p>
                  {/* <p
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  className="font-bold line-clamp-2 text-justify "
                  ></p> */}
                  <p className="font-bold">{item.name}</p>
                  {!!item.variants && (
                    <>
                      {item.variants.map((variant, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {!!variant.discount && (
                            <p className="">
                              {variant.price -
                                variant.price * (variant.discount / 100)}{' '}
                              تومان
                            </p>
                          )}
                          <p
                            className={cn(
                              'text-red-500',
                              variant.discount && 'line-through'
                            )}
                          >
                            {variant.price} تومان
                          </p>
                        </div>
                      ))}
                    </>
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
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
