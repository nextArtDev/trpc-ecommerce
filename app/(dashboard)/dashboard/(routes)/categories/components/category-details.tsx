'use client'
import { FC, useEffect, useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import slugify from 'slugify'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// import {
//   createCategory,
//   editCategory,
// } from '@/lib/actions/dashboard/categories'

import { toast } from 'sonner'
import { Category, Image } from '@/lib/generated/prisma'
import { usePathname } from 'next/navigation'
import InputFileUpload from '../../../components/file-input/InputFileUpload'
import { CategoryFormSchema } from '../../../lib/schemas'
import { Loader2 } from 'lucide-react'
import { handleServerErrors } from '../../../lib/server-utils'
import { createCategory, editCategory } from '../../../lib/actions/category'

interface CategoryDetailsProps {
  initialData?: Category & { images: Image[] }
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ initialData }) => {
  // Initializing necessary hooks
  // const router = useRouter() // Hook for routing
  const path = usePathname()
  const [isPending, startTransition] = useTransition()
  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: 'onChange', // Form validation mode
    resolver: zodResolver(CategoryFormSchema), // Resolver for form validation
    defaultValues: {
      name: initialData?.name ?? '',
      images: initialData?.images
        ? initialData.images.map((image) => ({ url: image.url }))
        : [],
      // images: initialData?.images ?? [],
      url: initialData?.url ?? '',
      featured: initialData?.featured ?? false,
    },
  })

  // Submit handler for form submission
  const handleSubmit = (data: z.infer<typeof CategoryFormSchema>) => {
    startTransition(async () => {
      try {
        if (initialData) {
          const res = await editCategory(data, initialData.id, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        } else {
          const res = await createCategory(data, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        }
      } catch (error) {
        // Catch errors, including the expected NEXT_REDIRECT error from Next.js
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          // This is an expected error when a redirect occurs, so we can ignore it.
          return
        }
        // Handle unexpected errors
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }

  const [isUrlManuallyEdited, setIsUrlManuallyEdited] = useState(
    !!initialData?.url
  )

  const categoryName = form.watch('name')

  useEffect(() => {
    if (!isUrlManuallyEdited && categoryName) {
      form.setValue('url', slugify(categoryName), { shouldValidate: true })
    }
  }, [categoryName, isUrlManuallyEdited, form])
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
          <CardDescription>
            {initialData?.id
              ? `آپدیت دسته‌بندی ${initialData?.name}`
              : ' دسته‌بندی جدید ایجاد کنید. شما می‌توانید بعدا از جدول دسته‌بندیها آنرا ویرایش کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* This grid is the core of the new responsive layout.
              1 column on mobile, 2 on medium screens and up.
            */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
                {/* Image upload now spans both columns for better layout */}
                <div className="md:col-span-2 max-w-lg mx-auto ">
                  <InputFileUpload
                    initialDataImages={initialData?.images || []}
                    name="images"
                    label="عکس"
                  />
                </div>

                {/* Name Field */}
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        نام دسته‌بندی <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="مثلا: محصولات مردانه" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        URL دسته‌بندی <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=" بصورت خودکار ساخته می‌شود"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setIsUrlManuallyEdited(true)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        این URL بصورت خودکار از نام ساخته می‌شود.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex cursor-pointer flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <div className="font-medium">ویژه</div>
                            <FormDescription>
                              دسته‌بندی ویژه در صفحه اصلی نمایش داده می‌شود.
                            </FormDescription>
                          </div>
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full max-w-lg mx-auto flex items-center justify-center py-6 my-12"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : initialData?.id ? (
                  'ذخیره تغییرات'
                ) : (
                  'ایجاد دسته‌بندی'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default CategoryDetails
