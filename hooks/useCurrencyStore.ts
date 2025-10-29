import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Exchange rates (you might want to fetch these from an API in real app)
const EXCHANGE_RATES = {
  تومان: { dollar: 0.000023, euro: 0.000021 },
  dollar: { تومان: 43000, euro: 0.92 },
  euro: { تومان: 47000, dollar: 1.09 },
}

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

        const rates = EXCHANGE_RATES[fromCurrency]
        if (!rates || !rates[toCurrency]) return amount

        // Convert to base currency first, then to target currency
        const baseAmount = amount * rates[toCurrency]
        return baseAmount
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ currentCurrency: state.currentCurrency }),
    }
  )
)
