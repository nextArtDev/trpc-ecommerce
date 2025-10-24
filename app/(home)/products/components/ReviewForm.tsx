'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, StarIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import { Review } from '@/lib/generated/prisma'
import { ReviewFormSchema } from '@/lib/home/schemas'
import { usePathname } from 'next/navigation'
import { handleServerErrors } from '@/app/(dashboard)/dashboard/lib/server-utils'
import { createReview, editReview } from '@/lib/home/actions/review'
// import {
//   createUpdateReview,
//   getReviewByProductId,
// } from '../lib/actions/review.actions'

const ReviewForm = ({
  productId,
  initialData,
}: {
  productId: string
  initialData?: Review | null
}) => {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ReviewFormSchema>>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      rating: initialData?.rating || 1, // Keep as number, z.coerce will handle the conversion
    },
  })

  // Open Form Handler
  const handleOpenForm = async () => {
    // form.setValue('productId', productId)
    // form.setValue('userId', userId)

    // const review = await getReviewByProductId({ productId })

    // if (review) {
    //   form.setValue('title', review.title)
    //   form.setValue('description', review.description)
    //   form.setValue('rating', review.rating)
    // }

    setOpen(true)
  }

  // Submit Form Handler
  const onSubmit = async (data: z.infer<typeof ReviewFormSchema>) => {
    // const res = await createUpdateReview({ ...values, productId })

    startTransition(async () => {
      try {
        if (initialData) {
          const res = await editReview(data, initialData.id, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        } else {
          const res = await createReview(data, productId, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenForm}
          variant={initialData ? 'link' : 'default'}
        >
          {initialData
            ? 'نظر خود را ویرایش کنید'
            : 'نظر خود راجع به این محصول را بنویسید'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>نظر خود را بنویسید</DialogTitle>
              {/* <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان را بنویسید" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>توضیحات</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="توضیحات را بنویسید...."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>ستاره از 5</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convert to number here
                        value={field.value?.toString() || '1'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                            >
                              {index + 1}{' '}
                              <StarIcon className="inline h-4 w-4" />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : 'تایید'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewForm
