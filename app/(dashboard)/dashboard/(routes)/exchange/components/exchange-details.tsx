'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NumberInput } from '@tremor/react'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { createOrUpdateExchangeRates } from '../../../lib/actions/exchanges'
import { ExchangeFormSchema } from '../../../lib/schemas'
import { handleServerErrors } from '../../../lib/server-utils'
import { ExchangeColumn } from './columns'

const ExchangeDetails = (initialData: ExchangeColumn) => {
  // console.log(data?.colors)

  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ExchangeFormSchema>>({
    resolver: zodResolver(ExchangeFormSchema),
    defaultValues: {
      dollarToToman: initialData.dollarToToman || 0.000023,
      euroToToman: initialData.euroToToman || 0.000021,
    },
  })

  const handleSubmit = async (data: z.infer<typeof ExchangeFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await createOrUpdateExchangeRates(data, path)
        if (result.success) {
          toast.success(result.message)

          // Sync with client-side store
          // if (typeof window !== 'undefined') {
          //   const { syncExchangeRatesFromDB } = await import(
          //     '@/hooks/useCurrencyStore'
          //   )
          //   await syncExchangeRatesFromDB()
          // }
        } else if (result?.errors)
          handleServerErrors(result.errors, form.setError)
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl font-semibold">بروزرسانی نرخ ارز</h2>
          </CardTitle>
          {/* <CardDescription>{'کوپن تخفیف ایجاد کنید'}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="dollarToToman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      نرخ دلار به تومان <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        step={100}
                        placeholder="مثال: 120000"
                        min={0}
                        className="shadow-none rounded-md"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      1 دلار = {field.value.toLocaleString('fa-IR')} تومان
                      {field.value > 0 &&
                        ` | 1 تومان = ${(1 / field.value).toFixed(8)} دلار`}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="euroToToman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      نرخ یورو به تومان <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="مثال: 150000"
                        step={100}
                        min={0}
                        className="shadow-none rounded-md"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      1 یورو = {field.value.toLocaleString('fa-IR')} تومان
                      {field.value > 0 &&
                        ` | 1 تومان = ${(1 / field.value).toFixed(8)} یورو`}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'ذخیره نرخ‌های جدید'
                )}
              </Button>
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  ⚠️ توجه: بعد از بروزرسانی نرخ‌ها، تمام محصولات با نرخ جدید
                  نمایش داده می‌شوند. سفارشات قبلی با نرخ زمان خرید محاسبه
                  شده‌اند.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default ExchangeDetails
