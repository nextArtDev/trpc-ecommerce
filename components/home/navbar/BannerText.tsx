import { Banner, BannerClose, BannerTitle } from '../shared/banner'
import TextRotate from '../shared/text-rotate'

const BannerText = () => {
  return (
    <Banner>
      {/* <BannerIcon icon={CircleAlert} /> */}
      <BannerTitle>
        <TextRotate
          texts={[
            'All duties and taxes included.  return for orders within the US',

            'Buy now. Pay later with Klarna. ',
          ]}
          mainClassName="flex items-center justify-center px-2 sm:px-2 md:px-3   overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg"
          staggerFrom={'last'}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitBy="line"
          splitLevelClassName="overflow-hidden line-clamp-2  text-center py-auto pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={5000}
        />
        {/* Important message */}
      </BannerTitle>
      {/* <BannerAction>Learn more</BannerAction> */}
      <BannerClose />
    </Banner>
  )
}

export default BannerText
