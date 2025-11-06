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
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { AlertDialog } from '@/components/ui/alert-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NumberInput } from '@tremor/react'
import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { ExchangeFormSchema } from '../../../lib/schemas'
import { handleServerErrors } from '../../../lib/server-utils'
import { Loader2 } from 'lucide-react'
import { createExchange } from '../../../lib/actions/exchanges'

const ExchangeDetails = () => {
  // console.log(data?.colors)

  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ExchangeFormSchema>>({
    resolver: zodResolver(ExchangeFormSchema),
    defaultValues: {
      tomanToDollar: 1,
      tomanToEuro: 1,
      dollarToEuro: 1,
    },
  })

  const handleSubmit = async (data: z.infer<typeof ExchangeFormSchema>) => {
    startTransition(async () => {
      try {
        const res = await createExchange(data, path)
        if (res?.errors) handleServerErrors(res.errors, form.setError)
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
                name="tomanToDollar"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      نرخ تومان به دلار <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      {/* <Input placeholder="(مثال: 0.000023)" {...field} /> */}
                      <NumberInput
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        step={0.00000001}
                        placeholder="(مثال: 0.000023)"
                        min={0}
                        className="shadow-none! rounded-md text-sm!"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tomanToEuro"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      نرخ تومان به یورو <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      {/* <Input placeholder="(مثال: 0.000023)" {...field} /> */}
                      <NumberInput
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="(مثال: 0.000023)"
                        step={0.00000001}
                        min={0}
                        className="shadow-none! rounded-md text-sm!"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dollarToEuro"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      نرخ دلار به یورو<span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      {/* <Input placeholder="(مثال: 0.000023)" {...field} /> */}
                      <NumberInput
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder=" (مثال: 0.92)"
                        step="0.0001"
                        min={0}
                        className="shadow-none! rounded-md text-sm!"
                      />
                    </FormControl>
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
            </form>
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ توجه: بعد از بروزرسانی نرخ‌ها، تمام محصولات با نرخ جدید نمایش
                داده می‌شوند. سفارشات قبلی با نرخ زمان خرید محاسبه شده‌اند.
              </p>
            </div>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default ExchangeDetails
