'use client'

import { useState, useEffect } from 'react'
import {
  Check,
  BadgeEuro,
  Loader2,
  AlertTriangle,
  EllipsisVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import { useCartStore } from '@/hooks/useCartStore'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
interface CurrencySwitcherProps {
  className?: string
  variant?: 'default' | 'compact' | 'icon'
}

export default function CurrencySwitcher({
  className,
  variant = 'default',
}: CurrencySwitcherProps) {
  const { currentCurrency, setCurrency } = useCurrencyStore()
  const { getLockedCurrency } = useCartStore()
  const [isPending, setIsPending] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('currency')

  const lockedCurrency = getLockedCurrency()
  const isLocked = !!lockedCurrency
  const current = CURRENCY_INFO[currentCurrency]

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCurrencyChange = (currency: Currency) => {
    if (currency === currentCurrency || isLocked) return

    setIsPending(true)
    setCurrency(currency)

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setIsPending(false)
      setIsOpen(false)
    }, 300)
  }

  const currencies = Object.values(CURRENCY_INFO)

  if (!mounted) {
    // Return a placeholder to avoid hydration mismatch
    return (
      <Button
        variant="outline"
        className="text-primary rounded-none flex items-center justify-center"
        size="sm"
        disabled
      >
        <BadgeEuro className="h-4 w-4 mr-2" />
        <Loader2 className="animate-spin" />
      </Button>
    )
  }

  // === ICON VARIANT ===
  if (variant === 'icon') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="relative" asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            className={cn(
              'text-primary rounded-none flex items-center justify-center px-1',
              isLocked && 'border-amber-300 text-amber-600',
              className
            )}
          >
            <BadgeEuro className="h-4 w-4" />
            {isLocked && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isLocked && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {t('locked', { currency: lockedCurrency })}
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              disabled={isLocked && currency.code !== currentCurrency}
              className={cn(
                currentCurrency === currency.code ? 'bg-muted' : '',
                isLocked &&
                  currency.code !== currentCurrency &&
                  'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="mr-2 text-lg font-medium">
                {currency.symbol}
              </span>
              <span className="mr-auto">{currency.name}</span>
              {currentCurrency === currency.code && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // === COMPACT VARIANT ===
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="relative" asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            className={cn(
              'text-primary rounded-none flex items-center justify-center px-2 py-0.5',
              isLocked && 'border-amber-300 text-amber-600',
              className
            )}
          >
            <BadgeEuro className="h-4 w-4 mr-1" />
            <span className="text-base font-bold">{current.symbol}</span>
            {isLocked && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isLocked && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {t('locked', { currency: lockedCurrency })}
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              disabled={isLocked && currency.code !== currentCurrency}
              className={cn(
                currentCurrency === currency.code ? 'bg-muted' : '',
                isLocked &&
                  currency.code !== currentCurrency &&
                  'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="mr-2 text-lg font-medium">
                {currency.symbol}
              </span>
              <span className="mr-auto">{currency.name}</span>
              {currentCurrency === currency.code && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // === DEFAULT VARIANT ===
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative" asChild>
        <Button
          variant="default"
          size="sm"
          disabled={isPending}
          className={cn(
            'bg-background  text-foreground rounded-none flex items-center justify-center ',
            isLocked && 'border-amber-300 text-amber-600',
            className
          )}
        >
          {/* <BadgeEuro className="h-4 w-4" /> */}
          <motion.svg
            className="shrink-0 scale-150"
            whileInView={{ rotate: '360deg' }}
            transition={{
              duration: 1.5,
              delay: 1.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{
              fill: !isLocked ? '#f7a944' : '#58575745',
            }}
          >
            <g data-name="Currency Circulating">
              <path d="M321.159 256a67.468 67.468 0 1 0-67.468 67.472A67.468 67.468 0 0 0 321.159 256zM220.3 278.037l-.655-1.533 15.066-6.384.645 1.536c2.318 5.503 10.354 9.656 18.69 9.656 3.737 0 15.926-.681 15.926-9.417 0-4.551-5.22-7.288-16.422-8.618-12.033-1.343-30.234-3.378-30.234-22.69 0-11.804 8.784-20.06 23.584-22.284v-9.054h16.226v9.094c6.882 1.227 15.91 4.262 20.977 14.607l.748 1.526-13.872 6.417-.765-1.273c-2.31-3.817-9.376-6.923-15.763-6.923-5.413 0-14.49 1.024-14.49 7.89 0 5.091 6.544 6.275 15.096 7.295 13.575 1.673 32.166 3.964 32.166 24.013 0 14.687-11.857 22.45-24.093 23.871v10.317h-16.226v-9.825c-12.819-1.553-22.231-7.984-26.604-18.22z" />
              <path d="m413.304 236.21-24.692 25.916a136.726 136.726 0 0 0-115.19-144.149 137.388 137.388 0 0 0-140.525 68.093l17.39 9.775a117.361 117.361 0 0 1 120.035-58.163 116.764 116.764 0 0 1 98.327 123.856l-24.817-23.651-15.196 15.933 35.588 33.899-.013.006 15.949 15.185 15.182-15.916v-.01l33.906-35.578zM241.68 374.318a116.766 116.766 0 0 1-98.326-123.856l24.818 23.654 15.195-15.937-35.587-33.899.013-.007-15.95-15.184-15.182 15.916v.01l-33.909 35.58 15.944 15.195 24.692-25.915a136.624 136.624 0 0 0 136.225 145.793 137.52 137.52 0 0 0 119.494-69.738l-17.39-9.775a117.362 117.362 0 0 1-120.036 58.163z" />
            </g>
          </motion.svg>

          <span className="ml-1 text-base font-bold">{current.symbol}</span>
          {isLocked && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
          )}
          <EllipsisVertical className="text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none">
        {isLocked && (
          <>
            <div className="px-2 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t('locked', { currency: lockedCurrency })}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            disabled={isLocked && currency.code !== currentCurrency}
            className={cn(
              currentCurrency === currency.code ? 'bg-muted' : '',
              isLocked &&
                currency.code !== currentCurrency &&
                'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="mr-2 text-lg font-medium">{currency.symbol}</span>
            <span className="mr-auto">{currency.name}</span>
            {currentCurrency === currency.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
