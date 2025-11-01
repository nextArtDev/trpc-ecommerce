'use client'

import { useState } from 'react'
import { Check, ChevronDown, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import { useCartStore } from '@/hooks/useCartStore'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface CurrencySelectorProps {
  className?: string
  showLabels?: boolean
  variant?: 'default' | 'compact' | 'icon'
}

export function CurrencySelector({
  className,
  showLabels = true,
  variant = 'default',
}: CurrencySelectorProps) {
  const { currentCurrency, setCurrency } = useCurrencyStore()
  const { getLockedCurrency } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('currency')

  const lockedCurrency = getLockedCurrency()
  const isLocked = !!lockedCurrency
  const current = CURRENCY_INFO[currentCurrency]

  const handleSelect = (currency: Currency) => {
    if (isLocked) {
      // Don't allow changing if currency is locked
      return
    }
    setCurrency(currency)
    setIsOpen(false)
  }

  const currencies = Object.values(CURRENCY_INFO)

  // Shared dropdown content
  const DropdownContent = (
    <DropdownMenuContent
      align="end"
      className={cn(
        'w-[180px] sm:w-[220px] p-1',
        'max-h-[70vh] overflow-y-auto',
        'border rounded-lg shadow-lg'
      )}
    >
      {isLocked && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('locked', { currency: lockedCurrency })}
          </div>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
        {isLocked ? t('changeWarning') : 'Select Currency'}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {currencies.map((currency) => (
        <DropdownMenuItem
          key={currency.code}
          onSelect={() => handleSelect(currency.code)}
          disabled={isLocked && currency.code !== currentCurrency}
          className={cn(
            'flex items-center justify-between gap-3 px-2 py-2.5 rounded-md cursor-pointer',
            'text-sm transition-colors',
            currentCurrency === currency.code && 'bg-accent',
            isLocked &&
              currency.code !== currentCurrency &&
              'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg font-medium">{currency.symbol}</span>
            {showLabels && (
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{currency.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currency.code}
                </span>
              </div>
            )}
          </div>
          {currentCurrency === currency.code && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  )

  // === ICON VARIANT (Ultra compact) ===
  if (variant === 'icon') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 w-9 p-0 relative',
              isLocked && 'text-amber-600',
              className
            )}
            aria-label={`Current currency: ${current.name}`}
          >
            <span className="text-base font-bold">{current.symbol}</span>
            {isLocked && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {DropdownContent}
      </DropdownMenu>
    )
  }

  // === COMPACT VARIANT (Mobile-friendly badge style) ===
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 px-2.5 text-sm font-medium relative',
              isLocked && 'border-amber-300 text-amber-600',
              className
            )}
          >
            <span className="flex items-center gap-1.5">
              <span>{current.symbol}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </span>
            {isLocked && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {DropdownContent}
      </DropdownMenu>
    )
  }

  // === DEFAULT VARIANT (Full with label, responsive) ===
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
        Currency:
      </span>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-auto justify-start sm:justify-between relative',
              'h-9 px-3 text-left font-normal',
              'max-w-[180px] sm:max-w-none',
              isLocked && 'border-amber-300 text-amber-600'
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <span className="text-base font-bold">{current.symbol}</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
            {isLocked && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {DropdownContent}
      </DropdownMenu>
    </div>
  )
}
