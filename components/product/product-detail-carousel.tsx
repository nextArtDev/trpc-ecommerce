'use client'
import * as React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { ImageZoom } from '@/app/[locale]/(home)/products/components/ProductZoom'

type Props = {
  images: { url: string }[] | null
}

const ProductDetailCarousel = ({ images }: Props) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <section className="relative w-fit   mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: true }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        orientation="vertical"
        className="relative max-w-xs my-14 mx-auto"
      >
        <CarouselContent className="  -mt-1 h-96 aspect-square mx-auto ">
          {images?.map((image) => (
            <CarouselItem
              key={image.url}
              className="flex items-center justify-center  w-full h-full   "
            >
              <figure className=" border-none relative h-full w-full bg-[#eceae8]  ">
                <ImageZoom
                  className="h-full w-full"
                  zoomMargin={20}
                  backdropClassName={cn(
                    '[&_[data-rmiz-modal-overlay="visible"]]:bg-background/80'
                  )}
                >
                  <Image
                    unoptimized
                    src={image.url || '/images/fallback-image.webp'}
                    fill
                    alt="product"
                    // className="object-cover mix-blend-darken"
                    className="object-cover "
                  />
                </ImageZoom>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> <CarouselNext /> */}
        <div className="absolute top-1/3 left-3  w-fit mt-4  flex flex-col items-center justify-between gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn('h-0.5 w-0.5 bg-foreground/40', {
                'h-1 w-1 bg-foreground': current === index + 1,
              })}
            />
          ))}{' '}
        </div>
      </Carousel>
    </section>
  )
}

export default ProductDetailCarousel
