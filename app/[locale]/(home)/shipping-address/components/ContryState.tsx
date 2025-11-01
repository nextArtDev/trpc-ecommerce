// app/[locale]/(home)/shipping-address/components/CountryStateSelector.tsx

'use client'
import { useQueries } from '@tanstack/react-query'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Country } from '@/lib/generated/prisma'
import { getStatesByCountryId, getStateById } from '@/lib/home/actions/location'

interface CountryStateSelectorProps {
  isPending?: boolean
  countryLabel?: string
  countries: Country[]
  className?: string
}

const CountryStateSelector: FC<CountryStateSelectorProps> = ({
  isPending = false,
  countries,
  className,
}) => {
  const t = useTranslations('shipping')
  const form = useFormContext()

  // Get current form values
  const currentCountryId = form.watch('countryId')
  const currentStateId = form.watch('stateId')

  const [{ data: states, isPending: isPendingCountry }] = useQueries({
    queries: [
      {
        queryKey: ['stateByCountry', currentCountryId],
        queryFn: () => {
          return currentCountryId
            ? getStatesByCountryId(currentCountryId)
            : Promise.resolve([])
        },
        enabled: !!currentCountryId,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['stateById', currentStateId],
        queryFn: () => {
          return currentStateId
            ? getStateById(currentStateId)
            : Promise.resolve(null)
        },
        enabled: !!currentStateId,
        staleTime: 5 * 60 * 1000,
      },
    ],
  })

  // Handle country change
  const handleCountryChange = (value: string) => {
    form.setValue('countryId', value)
    // Clear state selection when country changes
    form.setValue('stateId', '')
    form.setValue('state', '')
  }

  // Handle state change
  const handleStateChange = (value: string) => {
    form.setValue('stateId', value)
    // form.setValue('state', value)
    const selectedState = states?.find((state) => state.id === value)
    if (selectedState) {
      form.setValue('state', selectedState.name)
    }
  }

  // Handle state text input change
  const handleStateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // form.setValue('state', e.target.value)
    form.setValue('state', e.target.value)
    // Clear stateId when using custom state input
    form.setValue('stateId', '')
  }

  return (
    <div className={cn('w-full h-full relative', className)}>
      <div className="flex  gap-4">
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('country')}</FormLabel>
              <Select
                disabled={isPending || countries?.length === 0}
                onValueChange={handleCountryChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCountry')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional rendering based on whether the country has predefined states */}
        {states && states.length > 0 ? (
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stateProvince')}</FormLabel>
                <Select
                  disabled={
                    isPending ||
                    isPendingCountry ||
                    !states ||
                    states.length === 0 ||
                    !currentCountryId
                  }
                  onValueChange={handleStateChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      {/* <SelectValue placeholder={t('selectState')} /> */}
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states?.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('stateProvince')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('stateProvincePlaceholder')}
                    {...field}
                    onChange={handleStateTextChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* City Input for International Addresses */}
        <FormField
          control={form.control}
          name="cityInt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('city')}</FormLabel>
              <FormControl>
                <Input placeholder={t('cityPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default CountryStateSelector
