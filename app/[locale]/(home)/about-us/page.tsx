'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Spotlight } from './components/spotlight'
import { BorderBeam } from './components/border-beam'
import { CardHoverEffect } from './components/pulse-card'
import {
  ScanHeart,
  ShieldCheck,
  ScanEye,
  Hop,
  Sparkles,
  Rocket,
  Target,
} from 'lucide-react'

//https://blocks.mvp-subha.me/docs/mainsections/about
interface AboutUsProps {
  title?: string
  subtitle?: string
  mission?: string
  vision?: string
  values?: Array<{
    title: string
    description: string
    icon: keyof typeof iconComponents
  }>
  className?: string
}

const iconComponents = {
  ScanHeart: ScanHeart,
  ScanEye: ScanEye,
  ShieldCheck: ShieldCheck,
  Hop: Hop,
  Sparkles: Sparkles,
  Rocket: Rocket,
  Target: Target,
}

const defaultValues: AboutUsProps['values'] = [
  {
    title: 'هنر و اصالت',
    description:
      'در هر دوخت، اصالت هنر دست و عشق به چرم طبیعی را حفظ می‌کنیم. هر محصول داستان منحصربه‌فرد خود را روایت می‌کند.',
    icon: 'ScanHeart',
  },
  {
    title: 'کیفیت و ماندگاری',
    description:
      'از برترین چرم‌های طبیعی و محکم‌ترین دوخت استفاده می‌کنیم تا محصولاتی بیافرینیم که برای سال‌ها همراه شما بمانند.',
    icon: 'ShieldCheck',
  },
  {
    title: 'توجه به جزئیات', // Attention to Detail
    description:
      'هیچ جزئیاتی را به شانس واگذار نمی‌کنیم؛ از صاف بودن یک درز گرفته تا ظرافت یک سجاف.',
    icon: 'ScanEye',
  },
  {
    title: 'ارتباط پایدار', // Sustainable Connection
    description:
      'به دنبال ایجاد رابطه‌ای پایدار با مشتریان و محیط زیست هستیم. چرمی که به عمر محصولی ارزشمند تبدیل شود، پایدارترین انتخاب است.',
    icon: 'Hop',
  },
]
export default function AboutUs1() {
  //   const aboutData = {
  //     title: 'About Us',
  //     subtitle:
  //       'Building the future of web development with beautiful, reusable components.',
  //     mission:
  //       'Our mission is to democratize web development by providing high-quality, customizable components that help developers build stunning websites quickly and efficiently.',
  //     vision:
  //       'We envision a world where creating beautiful websites is accessible to everyone, regardless of their design or development experience.',
  //     values: defaultValues,
  //     className: 'relative overflow-hidden py-20',
  //   }
  const aboutData = {
    title: 'درباره ما', // About Us
    subtitle:
      'آفرینش کیف‌هایی برای زندگی، با عشق به هنر چرم‌دوزی و احترام به اصالت.', // Creating bags for life, with a love for the art of leathercraft and respect for authenticity.
    mission:
      'ماموریت ما احیای هنر چرم‌دوزی دست‌ساز و عرضه محصولاتی است که نه تنها کاربردی باشند، بلکه میراثی ارزشمند برای نسل‌های آینده تبدیل شوند.', // Our mission is to revive the art of handmade leathercraft and offer products that are not only functional but become a valuable legacy for future generations.
    vision:
      'تصور ما جهانی است که در آن هرکس ارزش کیفیت، اصالت و داستان پشت یک محصول دست‌ساز را درک می‌کند و آن را به کالای مصرفی بی‌هویت ترجیح می‌دهد.', // We envision a world where everyone understands the value of quality, authenticity, and the story behind a handmade product and prefers it over impersonal mass-produced goods.
    values: defaultValues,
    className: 'relative overflow-hidden py-20',
  }
  const missionRef = useRef(null)
  const valuesRef = useRef(null)

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 })

  return (
    <section className="relative w-full overflow-hidden pt-20">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(336, 100%, 50%, 0.08) 0, hsla(341, 100%, 55%, 0.04) 50%, hsla(336, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(333, 100%, 85%, 0.08) 0, hsla(335, 100%, 55%, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(332, 100%, 85%, 0.06) 0, hsla(327, 100%, 85%, 0.06) 80%, transparent 100%)"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-16 max-w-md text-center"
        >
          <h1 className="from-foreground/80 via-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            {aboutData.title}
          </h1>
          <p className="text-muted-foreground mt-6 text-xl">
            {aboutData.subtitle}
          </p>
        </motion.div>

        {/* Mission & Vision Section */}
        <div ref={missionRef} className="relative mx-auto mb-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative z-10 grid gap-12 md:grid-cols-2"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="group border-border/40 relative block overflow-hidden rounded-md border bg-linear-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-primary/40 from-transparent to-transparent"
              />

              <div className="from-primary/20 to-primary/5 mb-6 inline-flex aspect-square h-16 w-16 flex-1 items-center justify-center rounded-sm bg-linear-to-br backdrop-blur-sm">
                <Rocket className="text-primary h-8 w-8" />
              </div>

              <div className="space-y-4">
                <h2 className="from-primary/90 to-primary/70 mb-4 bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent">
                  هدف ما
                </h2>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {aboutData.mission}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="group border-border/40 relative block overflow-hidden rounded-md border bg-linear-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="from-transparent via-blue-500/40 to-transparent"
                reverse
              />
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-sm bg-linear-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                <Target className="h-8 w-8 text-blue-500" />
              </div>

              <h2 className="mb-4 bg-linear-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-3xl font-bold text-transparent">
                نگاه ما
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {aboutData.vision}
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div ref={valuesRef} className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            <h2 className="from-foreground/80 via-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              ارزشهای اصیل کار ما
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
              اصولی که ما را در هر کار و تصمیم راهبر است.
            </p>
          </motion.div>

          <div className="grid grid-flow-row-dense gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aboutData.values?.map((value, index) => {
              const IconComponent = iconComponents[value.icon]

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1 + 0.2,
                    ease: 'easeOut',
                  }}
                  //   whileHover={{ y: -5, scale: 1.02 }}
                >
                  <CardHoverEffect
                    icon={<IconComponent className="h-6 w-6" />}
                    title={value.title}
                    description={value.description}
                    variant={
                      index === 0
                        ? 'purple'
                        : index === 1
                        ? 'blue'
                        : index === 2
                        ? 'amber'
                        : 'rose'
                    }
                    glowEffect={true}
                    size="lg"
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
