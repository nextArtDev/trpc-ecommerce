'use client'
import React, { useRef, useEffect, ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

type SupportedEdgeUnit = 'px' | 'vw' | 'vh' | '%'
type EdgeUnit = `${number}${SupportedEdgeUnit}`
type NamedEdges = 'start' | 'end' | 'center'
type EdgeString = NamedEdges | EdgeUnit | `${number}`
type Edge = EdgeString | number
type ProgressIntersection = [number, number]
type Intersection = `${Edge} ${Edge}`
export type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>

export default function FixedVideoPlay({
  videoUrl,
  children,
  offset = ['start end', 'end start'],
  transform = ['-20%', '20%'],
  overlayClassNames = 'bg-black/30',
  className,
}: {
  videoUrl: string
  children: ReactNode
  offset?: ScrollOffset
  transform?: string[]
  overlayClassNames?: string
  className?: string
}) {
  const sectionRef = useRef(null) // A ref for the section to track its position
  const videoRef = useRef<HTMLVideoElement | null>(null) // A ref for the video element to control play/pause

  // useInView hook detects if the component is in the viewport.
  // We set it to trigger when 20% of the element is visible.
  const isInView = useInView(sectionRef, { amount: 0.2, once: false })

  // This effect hook handles playing and pausing the video.
  // It runs every time the `isInView` value changes.
  useEffect(() => {
    if (videoRef.current) {
      // Ensure the video element exists
      if (isInView) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isInView])

  // useScroll and useTransform create the parallax effect, same as before.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: offset,
  })
  const y = useTransform(scrollYProgress, [0, 1], transform)

  return (
    <section
      ref={sectionRef}
      className={` relative flex items-center justify-center h-[500px] md:h-[700px] overflow-hidden  ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {/* The motion.div wraps the video and applies the parallax effect */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }} // Apply the vertical transform for parallax
        >
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted={true}
            playsInline
            autoPlay
            className="w-full h-full object-cover"
            suppressHydrationWarning
          />
        </motion.div>
        {/* This adds the dark overlay on top of the video */}
        <div className={` absolute inset-0 z-10  ${overlayClassNames}`} />
      </div>

      {/* The content is placed on top with a higher z-index. */}
      <div className="relative z-20">{children}</div>
    </section>
  )
}
