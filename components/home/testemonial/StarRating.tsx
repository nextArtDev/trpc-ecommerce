'use client'
//nyxbui.design/docs/components/star-rating

import type { Dispatch, SetStateAction } from 'react'
import React from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarWrapperProps {
  value?: number
  setValue?: Dispatch<SetStateAction<number>>
  numStars?: number
  icon?: LucideIcon
  disabled?: boolean
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>
  iconProps?: LucideProps
  showcase?: boolean
}

function StarRating({
  numStars = 5,
  icon,
  setValue,
  value,
  disabled,
  showcase,
  iconProps = {},
  wrapperProps = {},
}: StarWrapperProps) {
  const { className: wrapperClassName, ...restWrapperProps } = wrapperProps
  const { className: iconClassName, ...restIconProps } = iconProps
  const IconComponent = icon

  return (
    <div
      className={cn('flex items-center gap-1', wrapperClassName)}
      {...restWrapperProps}
    >
      {Array.from({ length: numStars }, (_, i) => {
        const isRated = i < value!
        const styledIconProps: LucideProps = {
          onClick: () => !showcase && !disabled && setValue!(i + 1),
          className: cn(
            'fill-[#45f88a] stroke-[#45f88a] size-6',
            {
              'opacity-70 pointer-events-none ': disabled,
              'transition-transform duration-300 hover:scale-110 cursor-pointer ':
                !disabled && !showcase,
              '!fill-transparent !stroke-muted/30': !isRated,
            },
            iconClassName
          ),
          ...restIconProps,
        }
        return (
          <div key={i}>
            {IconComponent ? (
              <IconComponent {...styledIconProps} />
            ) : (
              <StarIcon {...styledIconProps} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { StarRating }

// import * as React from 'react'
// import { Heart } from 'lucide-react'
// import { StarRating } from '~/components/ui/star-rating'

// export function StarRatingIcon() {
//   const [value, setValue] = React.useState<number>(3)
//   return <StarRating value={value} setValue={setValue} icon={Heart} />
// }
