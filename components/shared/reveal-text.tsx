'use client'

import { useRef } from 'react'

// import { asText, RichTextField } from "@prismicio/client";
import clsx from 'clsx'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type RevealTextProps = {
  //   field: RichTextField;
  text: string
  id: string
  className?: string
  staggerAmount?: number // time between each word
  //   as?: React.ElementType;
  duration?: number
  align?: 'center' | 'start' | 'end'
  triggerStart?: string
  triggerEnd?: string
  textClasses?: string
}

export const RevealText = ({
  //   field,
  text = '',
  id,
  align = 'end',
  //   as: Component = "div",
  duration = 0.8,
  className,
  staggerAmount = 0.1, // time between each word
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  textClasses,
}: RevealTextProps) => {
  const componentRef = useRef<HTMLDivElement>(null)

  const words = text.split(' ')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.reveal-text-word', {
          y: 0,
          stagger: staggerAmount,
          duration,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: componentRef.current,
            start: triggerStart,
            end: triggerEnd,
          },
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.to('.reveal-text-word', {
          duration: 0.5,
          opacity: 1,
          ease: 'none',
          y: 0,
          stagger: 0,
        })
      })
    },
    { scope: componentRef }
  )

  return (
    <article
      className={clsx(
        'reveal-text text-balance',
        align === 'center' && 'text-center',
        align === 'end' && 'text-right',
        align === 'start' && 'text-left',
        className
      )}
      ref={componentRef}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}-${id}`}
          // overflow-hidden does the job that it seems it pushed up from a box, adding border to span show that, this span is like a picture frame
          className="mb-0 inline-block overflow-hidden "
        >
          {/* translate-y-[120%]: to fix the edges when we add pb-4 in parent, we add that instead of translate-y-full  */}

          <span
            className={cn(
              'reveal-text-word mt-0 py-0 font-bold inline-block  text-center ',
              'bg-size animate-bg-position bg-linear-to-r from-yellow-500 from-30% via-yellow-700 via-50% to-[#f8e19b] to-80% bg-size-[200%_auto] bg-clip-text text-transparent',
              textClasses
            )}
          >
            {word}
            {index < words.length - 1 ? <>&nbsp;</> : null}
          </span>
        </span>
      ))}
    </article>
  )
}
