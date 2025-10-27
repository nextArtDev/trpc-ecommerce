'use client'
import React from 'react'
import TextRotate from '../shared/text-rotate'
import { useTranslations } from 'next-intl'

const TopBanner = () => {
  const t = useTranslations('banner')
  const isHydrated = useHydrationSafe()

  function useHydrationSafe() {
    const [isHydrated, setIsHydrated] = React.useState(false)

    useIsomorphicLayoutEffect(() => {
      setIsHydrated(true)
    }, [])

    return isHydrated
  }
  function useIsomorphicLayoutEffect(
    effect: React.EffectCallback,
    deps?: React.DependencyList
  ) {
    const useEffectToUse =
      typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
    useEffectToUse(effect, deps)
  }

  return (
    <div className="bg-primary text-primary-foreground">
      {isHydrated ? (
        <TextRotate
          texts={[t('message1'), t('message2')]}
          mainClassName="flex items-center justify-center px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg"
          staggerFrom={'last'}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitBy="line"
          splitLevelClassName="overflow-hidden line-clamp-2 text-center py-auto pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={5000}
        />
      ) : (
        <div className="flex items-center justify-center px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1">
          {/* All duties and taxes included. within the US */}
          {t('message1')}
        </div>
      )}
    </div>
  )
}
export default TopBanner
