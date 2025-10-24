'use client' // Added if not present in parent; required for client components
import { FadeIn } from '@/components/shared/fade-in'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { RevealText } from '@/components/shared/reveal-text'

const items = [
  {
    id: '1',
    title: 'عشق به چرم اصیل',
    description:
      'ما تنها از مرغوب‌ترین چرم‌های طبیعی تمام‌دانه (Full-grain) استفاده می‌کنیم. این چرم‌ها با دوخت دقیق و هنرمندانه، به محصولاتی ماندگار و منحصربه‌فرد تبدیل می‌شوند که با گذر زمان، زیباتر و اصیل‌تر خواهند شد. تضمین می‌کنیم که هیچ‌یک از محصولات ما از چرم مصنوعی (پلاستیکی) نیست.',
    url: '/images/commit1.webp', // تصویر از یک رول چرم زیبا یا هنرمند در حال کار
  },
  {
    id: '2',
    title: 'ساختِ اخلاق‌مدار و مسئولانه',
    description:
      'تولید در کارگاه خودمان تحت شرایطی عادلانه و محترمانه انجام می‌شود. ما به محیط زیست و حقوق انسان‌ها احترام می‌گذاریم و در فرآیند تولید، تا حد امکان از مواد اولیه بازیافتی و کم‌آب‌بر استفاده کرده و از آلاینده‌ها دوری می‌کنیم. قدم‌های کوچک ما برای آینده‌ای سبزتر.',
    url: '/images/commit2.webp', // تصویر از کارگاه روشن و مرتب یا هنرمندان در حال کار
  },
  {
    id: '3',
    title: 'توجه وسواس‌گونه به جزئیات',
    description:
      'به هیچ چیز جز کمال راضی نیستیم. از انتخاب یک قطعه چرم تا آخرین کوک و نصب یک قفل، تمامی مراحل با دقتی وسواس‌گونه و عشقی هنرمندانه انجام می‌گیرد. هر کیف نه یک کالا، که یک اثر هنری است که نام شما را بر خود دارد.',
    url: '/images/commit3.jpg', // تصویر ماکرو از دوخت ظریف یک دسته یا جزئیات یک قفل
  },
]
export default function Commitments() {
  const carouselRef = useRef(null)

  const isInView = useInView(carouselRef, { once: true, amount: 0.3 })
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        // loop: true, // Added for infinite looping; remove if not wanted
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
      dir="rtl"
      className="w-full "
    >
      <CarouselContent className=" ">
        {/* Responsive negative margin to offset item padding */}
        {items.map((item, i) => (
          <CarouselItem
            key={item.id}
            className=" mx-auto basis-1/2   md:basis-1/3 lg:basis-1/4   xl:basis-1/5"
            /* Adjusted basis for better fit (e.g., 2 on mobile, 3 on md, 4 on lg, 5 on xl); made padding responsive */
          >
            <FadeIn
              className="translate-y-5"
              vars={{ delay: 0.2 * i, duration: 0.3, ease: 'sine.inOut' }}
            >
              <div className="flex flex-col border-none rounded-none gap-2 md:gap-4">
                {/* Moved gap-4 here to space image and text */}
                <figure className="relative w-full aspect-square bg-[#eceae8] border-none rounded-none">
                  {/* Changed to figure for semantic; simplified, removed min-h to let aspect-square handle */}
                  <Image
                    unoptimized
                    src={item.url || '/images/fallback-image.webp'}
                    fill
                    alt={item.title}
                    className="object-cover mix-blend-darken" // Uncommented; remove if not needed
                  />
                </figure>
                <article className="flex flex-col gap-3 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base  text-right">
                  <RevealText
                    text={item.title}
                    id={item.title}
                    className="font-bold text-lg"
                    staggerAmount={0.2}
                    duration={0.8}
                  />
                  {/* <p className="font-bold text-lg">{item.title}</p> */}
                  <FadeIn
                    className=" translate-y-4 "
                    vars={{ delay: 0.6, duration: 0.6 }}
                  >
                    <p className="text-sm text-justify">{item.description}</p>
                  </FadeIn>
                </article>
              </div>
            </FadeIn>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}
