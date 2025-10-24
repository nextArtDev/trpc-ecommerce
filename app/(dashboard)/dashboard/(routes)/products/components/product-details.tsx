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
  Color,
  Image,
  OfferTag,
  Product,
  ProductVariant,
  Province,
  Question,
  ShippingFeeMethod,
  Size,
  Spec,
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
      specs: Partial<Spec>[] | null
    } & {
      questions: Partial<Question>[] | null
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
  categories: Partial<Category>[]
  offerTags: OfferTag[]
  provinces?: Province[]
  // subCategories?: SubCategory[]
}

const ProductDetails: FC<ProductFormProps> = ({
  data,
  categories,
  offerTags,
}) => {
  const path = usePathname()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name,
      description: data?.description,
      images: data?.images || [],
      // variantImages: data?.variantImages || [],
      categoryId: data?.categoryId,
      isFeatured: data?.isFeatured || false,

      offerTagId: data?.offerTagId || undefined,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand || '',
      specs: data?.specs?.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })) ?? [{ name: '', value: '' }],
      questions: data?.questions?.map((question) => ({
        question: question.question,
        answer: question.answer,
      })) ?? [{ question: '', answer: '' }],
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

  // const {
  //   fields: colorFields,
  //   append: appendColor,
  //   remove: removeColor,
  // } = useFieldArray({
  //   control: form.control,
  //   name: 'colors',
  // })

  // const {
  //   fields: sizeFields,
  //   append: appendSize,
  //   remove: removeSize,
  // } = useFieldArray({
  //   control: form.control,
  //   name: 'sizes',
  // })
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
  // const { data: citiesForFreeShipping } = useQuery({
  //   queryKey: ['province-for-shipping', provinceNameForShopping],
  //   queryFn: () => getCityByProvinceId(provinceNameForShopping),
  //   enabled: !!provinceNameForShopping,
  // })
  // console.log({ citiesForFreeShipping })
  const errors = form.formState.errors
  // console.log(errors)
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    // console.log({ values })
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

  // const handleDeleteCityFreeShipping = (index: number) => {
  //   const currentValues = form.getValues().freeShippingCityIds
  //   const updatedValues = currentValues?.filter((_, i) => i !== index)
  //   form.setValue('freeShippingCityIds', updatedValues)
  // }
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>اطلاعات محصولات</CardTitle>
          <CardDescription>
            {data?.id
              ? `آپدیت محصول ${data?.name}`
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

              {/* Name   */}
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
              {/* Product and variant description editors (tabs) */}
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
                {/* <div className="space-y-4">
                  <ClickToAddInputsRHF
                    fields={variantFields}
                    name="variants"
                    control={form.control}
                    register={form.register}
                    setValue={form.setValue}
                    getValues={form.getValues}
                    onAppend={() => appendColor({ color: '' })}
                    onRemove={removeColor}
                    initialDetailSchema={{ color: '' }}
                    header="رنگها"
                    colorPicker
                    isMandatory
                  />
                  {form.formState.errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {form.formState.errors.colors.message ||
                        (form.formState.errors.colors as any)?.root?.message}
                    </span>
                  )}
                </div> */}
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
                    // control={form.control}
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
                                {category.name}
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
                            {SubCategories?.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Offer Tag */}
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
                                  {offer.name}
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

              <InputFieldset label="خصوصیات محصول" description={''}>
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputsRHF
                    fields={specFields}
                    name="specs"
                    control={form.control}
                    register={form.register}
                    setValue={form.setValue}
                    getValues={form.getValues}
                    onAppend={() => appendSpec({ name: '', value: '' })}
                    onRemove={removeSpec}
                    initialDetailSchema={{ name: '', value: '' }}
                    containerClassName="flex-1"
                    inputClassName="w-full"
                    labels={{
                      name: 'عنوان',
                      value: 'مقدار',
                    }}
                  />
                  {errors.specs && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.specs.message}
                    </span>
                  )}
                </div>
              </InputFieldset>
              {/* Questions*/}

              <InputFieldset label="سوال و جوابهای راجع به محصول">
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputsRHF
                    fields={questionFields}
                    name="questions"
                    control={form.control}
                    register={form.register}
                    setValue={form.setValue}
                    getValues={form.getValues}
                    onAppend={() =>
                      appendQuestion({ question: '', answer: '' })
                    }
                    onRemove={removeQuestion}
                    initialDetailSchema={{ question: '', answer: '' }}
                    // details={questions}
                    // setDetails={setQuestions}
                    // initialDetail={{
                    //   question: '',
                    //   answer: '',
                    // }}
                    labels={{
                      question: 'سوال',
                      answer: 'جواب',
                    }}
                    containerClassName="flex-1"
                    inputClassName="w-full"
                  />
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
