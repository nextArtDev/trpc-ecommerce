'use client'
import React, { useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { FadeIn } from '../shared/fade-in'
import { useInView } from 'framer-motion'
import { TransitionLink } from '../home/shared/TransitionLink'
import { SearchProduct } from '@/lib/types/home'
import { getName } from '@/lib/translation-utils'
import { useLocale, useTranslations } from 'next-intl'

type Props = {
  product: SearchProduct
}

const ProductCard = ({ product }: Props) => {
  const locale = useLocale()
  const t = useTranslations('product')

  const imageUrls = React.useMemo(
    () => [
      ...(product.images?.map((img) => img.url) || []),
      ...(product.variants?.flatMap((vr) => vr?.images.map((im) => im.url)) ||
        []),
    ],
    [product.images, product.variants]
  )

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const carouselRef = useRef(null)

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })

  // Get the first variant's price
  const firstVariant = product.variants?.[0]
  const price = firstVariant?.price || 0
  const discount = firstVariant?.discount || 0
  const discountedPrice = price - (price * discount) / 100

  return (
    <FadeIn vars={{ delay: 0.25, duration: 0.25, ease: 'sine.inOut' }}>
      <div ref={carouselRef} className="w-full aspect-square relative">
        {!imageUrls || imageUrls.length === 0 ? (
          <div className="w-full h-full bg-[#eceae8] flex items-center justify-center">
            <p className="text-gray-500 text-xs">{t('noImage')}</p>
          </div>
        ) : (
          <TransitionLink
            href={`/${locale}/products/${product.slug}`}
            className="my-6"
          >
            <Carousel
              opts={{
                align: 'start',
                direction: locale === 'fa' ? 'rtl' : 'ltr',
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
              dir={locale === 'fa' ? 'rtl' : 'ltr'}
              setApi={setApi}
              className="w-full h-full"
            >
              <CarouselContent className="">
                {imageUrls.map((url) => (
                  <CarouselItem key={url}>
                    <Card className="h-full w-full border-none rounded-none bg-[#eceae8] p-0">
                      <CardContent className="relative flex aspect-square items-center justify-center p-0 h-full">
                        <Image
                          unoptimized
                          src={url || '/images/fallback-image.webp'}
                          alt={getName(product.translations)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {count > 1 && (
              <div className="absolute -bottom-px left-px right-px flex items-center gap-x-0.5 z-10">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      'h-px md:h-[1.5px] flex-1 rounded-full',
                      current === index
                        ? 'bg-muted-foreground'
                        : 'bg-muted-foreground/30',
                      'transition-colors duration-200 ease-in-out'
                    )}
                    aria-label={t('goToSlide', { slide: index + 1 })}
                  />
                ))}
              </div>
            )}
          </TransitionLink>
        )}
      </div>

      {/* The rest of your card details */}
      <div className="pt-2 pb-4">
        <div className="flex flex-col gap-1 items-start px-2 text-pretty text-xs md:text-sm">
          <p className="font-semibold">
            {product.category && getName(product.category.translations)}
          </p>
          <p className="font-bold">{getName(product.translations)}</p>
          <div className="flex items-center gap-1">
            {discount > 0 && (
              <p className="text-red-500">
                {discountedPrice.toLocaleString(locale)} {t('currency')}
              </p>
            )}
            <p className={cn(discount > 0 && 'line-through text-gray-500')}>
              {price.toLocaleString(locale)} {t('currency')}
            </p>
          </div>
          <div className="flex gap-0.5 items-center">
            {product.variants?.map((vr) => (
              <span
                key={vr.color.name}
                style={{ background: vr.color.hex }}
                className="size-3 border"
                title={vr.color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default ProductCard
