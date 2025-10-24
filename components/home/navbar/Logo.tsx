import Image from 'next/image'
import { FC } from 'react'
import dateImage from '../../../public/images/palm-tree.png'
import { TransitionLink } from '../shared/TransitionLink'
interface LogoProps {
  href?: string
}

const Logo: FC<LogoProps> = ({ href = '/' }) => {
  return (
    <div>
      <TransitionLink href={href} className="flex items-center space-x-2">
        <Image
          src={dateImage || '/images/fallback-image.webp'}
          alt="logo"
          className="object-cover scale-50"
        />
        {/* <Package2 className="h-6 w-6" /> */}
        {/* <span className="font-bold inline-block">سارینا</span> */}
      </TransitionLink>
    </div>
  )
}

export default Logo
