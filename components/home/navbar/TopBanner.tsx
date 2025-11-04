'use client'
import React from 'react'
// import TextRotate from '../shared/text-rotate'
// import { useTranslations } from 'next-intl'
import LanguageSwitcherAdvanced from '@/components/shared/language-switcher'
import CurrencySwitcher from '@/components/shared/currency-switcher'
import UserSession from './UserSession'

const TopBanner = () => {
  // const t = useTranslations('banner')

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
      {isHydrated && (
        <div className="flex items-center justify-between gap-4 px-6 text-sm md:px-8 lg:px-12">
          <div className=" flex items-center justify-center gap-2">
            <LanguageSwitcherAdvanced />
            <CurrencySwitcher />
          </div>
          <UserSession />
        </div>
      )}
    </div>
  )
}
export default TopBanner
