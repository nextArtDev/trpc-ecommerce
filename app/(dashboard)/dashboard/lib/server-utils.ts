import { toast } from 'sonner'
import {
  type UseFormSetError,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form'
import { PrismaClient } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'

/**
 * A generic utility function to handle setting server-side validation errors
 * on a react-hook-form instance.
 *
 * @param TFieldValues - The type of the form's values, inferred automatically.
 * @param errors - The error object from the server, typically Record<string, string[]>.
 * @param setError - The `setError` function from a `useForm` instance.
 */
export function handleServerErrors<TFieldValues extends FieldValues>(
  errors: Record<string, string[]> | null | undefined,
  setError: UseFormSetError<TFieldValues>
) {
  // If there are no errors, do nothing.
  if (!errors) return

  for (const [field, messages] of Object.entries(errors)) {
    if (field === '_form') {
      // Handle form-level errors with a toast.
      toast.error(messages.join(' و '))
    } else {
      // Set field-specific errors.
      // We assert the field name is a valid path in our form values.
      setError(field as FieldPath<TFieldValues>, {
        type: 'server',
        message: messages.join(' و '),
      })
    }
  }
}
export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = 'slug',
  separator: string = '-'
) => {
  let slug = baseSlug
  let suffix = 1

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exisitngRecord = await (prisma[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    })

    if (!exisitngRecord) {
      break
    }
    slug = `${slug}${separator}${suffix}`
    suffix += 1
  }
  return slug
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const translateOrderStatus = (status: string): string => {
  const translations: { [key: string]: string } = {
    Pending: 'در انتظار',
    Confirmed: 'تأیید شده',
    Processing: 'در حال پردازش',
    Shipped: 'ارسال شده',
    OutforDelivery: 'در حال تحویل',
    Delivered: 'تحویل شده',
    Cancelled: 'لغو شده',
    Failed: 'ناموفق',
    Refunded: 'برگشت داده شده',
    Returned: 'برگشت داده شده',
    PartiallyShipped: 'جزء ارسال شده',
    OnHold: 'در حالت تعلیق',
  }

  return translations[status] || status // Return the original status if no translation is found
}

export const translatePaymentStatus = (status: string): string => {
  const translations: { [key: string]: string } = {
    Pending: 'در انتظار',
    Paid: 'پرداخت شده',
    Completed: 'تکمیل شده',
    Failed: 'ناموفق',
    Declined: 'رد شده',
    Refunded: 'برگشت داده شده',
    Cancelled: 'لغو شده',
    PartiallyRefunded: 'جزء برگشت داده شده',
  }

  return translations[status] || status // Return the original status if no translation is found
}
