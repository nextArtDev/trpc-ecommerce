// app/components/CurrencyInitializer.tsx
'use client'

import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import { useEffect } from 'react'

export function CurrencyInitializer() {
  const { lastUpdated, fetchExchangeRatesFromDB } = useCurrencyStore()

  useEffect(() => {
    // No need for type checks anymore! `lastUpdated` is guaranteed to be a Date or null.
    const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000

    if (!lastUpdated || lastUpdated.getTime() < twentyFourHoursAgo) {
      fetchExchangeRatesFromDB()
    }
  }, [lastUpdated, fetchExchangeRatesFromDB])

  useEffect(() => {
    // Listen for manual refresh events from the admin panel
    const handleRatesUpdated = () => {
      console.log('Currency update event received, refreshing rates...')
      fetchExchangeRatesFromDB()
    }

    window.addEventListener('currency-rates-updated', handleRatesUpdated)
    return () => {
      window.removeEventListener('currency-rates-updated', handleRatesUpdated)
    }
  }, [fetchExchangeRatesFromDB])

  return null
}
