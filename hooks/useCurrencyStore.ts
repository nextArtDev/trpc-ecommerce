// stores/useCurrencyStore.ts
import {
  Currency,
  // EXCHANGE_RATES,
  formatPrice as formatPriceUtil,
  convertCurrency as convertUtil,
} from '@/lib/currency-config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CurrencyState {
  currentCurrency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (amount: number, currency?: Currency) => string
  convertCurrency: (amount: number, from: Currency, to: Currency) => number
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'تومان',

      setCurrency: (currency: Currency) => {
        set({ currentCurrency: currency })
      },

      formatPrice: (amount: number, currency?: Currency) => {
        const curr = currency || get().currentCurrency
        return formatPriceUtil(amount, curr)
      },

      convertCurrency: (amount: number, from: Currency, to: Currency) => {
        return convertUtil(amount, from, to)
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        currentCurrency: state.currentCurrency,
      }),
    }
  )
)
