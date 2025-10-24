import { Bounded } from '@/components/shared/Bounded'
import Image from 'next/image'
import heroImage from '@/public/images/hero-image.webp'
// import heroImage from '../../../public/images/bg.jpg'

import { FadeIn } from '@/components/shared/fade-in'
import { RevealText } from '@/components/shared/reveal-text'
import { SubCategoryForHomePage } from '@/lib/types/home'
import { TransitionLink } from '../shared/TransitionLink'

const Hero = ({
  subCategories,
}: {
  subCategories: SubCategoryForHomePage[]
}) => {
  return (
    <Bounded
      className={`relative w-full h-full  overflow-hidden bg-foreground dark:bg-background backdrop-blur-lg text-background  text-center`}
    >
      <FadeIn
        vars={{ scale: 1, opacity: 0.5 }}
        className=" absolute inset-0 pt-12 min-h-svh origin-top lg:h-svh motion-safe:scale-125 motion-reduce:opacity-50 "
      >
        <Image
          unoptimized
          src={heroImage}
          priority
          fetchPriority="high"
          alt="hero image"
          fill
          className="object-cover origin-top "
        />
      </FadeIn>
      <div className="relative flex h-screen flex-col justify-center items-center">
        <RevealText
          // text="Effortless Elegance"
          text="کارگاه چرم سارینا"
          id="hero-heading"
          className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
          staggerAmount={0.2}
          duration={1.7}
        />
        <FadeIn
          // important factor to go up or down: translate-y-8
          className="mt-6 max-w-md translate-y-8  text-lg text-neutral-100"
          vars={{ delay: 1, duration: 1.3 }}
        >
          <p className=" ">
            {/* An expression of quiet luxury, Côte Royale is designed for the
            womans who commands attention without seeking it. A reflection of
            nature’s raw beauty. */}
            محصولات ما برای زنانی طراحی شده‌اند که به دنبال بیان اصیل شخصیت خود
            است، نه نشان دادن آن. هر کیف، تجلی زیبایی خام و طبیعی و هنر دستی است
            که با عشق ساخته شده است.
          </p>
        </FadeIn>

        <FadeIn
          className="mt-8 translate-y-15"
          vars={{ delay: 1.5, duration: 1.1 }}
        >
          <TransitionLink
            href={'/products'}
            className=" w-fit inline-flex items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-colors duration-300  border border-white text-white hover:bg-white/20"
          >
            محصولات
          </TransitionLink>
        </FadeIn>
        <FadeIn
          className="mt-8 -translate-y-15"
          vars={{ delay: 1.5, duration: 1.1 }}
        >
          <article className="mt-12  text-secondary flex flex-wrap items-center justify-center">
            <ul className=" flex items-center justify-center w-full h-full gap-3 flex-wrap max-w-[70vw] mx-auto  md:gap-x-6">
              {subCategories?.map((sub, i) => (
                <li key={sub.id}>
                  <FadeIn
                    className="translate-y-10"
                    vars={{ delay: 0.2 * i, duration: 1, ease: 'sine.in' }}
                  >
                    <TransitionLink
                      href={`/sub-categories/${sub.url}`}
                      className="bg-linear-to-b from-white/5 to-white/30 backdrop-blur-[2px] border rounded-none  px-2 py-1 text-center text-white border-white "
                    >
                      {sub.name}
                    </TransitionLink>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </article>
        </FadeIn>
      </div>
    </Bounded>
  )
}

export default Hero
