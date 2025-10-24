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
import { CouponFormSchema } from '../../../lib/schemas'
import { handleServerErrors } from '../../../lib/server-utils'
import { Loader2 } from 'lucide-react'
import { createCoupon } from '../../../lib/actions/coupons'
import { DateTimePicker } from '../../../components/date-time/date-time-picker'

const CouponDetails = () => {
  // console.log(data?.colors)

  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof CouponFormSchema>>({
    resolver: zodResolver(CouponFormSchema),
    defaultValues: {
      code: '',
      discount: 0,
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  })

  const handleSubmit = async (data: z.infer<typeof CouponFormSchema>) => {
    startTransition(async () => {
      try {
        const res = await createCoupon(data, path)
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
          <CardTitle>اطلاعات کوپن تخفیف</CardTitle>
          <CardDescription>{'کوپن تخفیف ایجاد کنید'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      کد کوپن <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="کد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      تخفیف کوپن <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <NumberInput
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="%"
                        min={1}
                        className="!shadow-none rounded-md !text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DateTimePicker name="startDate" label="تاریخ شروع" />
              <DateTimePicker name="endDate" label="تاریخ پایان" />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'ایجاد کوپن تخفیف'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default CouponDetails
