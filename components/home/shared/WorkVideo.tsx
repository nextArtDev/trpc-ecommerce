import FixedVideoPlay from './FixedVideoPlay'
import { RevealText } from '@/components/shared/reveal-text'
import { FadeIn } from '@/components/shared/fade-in'
import { getTranslations } from 'next-intl/server'
const WorkVideo = async () => {
  const workVideo = await getTranslations('workVideo')

  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="  w-[90vw] m-w-xl flex flex-col items-center mx-auto gap-4">
        <RevealText
          text={workVideo('title')}
          id="work-video"
          className="text-xl pt-12 md:text-3xl font-bold uppercase  text-center"
          staggerAmount={0.2}
          duration={0.8}
        />
        {/* Savoir-faire */}
        {/* <h2 className="text-xl md:text-3xl font-bold uppercase py-8">
          هنرِ ساخت: اصالت در هر دوخت
        </h2> */}
        <FadeIn
          className=" translate-y-8 "
          vars={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="max-w-md mx-auto text-pretty text-center">
            {workVideo('description')}
          </p>
        </FadeIn>
      </div>
      <FixedVideoPlay
        className="w-full"
        videoUrl="/videos/Bags And Small Leather Goods For Women - Le Tanneur.webm"
      >
        {' '}
      </FixedVideoPlay>
    </section>
  )
}

export default WorkVideo
