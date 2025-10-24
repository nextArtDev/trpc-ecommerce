'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from 'framer-motion'
import { FC, useEffect } from 'react'

const clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max)

function useBoundedScroll(bounds: number) {
  const { scrollY } = useScroll()
  const scrollYBounded = useMotionValue(0)
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, bounds],
    [0, 1]
  )

  useEffect(() => {
    return scrollY.onChange((current) => {
      const previous = scrollY.getPrevious() || 0
      const diff = current - previous
      const newScrollYBounded = scrollYBounded.get() + diff

      scrollYBounded.set(clamp(newScrollYBounded, 0, bounds))
    })
  }, [bounds, scrollY, scrollYBounded])

  return { scrollYBounded, scrollYBoundedProgress }
}
interface StickyNavProps {
  children: React.ReactNode
  className?: string
  isTop?: boolean
}

const StickyNav: FC<StickyNavProps> = ({ children }) => {
  const { scrollYBoundedProgress } = useBoundedScroll(400)
  const scrollYBoundedProgressThrottled = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  )
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 overflow-hidden  ">
      <div className="z-0 flex-1 overflow-y-scroll">
        <motion.header
          className="fixed inset-x-0 grid grid-rows-2  h-24 shadow backdrop-blur-md"
          style={{
            height: useTransform(
              scrollYBoundedProgressThrottled,
              [0, 1],
              // [max , min] height
              [96, 50]
            ),
            backgroundColor: useMotionTemplate`rgb(255 255 255 / ${useTransform(
              scrollYBoundedProgressThrottled,
              [0, 1],
              [1, 0.1]
            )})`,
          }}
        >
          {children}
        </motion.header>
      </div>
    </div>
  )
}

export default StickyNav
