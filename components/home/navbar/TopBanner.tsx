'use client'
import React, { useEffect, useState } from 'react'
import LanguageSwitcherAdvanced from '@/components/shared/language-switcher'
import CurrencySwitcher from '@/components/shared/currency-switcher'
import UserSession from './UserSession'
import { Separator } from '@/components/ui/separator'

const TopBanner = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  // const t = useTranslations('banner')

  // const isHydrated = useHydrationSafe()

  // function useHydrationSafe() {
  //   const [isHydrated, setIsHydrated] = React.useState(false)

  //   useIsomorphicLayoutEffect(() => {
  //     setIsHydrated(true)
  //   }, [])

  //   return isHydrated
  // }
  // function useIsomorphicLayoutEffect(
  //   effect: React.EffectCallback,
  //   deps?: React.DependencyList
  // ) {
  //   const useEffectToUse =
  //     typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
  //   useEffectToUse(effect, deps)
  // }

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="flex items-center justify-between gap-4 px-6 text-sm md:px-8 lg:px-12">
        <div className=" flex items-start justify-between gap-2">
          <CurrencySwitcher />

          <LanguageSwitcherAdvanced />
        </div>
        <UserSession />
      </div>
    </div>
  )
}
export default TopBanner
