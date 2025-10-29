'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import { Currency } from '@/lib/types/home'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'

interface PriceDisplayProps {
  amount: number
  originalCurrency?: Currency
  className?: string
  showOriginalPrice?: boolean
  variant?: 'default' | 'large' | 'small' | 'badge'
  currency?: Currency
}

export function PriceDisplay({
  amount,
  originalCurrency,
  className = '',
  showOriginalPrice = false,
  variant = 'default',
  currency,
}: PriceDisplayProps) {
  const { currentCurrency, formatPrice, convertCurrency } = useCurrencyStore()

  const targetCurrency = currency || currentCurrency

  // ✅ FIXED: Safe conversion with fallback
  const convertedAmount = (() => {
    if (!originalCurrency || originalCurrency === targetCurrency) {
      return amount
    }

    try {
      return convertCurrency(amount, originalCurrency, targetCurrency)
    } catch (error) {
      console.warn('Price conversion failed:', error)
      return amount
    }
  })()

  const formattedPrice = formatPrice(convertedAmount)
  const originalFormattedPrice =
    showOriginalPrice && originalCurrency ? formatPrice(amount) : null

  const variantClasses = {
    default: 'text-lg font-semibold',
    large: 'text-2xl font-bold',
    small: 'text-sm font-medium',
    badge: 'text-sm font-medium px-2 py-1 bg-muted rounded',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(variantClasses[variant])}>{formattedPrice}</span>

      {showOriginalPrice &&
        originalCurrency &&
        originalCurrency !== targetCurrency && (
          <span className="text-sm text-muted-foreground line-through">
            {originalFormattedPrice}
          </span>
        )}
    </div>
  )
}

// ✅ FIXED: Higher-order component with proper typing
export function withCurrencyDisplay<T extends object>(
  Component: React.ComponentType<
    T & {
      price: number
      originalCurrency?: Currency
      formattedPrice?: (price: number, originalCurrency?: Currency) => string
    }
  >
) {
  return function CurrencyFormattedComponent(props: T) {
    const { convertCurrency, formatPrice, currentCurrency } = useCurrencyStore()

    const enhancedProps = {
      ...props,
      formattedPrice: (price: number, originalCurrency?: Currency) => {
        if (!originalCurrency || originalCurrency === currentCurrency) {
          return formatPrice(price)
        }

        try {
          const convertedPrice = convertCurrency(
            price,
            originalCurrency,
            currentCurrency
          )
          return formatPrice(convertedPrice)
        } catch (error) {
          console.warn('Price formatting failed:', error)
          return formatPrice(price)
        }
      },
    }

    return <Component {...enhancedProps} />
  }
}

// ✅ FIXED: Hook for price formatting with error handling
export function useFormattedPrice(amount: number, originalCurrency?: Currency) {
  const { currentCurrency, formatPrice, convertCurrency } = useCurrencyStore()

  return React.useMemo(() => {
    if (!originalCurrency || originalCurrency === currentCurrency) {
      return formatPrice(amount)
    }

    try {
      const convertedAmount = convertCurrency(
        amount,
        originalCurrency,
        currentCurrency
      )
      return formatPrice(convertedAmount)
    } catch (error) {
      console.warn('Price conversion failed:', error)
      return formatPrice(amount)
    }
  }, [amount, originalCurrency, currentCurrency, formatPrice, convertCurrency])
}

// ✅ FIXED: Utility component for safe price display
export function SafePriceDisplay({
  amount,
  originalCurrency = 'تومان',
  fallbackAmount,
  ...props
}: PriceDisplayProps & { fallbackAmount?: number }) {
  const [price, setPrice] = React.useState(amount)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    try {
      setPrice(amount)
      setHasError(false)
    } catch (error) {
      console.warn('Price display error:', error)
      setHasError(true)
      if (fallbackAmount !== undefined) {
        setPrice(fallbackAmount)
      }
    }
  }, [amount, fallbackAmount])

  if (hasError && fallbackAmount === undefined) {
    return <span className="text-muted-foreground">Price unavailable</span>
  }

  return (
    <PriceDisplay
      amount={price}
      originalCurrency={originalCurrency}
      {...props}
    />
  )
}
