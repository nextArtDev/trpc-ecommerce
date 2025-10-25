'use server'

import slugify from 'slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { ProductFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateUniqueSlug } from '../server-utils'
import { Language } from '@/lib/generated/prisma'

interface CreateProductFormState {
  success?: string
  errors: {
    translations?: string[]
    isFeatured?: string[]
    images?: string[]
    categoryId?: string[]
    subCategoryId?: string[]
    offerTagId?: string[]
    brand?: string[]
    specs?: string[]
    keywords?: string[]
    questions?: string[]
    variants?: string[]
    _form?: string[]
    // [key: string]: unknown // Allow for other fields
  }
}

export async function createProduct(
  data: unknown,
  path: string
): Promise<CreateProductFormState> {
  const result = ProductFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  try {
    const {
      variants,
      images,
      variantImages,
      specs,
      questions,
      brand,
      translations,
      ...productData
    } = result.data

    const isExistingProduct = await prisma.productTranslation.findFirst({
      where: {
        name: translations.fa.name,
        language: 'fa',
      },
    })

    if (isExistingProduct) {
      return {
        errors: {
          _form: ['محصول با این نام موجود است!'],
        },
      }
    }

    const productSlug = await generateUniqueSlug(
      slugify(translations.en.name, {
        replacement: '-',
        lower: true,
        trim: true,
      }),
      'product'
    )

    // Handle main product images
    let imageIds: string[] = []
    if (images) {
      const filesToUpload = images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]
    }

    // Handle variant images (global variant images)
    let variantImageIds: string[] = []
    if (variantImages) {
      const filesToUpload = variantImages.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      variantImageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]
    }

    await prisma.$transaction(async (tx) => {
      // Create the main product
      const product = await tx.product.create({
        data: {
          ...productData,
          brand: brand || '',
          slug: productSlug,
          keywords: productData.keywords?.join(',') ?? '',
          saleEndDate: String(productData.saleEndDate),
          images: { connect: imageIds.map((id) => ({ id })) },
          translations: {
            create: [
              {
                language: 'fa' as Language,
                name: translations.fa.name,
                description: translations.fa.description,
              },
              {
                language: 'en' as Language,
                name: translations.en.name,
                description: translations.en.description,
              },
              {
                language: 'de' as Language,
                name: translations.de.name,
                description: translations.de.description,
              },
              {
                language: 'fr' as Language,
                name: translations.fr.name,
                description: translations.fr.description,
              },
              {
                language: 'it' as Language,
                name: translations.it.name,
                description: translations.it.description,
              },
            ],
          },
        },
      })

      // Create Variants
      for (const variantData of variants) {
        // Create or get Size
        const size = await tx.size.upsert({
          where: { name: variantData.size },
          update: {},
          create: { name: variantData.size },
        })

        // Create or get Color
        const color = await tx.color.upsert({
          where: { hex: variantData.colorHex },
          update: { name: variantData.color },
          create: { name: variantData.color, hex: variantData.colorHex },
        })

        // Create the variant
        await tx.productVariant.create({
          data: {
            productId: product.id,
            sizeId: size.id,
            colorId: color.id,
            price: variantData.price,
            quantity: variantData.quantity,
            discount: variantData.discount || 0,
            weight: variantData.weight,
            length: variantData.length,
            width: variantData.width,
            height: variantData.height,
            // sku: variantData.sku,
            // Connect variant images (these are shared across all variants for now)
            images: { connect: variantImageIds.map((id) => ({ id })) },
          },
        })
      }

      // Create Specs if they exist
      if (specs && specs.length > 0) {
        for (const specData of specs) {
          // Only create if at least one language has content
          if (specData.fa.name.trim() !== '') {
            await tx.spec.create({
              data: {
                productId: product.id,
                translations: {
                  create: [
                    {
                      language: 'fa' as Language,
                      name: specData.fa.name,
                      value: specData.fa.value,
                    },
                    {
                      language: 'en' as Language,
                      name: specData.en.name,
                      value: specData.en.value,
                    },
                    {
                      language: 'de' as Language,
                      name: specData.de.name,
                      value: specData.de.value,
                    },
                    {
                      language: 'fr' as Language,
                      name: specData.fr.name,
                      value: specData.fr.value,
                    },
                    {
                      language: 'it' as Language,
                      name: specData.it.name,
                      value: specData.it.value,
                    },
                  ],
                },
              },
            })
          }
        }
      }

      // NEW: Create Questions with translations
      if (questions && questions.length > 0) {
        for (const questionData of questions) {
          // Only create if at least one language has content
          if (questionData.fa.question.trim() !== '') {
            await tx.question.create({
              data: {
                productId: product.id,
                translations: {
                  create: [
                    {
                      language: 'fa' as Language,
                      question: questionData.fa.question,
                      answer: questionData.fa.answer,
                    },
                    {
                      language: 'en' as Language,
                      question: questionData.en.question,
                      answer: questionData.en.answer,
                    },
                    {
                      language: 'de' as Language,
                      question: questionData.de.question,
                      answer: questionData.de.answer,
                    },
                    {
                      language: 'fr' as Language,
                      question: questionData.fr.question,
                      answer: questionData.fr.answer,
                    },
                    {
                      language: 'it' as Language,
                      question: questionData.it.question,
                      answer: questionData.it.answer,
                    },
                  ],
                },
              },
            })
          }
        }
      }
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }

  revalidatePath(path)
  redirect(`/dashboard/products`)
}

export async function editProduct(
  data: unknown,
  productId: string,
  path: string
): Promise<CreateProductFormState> {
  const result = ProductFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  if (!productId) {
    return {
      errors: {
        _form: ['محصول موجود نیست!'],
      },
    }
  }

  try {
    const isExisting = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: { select: { id: true, key: true } },
        translations: true,
        variants: {
          include: {
            images: { select: { id: true, key: true } },
            size: true,
            color: true,
          },
        },
      },
    })

    if (!isExisting) {
      return {
        errors: {
          _form: ['محصول حذف شده است!'],
        },
      }
    }

    const isNameExisting = await prisma.productTranslation.findFirst({
      where: {
        name: result.data.translations.fa.name,
        language: 'fa',
        NOT: {
          productId: productId,
        },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['محصول با این نام موجود است!'],
        },
      }
    }

    // Handle main product image updates
    if (
      typeof result.data?.images?.[0] === 'object' &&
      result.data.images[0] instanceof File
    ) {
      if (isExisting.images && isExisting.images.length > 0) {
        const oldImageKeys = isExisting.images.map((img) => img.key)
        await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      }

      const filesToUpload = result.data.images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      const imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]

      await prisma.product.update({
        where: { id: productId },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
            connect: imageIds.map((id) => ({ id })),
          },
        },
      })
    }

    // Handle variant images updates
    if (
      typeof result.data?.variantImages?.[0] === 'object' &&
      result.data.variantImages[0] instanceof File
    ) {
      // Delete old variant images
      if (isExisting.variants && isExisting.variants.length > 0) {
        for (const variant of isExisting.variants) {
          if (variant.images && variant.images.length > 0) {
            const oldImageKeys = variant.images.map((img) => img.key)
            await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
          }
        }
      }

      const filesToUpload = result.data.variantImages.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      const variantImageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]

      // Update all variants with new images
      for (const variant of isExisting.variants) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
            images: {
              disconnect: variant.images?.map((image: { id: string }) => ({
                id: image.id,
              })),
              connect: variantImageIds.map((id) => ({ id })),
            },
          },
        })
      }
    }

    // Main transaction for product updates
    await prisma.$transaction(async (tx) => {
      // Update product basic info
      await tx.product.update({
        where: { id: productId },
        data: {
          categoryId: result.data.categoryId,
          subCategoryId: result.data.subCategoryId,

          brand: result.data?.brand || '',
          shippingFeeMethod: result.data.shippingFeeMethod,
          isFeatured: result.data?.isFeatured,
          keywords: result.data.keywords?.length
            ? result.data.keywords?.join(',')
            : '',
          sku: result.data.sku ? result.data.sku : '',
          isSale: result.data.isSale,
          saleEndDate: String(result.data.saleEndDate),
        },
      })
      const languages: Array<'fa' | 'en' | 'de' | 'fr' | 'it'> = [
        'fa',
        'en',
        'de',
        'fr',
        'it',
      ]

      for (const lang of languages) {
        await tx.productTranslation.upsert({
          where: {
            productId_language: {
              productId: productId,
              language: lang as Language,
            },
          },
          update: {
            name: result.data.translations[lang].name,
            description: result.data.translations[lang].description,
          },
          create: {
            productId: productId,
            language: lang as Language,
            name: result.data.translations[lang].name,
            description: result.data.translations[lang].description,
          },
        })
      }

      // Handle specs - delete and recreate
      await tx.spec.deleteMany({
        where: { productId: productId },
      })

      if (result.data.specs && result.data.specs.length > 0) {
        for (const specData of result.data.specs) {
          if (specData.fa.name.trim() !== '') {
            await tx.spec.create({
              data: {
                productId: productId,
                translations: {
                  create: [
                    {
                      language: 'fa' as Language,
                      name: specData.fa.name,
                      value: specData.fa.value,
                    },
                    {
                      language: 'en' as Language,
                      name: specData.en.name,
                      value: specData.en.value,
                    },
                    {
                      language: 'de' as Language,
                      name: specData.de.name,
                      value: specData.de.value,
                    },
                    {
                      language: 'fr' as Language,
                      name: specData.fr.name,
                      value: specData.fr.value,
                    },
                    {
                      language: 'it' as Language,
                      name: specData.it.name,
                      value: specData.it.value,
                    },
                  ],
                },
              },
            })
          }
        }
      }

      // NEW: Handle questions with translations - delete and recreate
      await tx.question.deleteMany({
        where: { productId: productId },
      })

      if (result.data.questions && result.data.questions.length > 0) {
        for (const questionData of result.data.questions) {
          if (questionData.fa.question.trim() !== '') {
            await tx.question.create({
              data: {
                productId: productId,
                translations: {
                  create: [
                    {
                      language: 'fa' as Language,
                      question: questionData.fa.question,
                      answer: questionData.fa.answer,
                    },
                    {
                      language: 'en' as Language,
                      question: questionData.en.question,
                      answer: questionData.en.answer,
                    },
                    {
                      language: 'de' as Language,
                      question: questionData.de.question,
                      answer: questionData.de.answer,
                    },
                    {
                      language: 'fr' as Language,
                      question: questionData.fr.question,
                      answer: questionData.fr.answer,
                    },
                    {
                      language: 'it' as Language,
                      question: questionData.it.question,
                      answer: questionData.it.answer,
                    },
                  ],
                },
              },
            })
          }
        }
      }
      // Handle variants - SMART UPDATE to preserve cart items
      if (result.data.variants) {
        const existingVariants = await tx.productVariant.findMany({
          where: { productId },
          include: {
            size: true,
            color: true,
            images: { select: { id: true, key: true } },
          },
        })

        // Track processed variants by size-color combination
        const formVariantKeys = result.data.variants.map(
          (v) => `${v.size}-${v.colorHex}`
        )

        // Process each variant from the form
        for (const variantData of result.data.variants) {
          const variantKey = `${variantData.size}-${variantData.colorHex}`

          // Find existing variant by size name and color hex
          const existingVariant = existingVariants.find(
            (v) => `${v.size.name}-${v.color.hex}` === variantKey
          )

          // Create or get Size
          const size = await tx.size.upsert({
            where: { name: variantData.size },
            update: {},
            create: { name: variantData.size },
          })

          // Create or get Color
          const color = await tx.color.upsert({
            where: { hex: variantData.colorHex },
            update: { name: variantData.color },
            create: { name: variantData.color, hex: variantData.colorHex },
          })

          if (existingVariant) {
            // Update existing variant
            await tx.productVariant.update({
              where: { id: existingVariant.id },
              data: {
                sizeId: size.id,
                colorId: color.id,
                quantity: variantData.quantity,
                price: variantData.price,
                discount: variantData.discount || 0,
                weight: variantData.weight,
                length: variantData.length,
                width: variantData.width,
                height: variantData.height,
                // sku: variantData.sku,
              },
            })
          } else {
            // Create new variant
            await tx.productVariant.create({
              data: {
                productId,
                sizeId: size.id,
                colorId: color.id,
                quantity: variantData.quantity,
                price: variantData.price,
                discount: variantData.discount || 0,
                weight: variantData.weight,
                length: variantData.length,
                width: variantData.width,
                height: variantData.height,
                // sku: variantData.sku,
              },
            })
          }
        }

        // Delete variants that are no longer in the form
        const variantsToDelete = existingVariants.filter(
          (existingVariant) =>
            !formVariantKeys.includes(
              `${existingVariant.size.name}-${existingVariant.color.hex}`
            )
        )

        if (variantsToDelete.length > 0) {
          // Delete variant images first
          for (const variant of variantsToDelete) {
            if (variant.images && variant.images.length > 0) {
              const oldImageKeys = variant.images.map((img) => img.key)
              await Promise.all(
                oldImageKeys.map((key) => deleteFileFromS3(key))
              )
            }
          }

          await tx.productVariant.deleteMany({
            where: {
              id: {
                in: variantsToDelete.map((v) => v.id),
              },
            },
          })
        }
      }
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }

  revalidatePath(path)
  redirect(`/dashboard/products`)
}

interface DeleteProductFormState {
  errors: {
    images?: string[]
    _form?: string[]
  }
}

export async function deleteProduct(
  path: string,
  productId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteProductFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteProductFormState> {
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  if (!productId) {
    return {
      errors: {
        _form: ['محصول در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: true,
        variants: {
          include: {
            images: true,
          },
        },
      },
    })

    if (!isExisting) {
      return {
        errors: {
          _form: ['محصول حذف شده است!'],
        },
      }
    }

    const ordersWithProduct = await prisma.orderItem.count({
      where: { productSlug: isExisting.slug },
    })

    if (ordersWithProduct > 0) {
      return {
        errors: {
          _form: ['نمی‌توان محصول را حذف کرد زیرا در سفارشات موجود است!'],
        },
      }
    }

    // Delete product images from S3
    if (isExisting?.images && isExisting.images.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)
      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
    }

    // Delete variant images from S3
    if (isExisting?.variants && isExisting.variants.length > 0) {
      for (const variant of isExisting.variants) {
        if (variant.images && variant.images.length > 0) {
          const oldImageKeys = variant.images.map((img) => img.key)
          await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
        }
      }
    }

    // Delete the product (cascading will handle variants)
    await prisma.product.delete({
      where: {
        id: isExisting.id,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }

  revalidatePath(path)
  redirect(`/dashboard/products`)
}
