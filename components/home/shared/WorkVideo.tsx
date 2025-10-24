import React from 'react'
import FixedVideoPlay from './FixedVideoPlay'
import { RevealText } from '@/components/shared/reveal-text'
import { FadeIn } from '@/components/shared/fade-in'

const WorkVideo = () => {
  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="  w-[90vw] m-w-xl flex flex-col items-center mx-auto gap-4">
        <RevealText
          text="هنرِ ساخت: اصالت در هر دوخت"
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
            {/* We are experts in leather goods, which require precise workmanship,
          and we pay particular attention to the choice of our raw materials.
          Our collections are made using only full-grain leather, which is the
          highest quality of leather. */}
            ما در ساخت مصنوعات چرمی، که نیازمند ظرافتی مثال‌زدنی است، متخصص
            هستیم و توجهی ویژه به انتخاب مواد اولیه خود داریم. تمامی مجموعه‌های
            ما تنها از چرم تمام‌دانه — که اصیل‌ترین و مرغوب‌ترین نوع چرم طبیعی
            است — ساخته می‌شوند.
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
