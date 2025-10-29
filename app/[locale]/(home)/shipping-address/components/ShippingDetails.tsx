'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { ArrowLeft, Loader } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import ProvinceCity from './ProvinceCity'
import {
  AddressType,
  City,
  Country,
  Province,
  ShippingAddress,
  User,
} from '@/lib/generated/prisma'

import { handleServerErrors } from '@/app/(dashboard)/dashboard/lib/server-utils'
import {
  createShippingAddress,
  editShippingAddress,
} from '@/lib/home/actions/user'
import { useTranslations } from 'next-intl'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import CountryStateSelector from './ContryState'
import { shippingAddressSchema } from '@/lib/home/schemas'

const ShippingDetails = ({
  provinces,
  phone,
  countries,
  initialData,
}: {
  provinces: Province[]
  countries: Country[]
  phone: string
  initialData?: Partial<
    ShippingAddress & {
      city: City
      province: Province
      User: User
      country: Country
    }
  > | null
}) => {
  const path = usePathname()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const t = useTranslations('shipping')
  const { currentCurrency } = useCurrencyStore()

  const isIranianForm = currentCurrency === 'تومان'

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: initialData?.name,
      address1: initialData?.address1 || '',
      cityId: Number(initialData?.cityId) || 0,
      provinceId: Number(initialData?.provinceId) || 0,
      zip_code: initialData?.zip_code,
    },
  })

  const defaultValues: Partial<z.infer<typeof shippingAddressSchema>> = {
    name: initialData?.name || '',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    zip_code: initialData?.zip_code || '',
    addressType: isIranianForm
      ? AddressType.IRANIAN
      : AddressType.INTERNATIONAL,
  }

  // Add Iranian-specific defaults
  if (isIranianForm) {
    defaultValues.provinceId = Number(initialData?.provinceId) || 0
    defaultValues.cityId = Number(initialData?.cityId) || 0
  } else {
    // Add international-specific defaults
    defaultValues.countryId = initialData?.countryId || ''
    defaultValues.state = initialData?.state || ''
    defaultValues.cityInt = initialData?.cityInt || ''
  }

  function onSubmit(data: z.infer<typeof shippingAddressSchema>) {
    // console.log('Form submitted:', data)
    startTransition(async () => {
      try {
        if (initialData?.id) {
          const res = await editShippingAddress(data, initialData.id, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
          router.push('/place-order')
        } else {
          const res = await createShippingAddress(data, phone, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)

          router.push('/place-order')
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }

  return (
    <section
      aria-labelledby="payment-and-shipping-heading"
      className="space-y-6 px-2 py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pt-0 lg:pb-24"
    >
      <h2 id="payment-and-shipping-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <div className="max-w-md items-center justify-center mx-auto">
        <Input
          dir="ltr"
          disabled
          className="text-right max-w-sm text-indigo-800 bg-indigo-400"
          value={phone}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0 space-y-12"
        >
          <h3 id="contact-info-heading" className="text-lg font-medium">
            {t('title')}
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('recipientName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('recipientNamePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Type Selector - Hidden but needed for form validation */}
          <FormField
            control={form.control}
            name="addressType"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional Address Form */}
          {isIranianForm ? (
            <div className="flex flex-col space-y-6">
              <FormLabel>{t('selectProvinceCity')}</FormLabel>
              <ProvinceCity provinces={provinces} />
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              <FormLabel>{t('selectCountryState')}</FormLabel>
              <CountryStateSelector countries={countries} />
            </div>
          )}

          <div className="mt-3 flex flex-col gap-3">
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={t('addressPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('address2Placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t('postalCode')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('postalCodePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 w-full hover:bg-indigo-500 text-white"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('continue')}
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ShippingDetails
