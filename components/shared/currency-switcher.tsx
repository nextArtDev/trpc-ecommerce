'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'

interface CurrencySelectorProps {
  className?: string
  showLabels?: boolean
  variant?: 'default' | 'minimal' | 'badge'
}

export function CurrencySelector({
  className = '',
  showLabels = true,
  variant = 'default',
}: CurrencySelectorProps) {
  const { currentCurrency, setCurrency } = useCurrencyStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency)
    setIsOpen(false)
  }

  const currentCurrencyInfo = CURRENCY_INFO[currentCurrency]

  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3">
              <span className="flex items-center gap-2">
                <span className="font-medium">
                  {currentCurrencyInfo.symbol}
                </span>
                <ChevronDown className="h-3 w-3" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {Object.values(CURRENCY_INFO).map((currency) => (
              <DropdownMenuItem
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{currency.symbol}</span>
                  {showLabels && (
                    <span className="text-sm text-muted-foreground">
                      {currency.name}
                    </span>
                  )}
                </div>
                {currentCurrency === currency.code && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {Object.values(CURRENCY_INFO).map((currency) => (
          <button
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className={`
              px-2 py-1 text-sm rounded transition-colors
              ${
                currentCurrency === currency.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }
            `}
          >
            {currency.symbol}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Currency:
        </span>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-48 justify-between">
            <span className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="w-6 h-6 p-0 flex items-center justify-center text-xs"
              >
                {currentCurrencyInfo.symbol}
              </Badge>
              {showLabels && <span>{currentCurrencyInfo.name}</span>}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Select Currency
          </div>
          <div className="h-px bg-border my-1" />
          {Object.values(CURRENCY_INFO).map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className="flex items-center justify-between cursor-pointer p-3"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                >
                  {currency.symbol}
                </Badge>
                <div className="flex flex-col">
                  <span className="font-medium">{currency.name}</span>
                  {showLabels && (
                    <span className="text-xs text-muted-foreground">
                      {currency.code}
                    </span>
                  )}
                </div>
              </div>
              {currentCurrency === currency.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
