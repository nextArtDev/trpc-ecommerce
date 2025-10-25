'use client'

import { FC, useEffect, useState, useTransition } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { toast } from 'sonner'
import {
  Category,
  Image,
  SubCategory,
  SubCategoryTranslation,
} from '@/lib/generated/prisma'
import { usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import InputFileUpload from '../../../components/file-input/InputFileUpload'
import { SubCategoryFormSchema } from '../../../lib/schemas'
import {
  createSubCategory,
  editSubCategory,
} from '../../../lib/actions/sub-category'
import { handleServerErrors } from '../../../lib/server-utils'
import slugify from 'slugify'
import { Loader2 } from 'lucide-react'
import { LANGUAGES } from '../../../components/constants'
import { Textarea } from '@/components/ui/textarea'

interface SubCategoryDetailsProps {
  initialData?: SubCategory & { images: Partial<Image>[] } & {
    translations: SubCategoryTranslation[]
  }
  categories: (Category & { translations: { name: string } })[]
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  initialData,
  categories,
}) => {
  // Initializing necessary hooks

  // const router = useRouter() // Hook for routing
  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      translations: {
        fa: {
          name:
            initialData?.translations?.find((t) => t.language === 'fa')?.name ??
            '',
          description:
            initialData?.translations?.find((t) => t.language === 'fa')
              ?.description ?? '',
        },
        en: {
          name:
            initialData?.translations?.find((t) => t.language === 'en')?.name ??
            '',
          description:
            initialData?.translations?.find((t) => t.language === 'en')
              ?.description ?? '',
        },
        de: {
          name:
            initialData?.translations?.find((t) => t.language === 'de')?.name ??
            '',
          description:
            initialData?.translations?.find((t) => t.language === 'de')
              ?.description ?? '',
        },
        fr: {
          name:
            initialData?.translations?.find((t) => t.language === 'fr')?.name ??
            '',
          description:
            initialData?.translations?.find((t) => t.language === 'fr')
              ?.description ?? '',
        },
        it: {
          name:
            initialData?.translations?.find((t) => t.language === 'it')?.name ??
            '',
          description:
            initialData?.translations?.find((t) => t.language === 'it')
              ?.description ?? '',
        },
      },

      images: initialData?.images
        ? initialData.images.map((image) => ({ url: image.url }))
        : [],
      url: initialData?.url,
      featured: initialData?.featured,
      categoryId: initialData?.categoryId,
    },
  })

  const handleSubmit = async (data: z.infer<typeof SubCategoryFormSchema>) => {
    // console.log({ data })

    startTransition(async () => {
      try {
        if (initialData) {
          const res = await editSubCategory(data, initialData.id, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        } else {
          const res = await createSubCategory(data, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }

  //Slug creation
  const [isUrlManuallyEdited, setIsUrlManuallyEdited] = useState(
    !!initialData?.url
  )

  const categoryName = form.watch('translations.en.name')

  useEffect(() => {
    if (!isUrlManuallyEdited && categoryName) {
      form.setValue('url', slugify(categoryName), { shouldValidate: true })
    }
  }, [categoryName, isUrlManuallyEdited, form])
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>اطلاعات زیردسته‌بندی</CardTitle>
          <CardDescription>
            {initialData?.id
              ? `آپدیت زیردسته‌بندی ${
                  initialData?.translations.find((t) => t.language === 'fa')
                    ?.name
                }`
              : ' زیردسته‌بندی جدید ایجاد کنید. شما می‌توانید بعدا از جدول زیردسته‌بندیها آنرا ویرایش کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
                <div className="md:col-span-2 max-w-lg mx-auto ">
                  <InputFileUpload
                    initialDataImages={initialData?.images || []}
                    name="images"
                    label="عکس"
                  />
                </div>
                <div className="md:col-span-2">
                  <Tabs
                    dir="rtl"
                    defaultValue="fa"
                    className="w-full space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      {LANGUAGES.map((lang) => (
                        <TabsTrigger key={lang.code} value={lang.code}>
                          {lang.flag} {lang.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {LANGUAGES.map((lang) => (
                      <TabsContent
                        key={lang.code}
                        value={lang.code}
                        className="space-y-4"
                      >
                        {/* Name Field */}
                        <FormField
                          disabled={isPending}
                          control={form.control}
                          name={`translations.${lang.code}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                نام زیردسته‌ ({lang.label}){' '}
                                <span className="text-rose-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`نام به ${lang.label}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description Field (Optional) */}
                        <FormField
                          disabled={isPending}
                          control={form.control}
                          name={`translations.${lang.code}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>توضیحات ({lang.label})</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`توضیحات به ${lang.label}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        url زیردسته‌بندی{' '}
                        <span className="text-rose-500">*</span>
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
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className=" bg-background">
                      <FormControl>
                        <Select
                          dir="rtl"
                          disabled={isPending}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormLabel>
                            انتخاب دسته‌بندی{' '}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="انتخاب دسته‌بندی"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id!}
                              >
                                {category.translations.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                              زیردسته‌بندی ویژه در صفحه اصلی نمایش داده می‌شود.
                            </FormDescription>
                          </div>
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : initialData?.id ? (
                  'ذخیره تغییرات'
                ) : (
                  'ایجاد زیردسته‌بندی'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default SubCategoryDetails
