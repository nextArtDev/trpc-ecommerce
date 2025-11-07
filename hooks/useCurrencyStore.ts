import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CurrencyState {
  currentCurrency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (amount: number) => string
  convertCurrency: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ) => number
}

// Fixed exchange rates with proper typing
const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  تومان: {
    dollar: 0.000023,
    euro: 0.000021,
    تومان: 1, // Add self-reference
  },
  dollar: {
    تومان: 43000,
    euro: 0.92,
    dollar: 1, // Add self-reference
  },
  euro: {
    تومان: 47000,
    dollar: 1.09,
    euro: 1, // Add self-reference
  },
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'تومان',

      setCurrency: (currency: Currency) => {
        set({ currentCurrency: currency })
      },

      formatPrice: (amount: number) => {
        const { currentCurrency } = get()
        const currencyInfo = CURRENCY_INFO[currentCurrency]

        // Format number based on locale
        const formattedAmount = new Intl.NumberFormat(currencyInfo.locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(amount)

        return `${formattedAmount} ${currencyInfo.symbol}`
      },

      convertCurrency: (
        amount: number,
        fromCurrency: Currency,
        toCurrency: Currency
      ) => {
        if (fromCurrency === toCurrency) return amount

        // Get the rates for the source currency
        const sourceRates = EXCHANGE_RATES[fromCurrency]
        if (!sourceRates) return amount

        // Get the rate to target currency
        const rate = sourceRates[toCurrency]
        if (rate === undefined) return amount

        // Convert to target currency
        return amount * rate
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ currentCurrency: state.currentCurrency }),
    }
  )
)
