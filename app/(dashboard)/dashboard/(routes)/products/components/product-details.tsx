/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
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
import { useFieldArray, useForm } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Switch } from '@/components/ui/switch'
import {
  Category,
  CategoryTranslation,
  Color,
  Image,
  OfferTag,
  OfferTagTranslation,
  Product,
  ProductTranslation,
  ProductVariant,
  Province,
  Question,
  QuestionTranslation,
  ShippingFeeMethod,
  Size,
  Spec,
  SpecTranslation,
  SubCategoryTranslation,
} from '@/lib/generated/prisma'
import { useQuery } from '@tanstack/react-query'
// import { NumberInput } from '@tremor/react'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FC, useTransition } from 'react'
import ClickToAddInputsRHF from '../../../components/click-to-add'
import { DateTimePicker } from '../../../components/date-time/date-time-picker'
import InputFileUpload from '../../../components/file-input/InputFileUpload'
import { ImageInput } from '../../../components/image-color/image-input'
import InputFieldset from '../../../components/input-fieldset'
import { TagsInput } from '../../../components/tag-input'
import RichTextEditor from '../../../components/text-editor/react-text-editor'
import { createProduct, editProduct } from '../../../lib/actions/products'
import { getSubCategoryByCategoryId } from '../../../lib/queries/server-queries'
import { ProductFormSchema } from '../../../lib/schemas'
import { handleServerErrors } from '../../../lib/server-utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LANGUAGES } from '../../../components/constants'
import { Textarea } from '@/components/ui/textarea'

const shippingFeeMethods = [
  {
    value: ShippingFeeMethod.WEIGHT,
    // description: 'WEIGHT (Fees calculated based on product weight)',
    description: 'وزن: پست براساس وزن محصول',
  },
  {
    value: ShippingFeeMethod.ITEM,
    // description: 'ITEM (Fees calculated based on number of products.)',
    description: 'تعداد: پست براساس تعداد محصول',
  },
  {
    value: ShippingFeeMethod.FIXED,
    description: 'ثابت: پست با کرایه ثابت',
    // description: 'FIXED (Fees are fixed.)',
  },
]

interface ProductFormProps {
  data?: Partial<
    Product & { images: Partial<Image>[] | null } & {
      translations: ProductTranslation[]
    } & {
      specs:
        | Partial<Spec & { translations: Partial<SpecTranslation>[] }>[]
        | null
    } & {
      questions:
        | Partial<Question & { translations: Partial<QuestionTranslation>[] }>[]
        | null
    } & {
      variants:
        | (Partial<ProductVariant> & {
            color: Partial<Color> | null
          } & { size: Partial<Size> | null } & {
            images: Partial<Image>[] | null
          })[]
        | null
    }
  >
  categories: Partial<Category & { translations: CategoryTranslation[] }>[]
  offerTags: (OfferTag & { translations: OfferTagTranslation[] })[]
  provinces?: Province[]
  // subCategories?: SubCategory[]
}

const ProductDetails: FC<ProductFormProps> = ({
  data,
  categories,
  offerTags,
}) => {
  // console.log({ data })
  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      images: data?.images || [],
      // variantImages: data?.variantImages || [],
      categoryId: data?.categoryId,
      isFeatured: data?.isFeatured || false,

      offerTagId: data?.offerTagId || undefined,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand || '',

      shippingFeeMethod: data?.shippingFeeMethod,

      sku: data?.sku ?? '',
      // colors: data?.colors?.map((clr) => ({ color: clr.name })) ?? [],

      variants: data?.variants?.map((v) => ({
        size: v?.size?.name,
        color: v?.color?.name,
        colorHex: v?.color?.hex,
        quantity: v.quantity,
        price: v.price,
        discount: v.discount || 0,
        weight: v.weight || 0,
        length: v.length || 0,
        width: v.width || 0,
        height: v.height || 0,
        // sku: v.sku || '',
      })) ?? [
        {
          size: '',
          color: '',
          colorHex: '#000000',
          quantity: 1,
          price: 1000,
          discount: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          // sku: '',
        },
      ],

      isSale: data?.isSale || false,
      saleEndDate: data?.saleEndDate
        ? new Date(data.saleEndDate)
        : new Date(new Date().setHours(23, 59, 59, 0)),
      keywords: data?.keywords ? data.keywords.split(',') : [],
      translations: {
        fa: {
          name:
            data?.translations?.find((t: any) => t.language === 'fa')?.name ??
            '',
          description:
            data?.translations?.find((t: any) => t.language === 'fa')
              ?.description ?? '',
        },
        en: {
          name:
            data?.translations?.find((t: any) => t.language === 'en')?.name ??
            '',
          description:
            data?.translations?.find((t: any) => t.language === 'en')
              ?.description ?? '',
        },
        de: {
          name:
            data?.translations?.find((t: any) => t.language === 'de')?.name ??
            '',
          description:
            data?.translations?.find((t: any) => t.language === 'de')
              ?.description ?? '',
        },
        fr: {
          name:
            data?.translations?.find((t: any) => t.language === 'fr')?.name ??
            '',
          description:
            data?.translations?.find((t: any) => t.language === 'fr')
              ?.description ?? '',
        },
        it: {
          name:
            data?.translations?.find((t: any) => t.language === 'it')?.name ??
            '',
          description:
            data?.translations?.find((t: any) => t.language === 'it')
              ?.description ?? '',
        },
      },

      // NEW: Specs with translations
      specs:
        data?.specs?.map((spec: any) => ({
          fa: {
            name:
              spec.translations?.find((t: any) => t.language === 'fa')?.name ??
              '',
            value:
              spec.translations?.find((t: any) => t.language === 'fa')?.value ??
              '',
          },
          en: {
            name:
              spec.translations?.find((t: any) => t.language === 'en')?.name ??
              '',
            value:
              spec.translations?.find((t: any) => t.language === 'en')?.value ??
              '',
          },
          de: {
            name:
              spec.translations?.find((t: any) => t.language === 'de')?.name ??
              '',
            value:
              spec.translations?.find((t: any) => t.language === 'de')?.value ??
              '',
          },
          fr: {
            name:
              spec.translations?.find((t: any) => t.language === 'fr')?.name ??
              '',
            value:
              spec.translations?.find((t: any) => t.language === 'fr')?.value ??
              '',
          },
          it: {
            name:
              spec.translations?.find((t: any) => t.language === 'it')?.name ??
              '',
            value:
              spec.translations?.find((t: any) => t.language === 'it')?.value ??
              '',
          },
        })) ?? [],

      // NEW: Questions with translations
      questions:
        data?.questions?.map((q: any) => ({
          fa: {
            question:
              q.translations?.find((t: any) => t.language === 'fa')?.question ??
              '',
            answer:
              q.translations?.find((t: any) => t.language === 'fa')?.answer ??
              '',
          },
          en: {
            question:
              q.translations?.find((t: any) => t.language === 'en')?.question ??
              '',
            answer:
              q.translations?.find((t: any) => t.language === 'en')?.answer ??
              '',
          },
          de: {
            question:
              q.translations?.find((t: any) => t.language === 'de')?.question ??
              '',
            answer:
              q.translations?.find((t: any) => t.language === 'de')?.answer ??
              '',
          },
          fr: {
            question:
              q.translations?.find((t: any) => t.language === 'fr')?.question ??
              '',
            answer:
              q.translations?.find((t: any) => t.language === 'fr')?.answer ??
              '',
          },
          it: {
            question:
              q.translations?.find((t: any) => t.language === 'it')?.question ??
              '',
            answer:
              q.translations?.find((t: any) => t.language === 'it')?.answer ??
              '',
          },
        })) ?? [],
    },
  })

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: 'specs',
  })
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: 'variants',
  })

  const { data: SubCategories, isPending: isPendingCategory } = useQuery({
    queryKey: ['subCateByCat', form.watch().categoryId],
    queryFn: () => getSubCategoryByCategoryId(form.watch().categoryId),
  })

  const errors = form.formState.errors

  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    startTransition(async () => {
      try {
        if (data) {
          const res = await editProduct(values, data.id as string, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
        } else {
          const res = await createProduct(values, path)
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
  // const addMainVariantColor = (newColorValue: string) => {
  //   const exists = colorFields.some((cf) => cf.color === newColorValue)
  //   if (!exists && newColorValue && newColorValue.trim() !== '') {
  //     appendColor({ color: newColorValue })
  //   } else if (exists) {
  //     toast.info(`Color ${newColorValue} already exists.`)
  //   }
  // }

  const createVariantFromColor = (color: { name: string; hex: string }) => {
    const existingVariants = form.getValues('variants')
    const isDuplicate = existingVariants.some(
      (variant) => variant.colorHex === color.hex
    )

    if (isDuplicate) {
      // toast.info(`A variant with the color ${color.name} already exists.`)
      toast.info(`موجود است! ${color.name} یک واریانت با رنگ`)
      return
    }

    appendVariant({
      color: color.name,
      colorHex: color.hex,
      size: '',
      quantity: 1,
      price: 1000,
      discount: 0,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      // sku: '',
    })
    toast.success(
      `ایجاد شد، لطفا جزئیات آنرا پر کنید. ${color.name} وریانت رنگ`
    )
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>اطلاعات محصولات</CardTitle>
          <CardDescription>
            {data?.id
              ? `آپدیت محصول ${
                  data?.translations?.find((tr) => tr.language === 'fa')?.name
                }`
              : ' محصول جدید ایجاد کنید. شما می‌توانید بعدا از جدول محصولات آنرا ویرایش کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="w-60 h-60 mb-16">
                <InputFileUpload
                  className="w-full"
                  // initialDataImages={
                  //   data?.variantImage ? data?.variantImage : []
                  // }
                  initialDataImages={
                    data?.images
                      ? data.images.filter(
                          (image): image is NonNullable<typeof image> =>
                            image !== undefined
                        )
                      : []
                  }
                  name="images"
                  label="عکسها"
                />
              </div>

              {/*     
              <InputFieldset label="نام" isMandatory>
                <div className="flex flex-col lg:flex-row gap-4">
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="نام محصول" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset> 
              <InputFieldset
                isMandatory
                label="توضحیات"
                description={
                  'توجه: قسمت توضیحات، توضیحات اصلی محصول در صفحه محصول است و باید کامل باشد.'
                }
              >
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RichTextEditor
                          {...field}
                          // config={config}

                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputFieldset> */}
              <InputFieldset label="نام و توضیحات محصول" isMandatory>
                <Tabs dir="rtl" defaultValue="fa" className="w-full space-y-6">
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
                      {/* Name */}
                      <FormField
                        disabled={isPending}
                        control={form.control}
                        name={`translations.${lang.code}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              نام محصول ({lang.label}){' '}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`نام محصول به ${lang.label}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        disabled={isPending}
                        control={form.control}
                        name={`translations.${lang.code}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              توضیحات ({lang.label}){' '}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              توضیحات اصلی محصول در صفحه محصول است و باید کامل
                              باشد.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </InputFieldset>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageInput
                  name="variantImages"
                  label="عکس وریانتها"
                  initialDataImages={data?.variants?.flatMap(
                    (vr) => vr.images ?? []
                  )}
                  createVariantFromColor={createVariantFromColor}
                />
              </div>

              <InputFieldset label="انواع محصول (وریانت‌ها)" isMandatory>
                <ClickToAddInputsRHF
                  fields={variantFields as any}
                  name="variants"
                  control={form.control}
                  register={form.register}
                  setValue={form.setValue}
                  getValues={form.getValues}
                  onAppend={() =>
                    appendVariant({
                      size: '',
                      color: '',
                      colorHex: '#000000',
                      quantity: 1,
                      price: 1000,
                      discount: 0,
                      weight: 0,
                      length: 0,
                      width: 0,
                      height: 0,
                      // sku: '',
                    })
                  }
                  onRemove={removeVariant}
                  initialDetailSchema={{
                    size: '',
                    color: '',
                    colorHex: '#000000',
                    quantity: 1,
                    price: 1000,
                    discount: 0,
                    weight: 0,
                    length: 0,
                    width: 0,
                    height: 0,
                    // sku: '',
                  }}
                  labels={{
                    size: 'سایز',
                    color: 'نام رنگ',
                    colorHex: 'کد رنگ',
                    quantity: 'تعداد',
                    price: 'قیمت',
                    discount: 'تخفیف',
                    weight: 'وزن (g)',
                    length: 'طول (cm)',
                    width: 'عرض (cm)',
                    height: 'ارتفاع (cm)',
                    // sku: 'SKU',
                  }}
                  isMandatory
                />
                {form.formState.errors.variants && (
                  <span className="text-sm font-medium text-destructive">
                    {form.formState.errors.variants.message ||
                      (form.formState.errors.variants as any)?.root?.message}
                  </span>
                )}
              </InputFieldset>
              <InputFieldset label="دسته‌بندی" isMandatory>
                <div className="flex gap-4">
                  <FormField
                    disabled={isPending}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={
                            isPending ||
                            isPendingCategory ||
                            categories.length == 0
                          }
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="یک دسته‌بندی انتخاب کنید"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id!}
                              >
                                {
                                  category.translations?.find(
                                    (tr) => tr.language === 'fa'
                                  )?.name
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={
                            isPending ||
                            isPendingCategory ||
                            categories.length == 0 ||
                            !form.getValues().categoryId
                          }
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="زیردسته‌بندی را انتخاب کنید"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SubCategories?.map((sub: any) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {
                                  sub.translations?.find(
                                    (tr: SubCategoryTranslation) =>
                                      tr.language === 'fa'
                                  )?.name
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="offerTagId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={isPending || categories.length == 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="یک تگ برای محصول انتخاب کنید"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {offerTags &&
                              offerTags.map((offer) => (
                                <SelectItem key={offer.id} value={offer.id}>
                                  {
                                    offer.translations?.find(
                                      (tr) => tr.language === 'fa'
                                    )?.name
                                  }
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>

              {/* Brand, Sku, Weight */}
              <InputFieldset label={'برند محصول'}>
                <div className="flex flex-col lg:flex-row gap-4">
                  <FormField
                    disabled={isPending}
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="برند محصول" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>

              <InputFieldset label="SKU محصول">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>
              <InputFieldset
                label="کلمات کلیدی"
                isMandatory
                description="کلمه را وارد کرده، سپس اینتر &crarr; بزنید."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="relative flex-1">
                        <FormLabel>کلمات کلیدی محصول</FormLabel>
                        <FormControl>
                          <TagsInput
                            maxItems={10}
                            value={field?.value || []}
                            onValueChange={field.onChange}
                            placeholder="چرم گاوی"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>

              <InputFieldset label="خصوصیات محصول">
                <div className="w-full space-y-4">
                  {specFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">خصوصیت {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSpec(index)}
                        >
                          حذف
                        </Button>
                      </div>

                      <Tabs dir="rtl" defaultValue="fa" className="w-full">
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
                            <FormField
                              control={form.control}
                              name={`specs.${index}.${lang.code}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>عنوان ({lang.label})</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`عنوان به ${lang.label}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`specs.${index}.${lang.code}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>مقدار ({lang.label})</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`مقدار به ${lang.label}`}
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
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendSpec({
                        fa: { name: '', value: '' },
                        en: { name: '', value: '' },
                        de: { name: '', value: '' },
                        fr: { name: '', value: '' },
                        it: { name: '', value: '' },
                      })
                    }
                  >
                    افزودن خصوصیت
                  </Button>
                  {errors.specs && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.specs.message}
                    </span>
                  )}
                </div>
              </InputFieldset>
              {/* Questions*/}

              <InputFieldset label="سوال و جوابهای راجع به محصول">
                <div className="w-full space-y-4">
                  {questionFields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">سوال {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          حذف
                        </Button>
                      </div>

                      <Tabs dir="rtl" defaultValue="fa" className="w-full">
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
                            <FormField
                              control={form.control}
                              name={`questions.${index}.${lang.code}.question`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>سوال ({lang.label})</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder={`سوال به ${lang.label}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`questions.${index}.${lang.code}.answer`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>جواب ({lang.label})</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder={`جواب به ${lang.label}`}
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
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendQuestion({
                        fa: { question: '', answer: '' },
                        en: { question: '', answer: '' },
                        de: { question: '', answer: '' },
                        fr: { question: '', answer: '' },
                        it: { question: '', answer: '' },
                      })
                    }
                  >
                    افزودن سوال
                  </Button>
                  {errors.questions && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.questions.message}
                    </span>
                  )}
                </div>
              </InputFieldset>

              {/* Shipping fee method */}

              <InputFieldset
                label="متد پست محصول"
                description="پست چرم داخلی با وزن است."
                isMandatory
              >
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="shippingFeeMethod"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="انتخاب نحوه محاسبه هزینه ارسال"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shippingFeeMethods.map((method) => (
                            <SelectItem
                              key={method.value}
                              value={method.value}
                              defaultValue={shippingFeeMethods[0].value}
                              // disabled
                            >
                              {method.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InputFieldset>

              <InputFieldset
                label="فروش ویژه"
                description="آیا محصول شما در فروش ویژه است؟"
              >
                <div className="flex flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="isSale"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            dir="ltr"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-readonly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <>
                    {form.getValues('isSale') ? (
                      <>
                        <DateTimePicker
                          name="saleEndDate"
                          label="تاریخ اتمام فروش ویژه"
                        />
                        <FormDescription className="">
                          انتخاب دقیق <span className="text-red-500">ساعت</span>{' '}
                          پایان فروش الزامی است!
                        </FormDescription>
                      </>
                    ) : null}
                  </>
                </div>
              </InputFieldset>
              <FormField
                control={form.control}
                name="isFeatured"
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
                          محصول ویژه در صفحه اصلی نمایش داده می‌شود.
                        </FormDescription>
                      </div>
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : data?.id ? (
                  'ذخیره تغییرات'
                ) : (
                  'ایجاد محصول'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default ProductDetails
