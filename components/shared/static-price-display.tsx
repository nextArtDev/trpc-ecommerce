// components/StaticPriceDisplay.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Currency } from '@/lib/types/home'
import {
  formatPriceStatic,
  convertCurrencyWithRate,
} from '@/lib/currency-config'

/**
 * StaticPriceDisplay - For displaying prices with a fixed exchange rate
 * Use this for:
 * - Order history (show price at time of purchase)
 * - Invoices (locked rates)
 * - Any historical data where rates shouldn't change
 */

interface StaticPriceDisplayProps {
  amount: number
  currency: Currency
  className?: string
  variant?: 'default' | 'large' | 'small' | 'badge'
}

/**
 * Simple static price display - shows price in its original currency
 * No conversion, no real-time rates
 */
export function StaticPriceDisplay({
  amount,
  currency,
  className = '',
  variant = 'default',
}: StaticPriceDisplayProps) {
  const variantClasses = {
    default: 'text-lg font-semibold',
    large: 'text-2xl font-bold',
    small: 'text-sm font-medium',
    badge: 'text-sm font-medium px-2 py-1 bg-muted rounded',
  }

  const formattedPrice = formatPriceStatic(amount, currency)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(variantClasses[variant])}>{formattedPrice}</span>
    </div>
  )
}

/**
 * StaticPriceWithRate - Display price with conversion using a stored exchange rate
 * Use this for order items where you stored the rate at purchase time
 */
interface StaticPriceWithRateProps {
  originalAmount: number
  originalCurrency: Currency
  displayCurrency: Currency
  exchangeRate: number // The rate stored with the order/item
  className?: string
  variant?: 'default' | 'large' | 'small' | 'badge'
  showOriginalPrice?: boolean
}

export function StaticPriceWithRate({
  originalAmount,
  originalCurrency,
  displayCurrency,
  exchangeRate,
  className = '',
  variant = 'default',
  showOriginalPrice = false,
}: StaticPriceWithRateProps) {
  const variantClasses = {
    default: 'text-lg font-semibold',
    large: 'text-2xl font-bold',
    small: 'text-sm font-medium',
    badge: 'text-sm font-medium px-2 py-1 bg-muted rounded',
  }

  // If currencies match, no conversion needed
  const displayAmount =
    originalCurrency === displayCurrency
      ? originalAmount
      : convertCurrencyWithRate(originalAmount, exchangeRate)

  const formattedPrice = formatPriceStatic(displayAmount, displayCurrency)
  const originalFormattedPrice = formatPriceStatic(
    originalAmount,
    originalCurrency
  )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn(variantClasses[variant])}>{formattedPrice}</span>

      {showOriginalPrice && originalCurrency !== displayCurrency && (
        <span className="text-sm text-muted-foreground">
          ({originalFormattedPrice})
        </span>
      )}
    </div>
  )
}

/**
 * OrderItemPrice - Specialized component for order items
 * Expects the complete order item data structure
 */
interface OrderItemPriceProps {
  price: number // Price in original currency at time of purchase
  currency: Currency
  quantity?: number
  exchangeRate?: number // Optional: if you want to show in different currency
  targetCurrency?: Currency // Optional: currency to display in
  showTotal?: boolean // Show price × quantity
  className?: string
  variant?: 'default' | 'large' | 'small' | 'badge'
}

export function OrderItemPrice({
  price,
  currency,
  quantity = 1,
  exchangeRate,
  targetCurrency,
  showTotal = false,
  className = '',
  variant = 'default',
}: OrderItemPriceProps) {
  const variantClasses = {
    default: 'text-lg font-semibold',
    large: 'text-2xl font-bold',
    small: 'text-sm font-medium',
    badge: 'text-sm font-medium px-2 py-1 bg-muted rounded',
  }

  // Calculate amounts
  const unitPrice = price
  const totalPrice = price * quantity

  // Determine display currency
  const displayCurrency = targetCurrency || currency
  const needsConversion = currency !== displayCurrency && exchangeRate

  // Convert if needed
  const displayUnitPrice = needsConversion
    ? convertCurrencyWithRate(unitPrice, exchangeRate!)
    : unitPrice
  const displayTotalPrice = needsConversion
    ? convertCurrencyWithRate(totalPrice, exchangeRate!)
    : totalPrice

  const formattedUnitPrice = formatPriceStatic(
    displayUnitPrice,
    displayCurrency
  )
  const formattedTotalPrice = formatPriceStatic(
    displayTotalPrice,
    displayCurrency
  )

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <span className={cn(variantClasses[variant])}>
          {showTotal ? formattedTotalPrice : formattedUnitPrice}
        </span>
        {quantity > 1 && !showTotal && (
          <span className="text-xs text-muted-foreground">× {quantity}</span>
        )}
      </div>

      {showTotal && quantity > 1 && (
        <span className="text-xs text-muted-foreground">
          {formattedUnitPrice} × {quantity}
        </span>
      )}

      {needsConversion && (
        <span className="text-xs text-muted-foreground">
          Original: {formatPriceStatic(price, currency)}
        </span>
      )}
    </div>
  )
}

/**
 * Hook for static price formatting (no real-time conversion)
 */
export function useStaticPrice(
  amount: number,
  currency: Currency,
  exchangeRate?: number,
  targetCurrency?: Currency
) {
  return React.useMemo(() => {
    if (!exchangeRate || !targetCurrency || currency === targetCurrency) {
      return formatPriceStatic(amount, currency)
    }

    const convertedAmount = convertCurrencyWithRate(amount, exchangeRate)
    return formatPriceStatic(convertedAmount, targetCurrency)
  }, [amount, currency, exchangeRate, targetCurrency])
}

/**
 * Utility: Format price array (e.g., for order totals)
 */
export function formatPriceBreakdown(breakdown: {
  subtotal: number
  shipping: number
  tax?: number
  discount?: number
  total: number
  currency: Currency
}) {
  const { subtotal, shipping, tax, discount, total, currency } = breakdown

  return {
    subtotal: formatPriceStatic(subtotal, currency),
    shipping: formatPriceStatic(shipping, currency),
    tax: tax !== undefined ? formatPriceStatic(tax, currency) : null,
    discount:
      discount !== undefined ? formatPriceStatic(discount, currency) : null,
    total: formatPriceStatic(total, currency),
  }
}
