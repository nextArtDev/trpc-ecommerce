// lib/currency-config.ts
/**
 * Exchange Rate Configuration
 * Update these values in your .env file and redeploy
 */

// Get rates from environment variables with fallbacks
const DOLLAR_TO_TOMAN = parseFloat(
  process.env.NEXT_PUBLIC_DOLLAR_TO_TOMAN || '100000'
)
const EURO_TO_TOMAN = parseFloat(
  process.env.NEXT_PUBLIC_EURO_TO_TOMAN || '110000'
)
const DOLLAR_TO_EURO = parseFloat(
  process.env.NEXT_PUBLIC_DOLLAR_TO_EURO || '0.92'
)

// Validate rates at startup
if (DOLLAR_TO_TOMAN <= 0 || EURO_TO_TOMAN <= 0 || DOLLAR_TO_EURO <= 0) {
  console.warn('⚠️ Invalid exchange rates in environment variables!')
}

export type Currency = 'تومان' | 'dollar' | 'euro'

// Pre-calculated exchange rate matrix (updated from .env)
export const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  تومان: {
    dollar: 1 / DOLLAR_TO_TOMAN,
    euro: 1 / EURO_TO_TOMAN,
    تومان: 1,
  },
  dollar: {
    تومان: DOLLAR_TO_TOMAN,
    euro: DOLLAR_TO_EURO,
    dollar: 1,
  },
  euro: {
    تومان: EURO_TO_TOMAN,
    dollar: 1 / DOLLAR_TO_EURO,
    euro: 1,
  },
}

// Export for easy access
export const CURRENT_RATES = {
  dollarToToman: DOLLAR_TO_TOMAN,
  euroToToman: EURO_TO_TOMAN,
  dollarToEuro: DOLLAR_TO_EURO,
  // Calculated
  tomanToDollar: 1 / DOLLAR_TO_TOMAN,
  tomanToEuro: 1 / EURO_TO_TOMAN,
  euroToDollar: 1 / DOLLAR_TO_EURO,
} as const

// Helper functions
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount

  const rate = EXCHANGE_RATES[from]?.[to]
  if (!rate) {
    console.warn(`Exchange rate not found: ${from} → ${to}`)
    return amount
  }

  return amount * rate
}

export function formatPrice(amount: number, currency: Currency): string {
  const locale = currency === 'تومان' ? 'fa-IR' : 'en-US'
  const symbol =
    currency === 'تومان' ? 'تومان' : currency === 'dollar' ? '$' : '€'

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${formatted} ${symbol}`
}

export function convertCurrencyWithRate(amount: number, rate: number): number {
  return amount * rate
}
export function formatPriceStatic(amount: number, currency: Currency): string {
  const locale = currency === 'تومان' ? 'fa-IR' : 'en-US'
  const symbol =
    currency === 'تومان' ? 'تومان' : currency === 'dollar' ? '$' : '€'

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${formatted} ${symbol}`
}
export const CURRENCY_INFO: Record<
  Currency,
  { symbol: string; locale: string }
> = {
  تومان: { symbol: 'تومان', locale: 'fa-IR' },
  dollar: { symbol: '$', locale: 'en-US' },
  euro: { symbol: '€', locale: 'en-IE' },
}
