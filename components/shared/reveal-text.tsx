'use client'

import { useRef } from 'react'

// import { asText, RichTextField } from "@prismicio/client";
import clsx from 'clsx'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
          className="mb-0 inline-block overflow-hidden pb-4 "
        >
          {/* translate-y-[120%]: to fix the edges when we add pb-4 in parent, we add that instead of translate-y-full  */}
          <span className="reveal-text-word mt-0 inline-block translate-y-[120%] will-change-transform  ">
            {word}
            {index < words.length - 1 ? <>&nbsp;</> : null}
          </span>
        </span>
      ))}
    </article>
  )
}
